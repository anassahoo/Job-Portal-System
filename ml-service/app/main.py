from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from predict import predict_from_features, predict_from_pdf


app = FastAPI(title="AI Job Application Analyzer API")


class ApplicationData(BaseModel):
    match_percentage: float
    resume_score: float
    project_score: float


class ResumePredictionRequest(BaseModel):
    pdf_path: str
    job_description: str


def build_suggestions(decision: str, reason: str | None) -> list[str]:
    if decision == "Interview":
        return [
            "Your profile is a good fit for review by the recruiter.",
            "Keep the resume clear and highlight the most relevant experience.",
            "Make sure the job-specific skills are easy to spot at the top.",
        ]

    if decision == "Rejected" and reason == "Skill Gap":
        return [
            "Learn the required skills mentioned in the job description",
            "Take focused online courses to close the gap",
            "Add relevant certifications or projects",
        ]
    if decision == "Rejected" and reason == "Weak Resume":
        return [
            "Use a clean professional resume format",
            "Highlight measurable achievements and impact",
            "Proofread for clarity and grammar issues",
        ]
    if decision == "Rejected" and reason == "Weak Projects":
        return [
            "Add more practical and end-to-end projects",
            "Deploy projects and share live links or GitHub repositories",
            "Show technologies used and the problem solved",
        ]

    return ["Improve the resume match with the target role and add more evidence of impact."]


def format_prediction_response(result: dict) -> dict:
    raw_decision = str(result.get("decision") or "").strip()
    raw_reason = result.get("reason")
    match_percentage = float(result["scores"]["match_percentage"])
    resume_score = float(result["scores"]["resume_score"])
    project_score = float(result["scores"]["project_score"])
    overall_score = round((match_percentage * 0.55) + (resume_score * 0.25) + (project_score * 0.20), 2)

    # ── Hard gate ─────────────────────────────────────────────────────────────
    # If match_percentage is below 35 the resume is simply not relevant to
    # this job — reject immediately regardless of resume/project quality.
    # A great resume for the WRONG job must still be rejected.
    if match_percentage < 35.0:
        decision = "Rejected"
        reason = raw_reason if raw_reason else "Skill Gap"
    else:
        # Above the gate: combined score decides
        decision = "Interview" if overall_score >= 40 else "Rejected"
        reason = raw_reason if decision == "Rejected" else None

    return {
        "match_percentage": match_percentage,
        "resume_score": resume_score,
        "project_score": project_score,
        "overall_score": overall_score,
        "decision": decision,
        "reason": reason,
        "prediction": reason if decision == "Rejected" else "None",
        "suggestions": build_suggestions(decision, reason),
    }


@app.get("/")
def read_root():
    return {"message": "Welcome to AI Job Application Analyzer System"}


@app.post("/predict")
def predict(data: ApplicationData):
    result = predict_from_features(data.match_percentage, data.resume_score, data.project_score)
    return format_prediction_response(result)


@app.post("/predict-pdf")
def predict_pdf(data: ResumePredictionRequest):
    result = predict_from_pdf(data.pdf_path, data.job_description)
    return format_prediction_response(result)

