from __future__ import annotations

import argparse
import pickle
from pathlib import Path
from typing import Dict, Optional

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from utils.feature_engineering import build_feature_row
from utils.pdf_parser import extract_text_from_pdf, extract_texts_from_folder, resolve_dataset_dir


PROJECT_ROOT = Path(__file__).resolve().parent
MODEL_DIR = PROJECT_ROOT / "model"
DATA_DIR = PROJECT_ROOT / "data"
DEFAULT_JOB_DESCRIPTION = (
    "We are hiring a Python or AI engineer with experience in machine learning, "
    "data analysis, web development, APIs, and deployed projects. Candidates should "
    "show strong resumes, relevant coursework, and practical project experience."
)


def find_labels_csv(labels_csv: str | Path | None = None) -> Optional[Path]:
    """Locate an optional labels.csv file in the project."""

    candidates = []
    if labels_csv is not None:
        candidates.append(Path(labels_csv))
    candidates.extend(
        [
            PROJECT_ROOT / "labels.csv",
            PROJECT_ROOT / "data" / "labels.csv",
            PROJECT_ROOT / "dataset" / "labels.csv",
            PROJECT_ROOT / "Dataset" / "labels.csv",
        ]
    )

    for candidate in candidates:
        if candidate.exists() and candidate.is_file():
            return candidate

    return None


def _normalize_column_name(column_name: str) -> str:
    return column_name.strip().lower().replace(" ", "_")


def load_labels(labels_csv: str | Path | None = None) -> Optional[pd.DataFrame]:
    """Load filename to label mappings if labels.csv exists."""

    labels_path = find_labels_csv(labels_csv)
    if labels_path is None:
        return None

    labels_df = pd.read_csv(labels_path)
    labels_df.columns = [_normalize_column_name(column) for column in labels_df.columns]

    filename_candidates = [
        "filename",
        "file_name",
        "resume_filename",
        "resume_file",
        "pdf_file",
        "document",
    ]
    decision_candidates = ["decision", "decision_label", "label", "application_decision"]
    reason_candidates = ["reason", "reason_label", "rejection_reason", "application_reason"]

    filename_column = next((column for column in filename_candidates if column in labels_df.columns), None)
    decision_column = next((column for column in decision_candidates if column in labels_df.columns), None)
    reason_column = next((column for column in reason_candidates if column in labels_df.columns), None)

    if filename_column is None or decision_column is None or reason_column is None:
        raise ValueError(
            "labels.csv must include a filename column plus decision and reason columns."
        )

    normalized_labels = labels_df[[filename_column, decision_column, reason_column]].copy()
    normalized_labels.columns = ["filename", "decision", "reason"]
    normalized_labels["filename"] = normalized_labels["filename"].astype(str).str.strip()
    normalized_labels["decision"] = normalized_labels["decision"].astype(str).str.strip()
    normalized_labels["reason"] = normalized_labels["reason"].astype(str).str.strip()
    return normalized_labels


def _weakest_reason(scores: Dict[str, float]) -> str:
    weakest_key = min(scores, key=scores.get)
    mapping = {
        "match_percentage": "Skill Gap",
        "resume_score": "Weak Resume",
        "project_score": "Weak Projects",
    }
    return mapping.get(weakest_key, "Weak Resume")


def _derive_pseudo_labels(scores: Dict[str, float]) -> tuple[str, str]:
    """Fallback labels for demo training when a labels.csv file is not available."""

    total_score = scores["match_percentage"] + scores["resume_score"] + scores["project_score"]

    if total_score >= 170:
        return "Accepted", "None"
    if total_score >= 120:
        return "Interview", _weakest_reason(scores)
    return "Rejected", _weakest_reason(scores)


def build_training_dataframe(
    dataset_dir: str | Path | None = None,
    job_description: str = DEFAULT_JOB_DESCRIPTION,
    labels_csv: str | Path | None = None,
) -> pd.DataFrame:
    """Build a feature table from resume PDFs and optional labels."""

    dataset_path = resolve_dataset_dir(dataset_dir)
    extracted_texts = extract_texts_from_folder(dataset_path)
    labels_df = load_labels(labels_csv)
    labels_lookup = {}

    if labels_df is not None:
        for _, row in labels_df.iterrows():
            labels_lookup[str(row["filename"]).strip()] = {
                "decision": str(row["decision"]).strip(),
                "reason": str(row["reason"]).strip(),
            }

    training_rows = []
    for filename, resume_text in extracted_texts.items():
        scores = build_feature_row(resume_text, job_description)
        labeled_values = labels_lookup.get(filename)

        if labeled_values is None:
            training_rows.append(
                {
                    "filename": filename,
                    "resume_text": resume_text,
                    **scores,
                }
            )
        else:
            decision = labeled_values["decision"]
            reason = labeled_values["reason"]
            if not decision:
                decision = _derive_pseudo_labels(scores)[0]
            if not reason:
                reason = "None" if decision == "Accepted" else _weakest_reason(scores)

            training_rows.append(
                {
                    "filename": filename,
                    "resume_text": resume_text,
                    **scores,
                    "decision": decision,
                    "reason": reason,
                }
            )

    training_df = pd.DataFrame(training_rows)
    if training_df.empty:
        raise ValueError(f"No PDF resumes were found in {dataset_path}.")

    if labels_df is None:
        total_scores = (
            training_df["match_percentage"] + training_df["resume_score"] + training_df["project_score"]
        )
        ranked_scores = total_scores.rank(method="first", pct=True)

        pseudo_decisions = []
        pseudo_reasons = []
        for percentile, (_, row) in zip(ranked_scores, training_df.iterrows()):
            scores = {
                "match_percentage": float(row["match_percentage"]),
                "resume_score": float(row["resume_score"]),
                "project_score": float(row["project_score"]),
            }
            if percentile >= 0.67:
                pseudo_decisions.append("Accepted")
                pseudo_reasons.append("None")
            elif percentile >= 0.34:
                pseudo_decisions.append("Interview")
                pseudo_reasons.append(_weakest_reason(scores))
            else:
                pseudo_decisions.append("Rejected")
                pseudo_reasons.append(_weakest_reason(scores))

        training_df["decision"] = pseudo_decisions
        training_df["reason"] = pseudo_reasons

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    training_df[["filename", "match_percentage", "resume_score", "project_score", "decision", "reason"]].to_csv(
        DATA_DIR / "training_dataset.csv",
        index=False,
    )
    training_df[["filename", "resume_text"]].to_csv(DATA_DIR / "extracted_resumes.csv", index=False)
    return training_df


def _can_stratify(labels: pd.Series) -> bool:
    label_counts = labels.value_counts()
    return len(label_counts) > 1 and label_counts.min() >= 2


def _train_classifier(
    X: pd.DataFrame,
    y: pd.Series,
    model_name: str,
    test_size: float = 0.2,
    random_state: int = 42,
) -> Dict[str, object]:
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y.astype(str))

    stratify_values = y_encoded if _can_stratify(y) else None
    indices = np.arange(len(X))
    train_indices, test_indices = train_test_split(
        indices,
        test_size=test_size,
        random_state=random_state,
        stratify=stratify_values,
    )

    X_train = X.iloc[train_indices]
    X_test = X.iloc[test_indices]
    y_train = y_encoded[train_indices]
    y_test = y_encoded[test_indices]

    classifier = RandomForestClassifier(
        n_estimators=200,
        random_state=random_state,
        class_weight="balanced_subsample",
    )
    classifier.fit(X_train, y_train)

    y_pred = classifier.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"\n{model_name} accuracy: {accuracy:.4f}")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_, zero_division=0))

    return {
        "model": classifier,
        "label_encoder": label_encoder,
        "accuracy": accuracy,
    }


def train_model(
    dataset_dir: str | Path | None = None,
    labels_csv: str | Path | None = None,
    job_description: str = DEFAULT_JOB_DESCRIPTION,
    test_size: float = 0.2,
) -> Dict[str, object]:
    """Train the decision and reason models from resume PDFs."""

    training_df = build_training_dataframe(dataset_dir, job_description, labels_csv)
    feature_columns = ["match_percentage", "resume_score", "project_score"]
    X = training_df[feature_columns]

    decision_result = _train_classifier(X, training_df["decision"], "Decision model", test_size=test_size)
    reason_result = _train_classifier(X, training_df["reason"], "Reason model", test_size=test_size)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    decision_bundle = {
        "model": decision_result["model"],
        "label_encoder": decision_result["label_encoder"],
        "feature_columns": feature_columns,
        "job_description": job_description,
    }
    reason_bundle = {
        "model": reason_result["model"],
        "label_encoder": reason_result["label_encoder"],
        "feature_columns": feature_columns,
        "job_description": job_description,
    }

    with (MODEL_DIR / "decision_model.pkl").open("wb") as file_handle:
        pickle.dump(decision_bundle, file_handle)

    with (MODEL_DIR / "reason_model.pkl").open("wb") as file_handle:
        pickle.dump(reason_bundle, file_handle)

    print(f"\nSaved decision model to {MODEL_DIR / 'decision_model.pkl'}")
    print(f"Saved reason model to {MODEL_DIR / 'reason_model.pkl'}")

    return {
        "training_rows": len(training_df),
        "decision_accuracy": decision_result["accuracy"],
        "reason_accuracy": reason_result["accuracy"],
        "dataset_path": str(resolve_dataset_dir(dataset_dir)),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train the AI Job Application Analyzer models.")
    parser.add_argument("--dataset-dir", type=str, default=None, help="Path to the resume PDF folder.")
    parser.add_argument("--labels-csv", type=str, default=None, help="Optional labels.csv path.")
    parser.add_argument(
        "--job-description",
        type=str,
        default=DEFAULT_JOB_DESCRIPTION,
        help="Job description used to compute match_percentage.",
    )
    parser.add_argument("--test-size", type=float, default=0.2, help="Test split ratio.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    train_model(
        dataset_dir=args.dataset_dir,
        labels_csv=args.labels_csv,
        job_description=args.job_description,
        test_size=args.test_size,
    )


if __name__ == "__main__":
    main()
