from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import os
import warnings

warnings.filterwarnings('ignore')

app = FastAPI(title="AI Job Rejection Analyzer API")

class ApplicationData(BaseModel):
    match_percentage: float
    resume_score: float
    project_score: float

# Load the models
model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'model', 'model.pkl')
try:
    with open(model_path, 'rb') as f:
        models = pickle.load(f)
    clf_decision = models['decision_model']
    clf_reason = models['reason_model']
    models_loaded = True
except Exception as e:
    models_loaded = False
    print(f"Error loading model: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Job Rejection Analyzer System"}

@app.post("/predict")
def predict(data: ApplicationData):
    if not models_loaded:
        return {"error": "Models not loaded. Please train the model first."}
        
    features = [[data.match_percentage, data.resume_score, data.project_score]]
    
    decision = clf_decision.predict(features)[0]
    reason = clf_reason.predict(features)[0]
    
    suggestions = []
    if decision != "Accepted":
        if reason == "Skill Gap":
            suggestions = ["Learn required skills mentioned in the job description", "Take online courses to fill knowledge gaps"]
        elif reason == "Weak Resume":
            suggestions = ["Use professional resume templates", "Highlight achievements with quantifiable metrics", "Check for grammatical errors"]
        elif reason == "Weak Projects":
            suggestions = ["Build more advanced projects", "Deploy your projects and share links", "Contribute to open source"]
            
    return {
        "match_percentage": data.match_percentage,
        "resume_score": data.resume_score,
        "project_score": data.project_score,
        "decision": decision,
        "prediction": reason if decision != "Accepted" else "None",
        "suggestions": suggestions if decision != "Accepted" else ["Great job! Your profile matches the requirements perfectly."]
    }
