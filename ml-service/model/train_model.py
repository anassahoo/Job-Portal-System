import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
import pickle
import os

def generate_data(n_samples=2000):
    np.random.seed(42)
    match_percentage = np.random.randint(30, 100, n_samples)
    resume_score = np.random.randint(30, 100, n_samples)
    project_score = np.random.randint(30, 100, n_samples)

    data = pd.DataFrame({
        'match_percentage': match_percentage,
        'resume_score': resume_score,
        'project_score': project_score
    })

    decisions = []
    reasons = []

    for _, row in data.iterrows():
        mp = row['match_percentage']
        rs = row['resume_score']
        ps = row['project_score']
        
        # Determine Decision based on rules
        # If both match_percentage and resume_score are >= 85: Accepted
        # If match_percentage < 60 or resume_score < 60: Rejected
        # Otherwise: Interview
        if mp >= 85 and rs >= 85:
            decisions.append('Accepted')
        elif mp < 60 or rs < 60:
            decisions.append('Rejected')
        else:
            decisions.append('Interview')
            
        # Determine Reason based on the lowest score among the features
        if mp >= 85 and rs >= 85:
            reasons.append('None')
        else:
            scores = {'Skill Gap': mp, 'Weak Resume': rs, 'Weak Projects': ps}
            reason = min(scores, key=scores.get)
            reasons.append(reason)
            
    data['decision'] = decisions
    data['reason'] = reasons
    return data

def train():
    data = generate_data(2000)
    
    X = data[['match_percentage', 'resume_score', 'project_score']]
    y_decision = data['decision']
    y_reason = data['reason']
    
    # Train Decision Tree for Decision
    clf_decision = DecisionTreeClassifier(random_state=42, max_depth=5)
    clf_decision.fit(X, y_decision)
    
    # Train Decision Tree for Reason
    clf_reason = DecisionTreeClassifier(random_state=42, max_depth=5)
    clf_reason.fit(X, y_reason)
    
    model_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(model_dir, 'model.pkl')
    
    with open(model_path, 'wb') as f:
        pickle.dump({'decision_model': clf_decision, 'reason_model': clf_reason}, f)

    print(f"Models trained and saved successfully at {model_path}")

if __name__ == '__main__':
    train()
