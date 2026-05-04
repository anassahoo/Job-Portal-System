from __future__ import annotations

import re
from typing import Dict

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


SKILLS = [
    "python",
    "java",
    "javascript",
    "typescript",
    "c++",
    "c#",
    "php",
    "ruby",
    "sql",
    "html",
    "css",
    "react",
    "vue",
    "angular",
    "node",
    "node.js",
    "django",
    "flask",
    "fastapi",
    "pandas",
    "numpy",
    "scikit-learn",
    "sklearn",
    "machine learning",
    "deep learning",
    "nlp",
    "opencv",
    "tensorflow",
    "pytorch",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "git",
    "linux",
    "unix",
    "database",
    "mongodb",
    "postgresql",
    "mysql",
    "redis",
    "frontend",
    "backend",
    "fullstack",
    "full stack",
    "web",
    "mobile",
    "api",
    "rest",
    "graphql",
    "agile",
    "scrum",
]

PROJECT_KEYWORDS = [
    "project",
    "projects",
    "built",
    "developed",
    "designed",
    "implemented",
    "deployed",
    "portfolio",
    "github",
    "open source",
    "capstone",
    "hackathon",
]

TECHNOLOGY_KEYWORDS = [
    "ai",
    "ml",
    "machine learning",
    "deep learning",
    "web",
    "frontend",
    "backend",
    "full stack",
    "cloud",
    "api",
    "mobile",
    "data",
    "analytics",
    "automation",
    "docker",
    "aws",
    "azure",
    "gcp",
    "react",
    "node.js",
    "fastapi",
    "django",
    "flask",
]

EDUCATION_KEYWORDS = ["bs", "b.s", "bsc", "bachelor", "ms", "m.s", "msc", "master", "phd", "doctorate"]

YEARS_EXPERIENCE_PATTERN = re.compile(
    r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience",
    re.IGNORECASE,
)


def clean_text(text: str) -> str:
    """Normalize text by lowering case, stripping special characters, and collapsing spaces."""

    normalized = text.lower()
    normalized = re.sub(r"[^a-z0-9\s]+", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized.strip()


def _count_keyword_hits(text: str, keywords: list[str]) -> int:
    normalized_text = clean_text(text)
    hits = 0

    for keyword in keywords:
        pattern = r"\b" + re.escape(keyword.lower()) + r"\b"
        if re.search(pattern, normalized_text):
            hits += 1

    return hits


def _extract_years_of_experience(text: str) -> float:
    normalized_text = clean_text(text)
    matches = YEARS_EXPERIENCE_PATTERN.findall(normalized_text)
    if not matches:
        return 0.0

    years = [float(match) for match in matches]
    return max(years) if years else 0.0


def compute_match_percentage(resume_text: str, job_description: str) -> float:
    """Compute semantic overlap between a resume and a job description using TF-IDF + keyword matching."""

    if not resume_text.strip() or not job_description.strip():
        return 0.0

    # TF-IDF cosine similarity
    corpus = [clean_text(resume_text), clean_text(job_description)]
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(corpus)
    tfidf_similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    
    # Keyword overlap boost - count how many job description keywords appear in resume
    job_keywords = set(clean_text(job_description).split())
    resume_keywords = set(clean_text(resume_text).split())
    
    # Filter to meaningful keywords (not stop words, length > 3)
    meaningful_keywords = [k for k in job_keywords if len(k) > 3]
    if meaningful_keywords:
        overlap_count = sum(1 for k in meaningful_keywords if k in resume_keywords)
        keyword_match_ratio = overlap_count / len(meaningful_keywords)
    else:
        keyword_match_ratio = 0.0
    
    # Combine: 60% TF-IDF + 40% keyword overlap, then scale to 0-100
    combined_similarity = (tfidf_similarity * 0.6) + (keyword_match_ratio * 0.4)
    return round(float(combined_similarity * 100), 2)


def compute_resume_score(resume_text: str) -> float:
    """Score a resume based on skills, education signals, and experience mentions."""

    skill_hits = _count_keyword_hits(resume_text, SKILLS)
    education_hits = _count_keyword_hits(resume_text, EDUCATION_KEYWORDS)
    years_of_experience = _extract_years_of_experience(resume_text)

    skill_score = min(skill_hits * 6, 60)
    education_score = min(education_hits * 10, 20)
    experience_score = min(years_of_experience * 5, 20)

    return round(float(skill_score + education_score + experience_score), 2)


def compute_project_score(resume_text: str) -> float:
    """Score a resume based on project language and technology breadth."""

    project_hits = _count_keyword_hits(resume_text, PROJECT_KEYWORDS)
    technology_hits = _count_keyword_hits(resume_text, TECHNOLOGY_KEYWORDS)

    project_score = min(project_hits * 8, 50)
    technology_score = min(technology_hits * 5, 50)

    return round(float(project_score + technology_score), 2)


def build_feature_row(resume_text: str, job_description: str) -> Dict[str, float]:
    """Create the three-feature vector used by the models."""

    return {
        "match_percentage": compute_match_percentage(resume_text, job_description),
        "resume_score": compute_resume_score(resume_text),
        "project_score": compute_project_score(resume_text),
    }


def features_to_frame(features: Dict[str, float]) -> pd.DataFrame:
    """Convert a feature dictionary into the frame expected by scikit-learn."""

    return pd.DataFrame([features], columns=["match_percentage", "resume_score", "project_score"])
