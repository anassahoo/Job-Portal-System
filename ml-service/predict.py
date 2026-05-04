from __future__ import annotations

import pickle
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, Optional

from utils.feature_engineering import build_feature_row, features_to_frame
from utils.pdf_parser import extract_text_from_pdf


PROJECT_ROOT = Path(__file__).resolve().parent
MODEL_DIR = PROJECT_ROOT / "model"
DECISION_MODEL_PATH = MODEL_DIR / "decision_model.pkl"
REASON_MODEL_PATH = MODEL_DIR / "reason_model.pkl"


@lru_cache(maxsize=4)
def load_model_bundle(model_path: str) -> Dict[str, Any]:
    """Load a pickled model bundle and cache it for repeated predictions."""

    path = Path(model_path)
    if not path.exists():
        raise FileNotFoundError(f"Model file not found: {path}")

    with path.open("rb") as file_handle:
        bundle = pickle.load(file_handle)

    if "model" not in bundle:
        raise ValueError(f"Invalid model bundle in {path}. Expected a 'model' key.")

    return bundle


def _decode_prediction(bundle: Dict[str, Any], encoded_prediction: Any) -> Any:
    label_encoder = bundle.get("label_encoder")
    if label_encoder is None:
        return encoded_prediction

    return label_encoder.inverse_transform([encoded_prediction])[0]


def _predict_with_features(match_percentage: float, resume_score: float, project_score: float) -> Dict[str, Any]:
    feature_frame = features_to_frame(
        {
            "match_percentage": match_percentage,
            "resume_score": resume_score,
            "project_score": project_score,
        }
    )

    decision_bundle = load_model_bundle(str(DECISION_MODEL_PATH))
    reason_bundle = load_model_bundle(str(REASON_MODEL_PATH))

    decision_encoded = decision_bundle["model"].predict(feature_frame)[0]
    decision = _decode_prediction(decision_bundle, decision_encoded)

    if decision == "Accepted":
        reason = None
    else:
        reason_encoded = reason_bundle["model"].predict(feature_frame)[0]
        reason = _decode_prediction(reason_bundle, reason_encoded)

    return {
        "decision": decision,
        "reason": reason,
        "scores": {
            "match_percentage": round(float(match_percentage), 2),
            "resume_score": round(float(resume_score), 2),
            "project_score": round(float(project_score), 2),
        },
    }


def predict_from_pdf(pdf_path: str | Path, job_description: str) -> Dict[str, Any]:
    """Predict an application outcome directly from a resume PDF and a job description."""

    resume_text = extract_text_from_pdf(pdf_path)
    features = build_feature_row(resume_text, job_description)
    return _predict_with_features(
        features["match_percentage"],
        features["resume_score"],
        features["project_score"],
    )


def predict_from_features(match_percentage: float, resume_score: float, project_score: float) -> Dict[str, Any]:
    """Predict from precomputed feature values."""

    return _predict_with_features(match_percentage, resume_score, project_score)
