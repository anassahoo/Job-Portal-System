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
    if decision == "Accepted":
        return ["Great job! Your profile matches the requirements well."]

    if reason == "Skill Gap":
        return [
            "Learn the required skills mentioned in the job description",
            "Take focused online courses to close the gap",
            "Add relevant certifications or projects",
        ]
    if reason == "Weak Resume":
        return [
            "Use a clean professional resume format",
            "Highlight measurable achievements and impact",
            "Proofread for clarity and grammar issues",
        ]
    if reason == "Weak Projects":
        return [
            "Add more practical and end-to-end projects",
            "Deploy projects and share live links or GitHub repositories",
            "Show technologies used and the problem solved",
        ]

    return ["Improve the resume match with the target role and add more evidence of impact."]


def format_prediction_response(result: dict) -> dict:
    decision = result["decision"]
    reason = result.get("reason")
    return {
        "match_percentage": result["scores"]["match_percentage"],
        "resume_score": result["scores"]["resume_score"],
        "project_score": result["scores"]["project_score"],
        "decision": decision,
        "prediction": reason if decision != "Accepted" else "None",
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
    return result

