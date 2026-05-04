# 🧠 AI Job Rejection Analyzer System (Full Stack + ML)

## 📌 Project Overview

This project is a **full-stack job portal system enhanced with Machine Learning** that helps students understand:

> ❓ *Why they are getting rejected from jobs*

Unlike traditional platforms like LinkedIn or Indeed, this system focuses on:

✅ Analyzing job applications
✅ Predicting rejection reasons
✅ Providing actionable suggestions

---

# 🎯 Key Features

## 🔐 Authentication System

* Sign Up / Sign In
* Role-Based Access:

  * 👤 Student
  * 🧑‍💼 Recruiter

---

## 🧑‍🎓 Student Features

* Upload Resume (PDF/DOC)
* Add Skills & Projects
* Apply for Jobs
* View AI Analysis Report
* Track Application History

---

## 🧑‍💼 Recruiter Features

* Create Company Profile
* Post Jobs
* Add Required Skills
* View Applicants

---

## 🧠 ML-Based Rejection Analyzer

* Predicts:

  * Skill Gap
  * Weak Resume
  * Weak Projects
* Based on:

  * Skill Match %
  * Resume Score
  * Project Score

---

## 📊 Smart Analysis Report

Example:

```id="rep01"
🧠 Rejection Analysis

📊 Prediction: Skill Gap

📉 Match: 55%

⚠️ Issues:
- Missing React, SQL
- Low project complexity

✅ Suggestions:
- Learn React + APIs
- Build advanced project
```

---

# 🏗️ Tech Stack

## 🟦 Frontend

* React.js
* Tailwind CSS

---

## 🟩 Backend

* Node.js
* Express.js

---

## 🧠 AI / ML Service

* Python (FastAPI)
* scikit-learn

---

## 🗄️ Database

* MySQL

---

## 🖼️ File Storage

* Local storage / cloud (store file paths in DB)

---

# 🔗 System Architecture

```id="arch01"
React Frontend
  ↓
Node.js Backend API
  ↓
FastAPI ML Service
  ↓
Node.js Backend API
  ↓
React Frontend
```

---

# 🔁 Frontend to Model Flow

```id="flow01"
1. User uploads a resume or opens an application screen in the React frontend.
2. The frontend sends the resume/job data to the Node.js backend.
3. The backend stores application data in MySQL and prepares the feature payload.
4. The backend forwards the request to the FastAPI ML service.
5. The ML service extracts PDF text, builds scores, and predicts decision + reason.
6. The backend receives the ML response and saves the result.
7. The backend sends the final prediction back to the frontend.
8. The frontend displays the decision, reason, scores, and suggestions to the user.
```

---

# 🧭 End-to-End Request Path

## Frontend → Backend → ML Service

* React collects the resume/application input.
* Node.js validates the request and manages database records.
* FastAPI handles PDF parsing, feature extraction, and model inference.

## ML Service → Backend → Frontend

* FastAPI returns the predicted decision, reason, and feature scores.
* Node.js stores the result and formats the response.
* React renders the outcome in the dashboard or analysis report.

---

# ⚙️ How the System Works

## 1. User Authentication

* User signs up/login
* Role assigned (student/recruiter)

---

## 2. Resume Upload

* Resume stored (file path)
* Resume score calculated

---

## 3. Job Posting (Recruiter)

* Recruiter creates company
* Posts job
* Adds required skills

---

## 4. Job Application (Student)

* Student applies to job
* Backend checks whether the student already applied
* Backend compares student skills with job-required skills and calculates:

  * Skill match %
  * Resume score
  * Project score

---

## 5. ML Prediction

* Backend sends `match_percentage`, `resume_score`, and `project_score` to FastAPI
* FastAPI loads the trained model and predicts the final decision and reason
* If the PDF-based path is used, FastAPI first extracts resume text, builds the scores, then predicts the result

### How the model decides

* `match_percentage` shows how close the resume is to the job description
* `resume_score` checks skills, education keywords, and experience signals
* `project_score` checks project keywords and technology mentions
* The ML model uses these values to predict:

  * `Accepted`
  * `Interview`
  * `Rejected`

* If the decision is not `Accepted`, it also predicts the main reason:

  * `Skill Gap`
  * `Weak Resume`
  * `Weak Projects`

---

## 6. Result Display

* Dashboard shows:

  * Prediction
  * Issues
  * Suggestions

* Frontend receives the response from the backend and updates the UI immediately
* The response usually contains:

  * `decision`
  * `prediction`
  * `match_percentage`
  * `resume_score`
  * `project_score`
  * `suggestions`

* Example:

```json
{
  "message": "Application submitted",
  "match_percentage": 74,
  "prediction": "Weak Resume",
  "status": "Rejected"
}
```

---

# 🧠 Machine Learning Model

## Model Used:

* Decision Tree Classifier

## Library:

* scikit-learn

---

## Input Features:

* match_percentage
* resume_score
* project_score

---

## 7. Real Meaning of Each Feature

### 📊 `match_percentage`

* Shows how closely the resume text matches the job description
* Calculated from resume and job description text using TF-IDF + cosine similarity
* Higher value means the resume language is more aligned with the role requirements

### 📄 `resume_score`

* Measures how strong the resume content is overall
* Built from:

  * detected skills from the predefined skills list
  * education keywords like BS, MS, and PhD
  * years of experience found through regex patterns

* Higher value means the resume shows better skill coverage, education, and experience

### 🧪 `project_score`

* Measures how strong the candidate’s project section is
* Calculated from:

  * project-related words such as project, built, developed, deployed, portfolio, and GitHub
  * technology keywords such as AI, ML, Web, React, Node.js, FastAPI, Docker, AWS, and similar terms

* Higher value means the resume shows more evidence of practical work, tooling, and project impact

### How the model uses these scores

* The backend sends these three scores to the ML service
* The ML model uses them as input features to predict:

  * `Accepted`
  * `Interview`
  * `Rejected`

* If the result is not `Accepted`, the model also predicts the likely reason:

  * `Skill Gap`
  * `Weak Resume`
  * `Weak Projects`

---

## Output:

* Skill Gap
* Weak Resume
* Weak Projects

---

# 🗄️ Database Schema (Normalized)

## 1. users

* id (PK)
* name
* email
* password
* role
* profile_image

---

## 2. companies

* id (PK)
* name
* description
* logo

---

## 3. recruiters

* id (PK)
* user_id (FK)
* company_id (FK)

---

## 4. jobs

* id (PK)
* title
* description
* company_id (FK)
* created_by (FK)

---

## 5. skills

* id (PK)
* skill_name

---

## 6. user_skills

* id (PK)
* user_id (FK)
* skill_id (FK)

---

## 7. job_skills

* id (PK)
* job_id (FK)
* skill_id (FK)

---

## 8. applications

* id (PK)
* user_id (FK)
* job_id (FK)
* match_percentage
* resume_score
* project_score
* prediction
* status

---

## 9. resumes (optional)

* id (PK)
* user_id (FK)
* file_path
* resume_score

---

# 🔐 Role-Based Flow

## 👤 Student

* Manage profile
* Apply jobs
* View analysis

## 🧑‍💼 Recruiter

* Manage company
* Post jobs
* Review candidates

---

# 🚀 Installation Guide

## 1. Clone Repository

```bash id="cmd1"
git clone <repo_url>
```

---

## 2. Frontend Setup

```bash id="cmd2"
cd frontend
npm install
npm start
```

---

## 3. Backend Setup (Node.js)

```bash id="cmd3"
cd backend
npm install
node server.js
```

---

## 4. FastAPI Setup

```bash id="cmd4"
cd ml_service
pip install fastapi uvicorn scikit-learn
uvicorn main:app --reload
```

---

## 5. Database Setup

* Create MySQL database
* Import tables
* Configure DB connection

---

# 🔥 Future Enhancements

* NLP Resume Parsing using spaCy
* Recommendation system
* Real-time job scraping
* Advanced ML models

---

# 💡 Key Highlights

* Fully normalized database
* ML-powered predictions
* Role-based system
* Microservice architecture
* Real-world problem solving

---

# 🎯 Project Vision

> Build an intelligent system that not only shows jobs but helps users **become job-ready**

---

# 👨‍💻 Author

Hafiz Muhammad Anas
BS Software Engineering – FAST-NUCES

---

# ⭐ Final Note

This is not just a job portal.
It is an:

> 🚀 **AI Career Intelligence Platform**
