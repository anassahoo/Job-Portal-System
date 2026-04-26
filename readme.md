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
React (Frontend)
       ↓
Node.js (Backend API)
       ↓
MySQL (Database)
       ↓
FastAPI (ML Service)
       ↓
Node.js → React
```

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
* System calculates:

  * Skill match %
  * Resume score
  * Project score

---

## 5. ML Prediction

* Data sent to FastAPI
* ML model predicts rejection reason

---

## 6. Result Display

* Dashboard shows:

  * Prediction
  * Issues
  * Suggestions

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
