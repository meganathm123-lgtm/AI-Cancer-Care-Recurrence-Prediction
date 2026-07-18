# 🩺 AI Cancer Care – Risk & Recurrence Prediction System

An AI-powered web application that predicts cancer risk and recurrence using Machine Learning. The system combines secure patient management, explainable AI, analytics, and automated report generation to assist healthcare professionals in making informed clinical decisions.

---

## 📖 Project Overview

Cancer recurrence is one of the major challenges in healthcare. Early prediction of recurrence risk enables timely diagnosis, personalized treatment planning, and improved patient outcomes.

This project uses an **XGBoost Machine Learning model** to analyze clinical data and predict cancer risk and recurrence. During model development, multiple algorithms including **Random Forest** and **XGBoost** were evaluated. Based on comparative performance, **XGBoost** was selected as the final deployed model.

The application also provides secure authentication, patient record management, explainable AI using SHAP, analytics dashboards, and downloadable PDF reports.

---

# 🎯 Objectives

- Predict cancer risk and recurrence using Machine Learning.
- Support doctors with data-driven clinical decisions.
- Securely manage patient information.
- Explain predictions using Explainable AI (SHAP).
- Visualize prediction statistics through dashboards.
- Generate downloadable medical reports.

---

# ✨ Features

### 🔐 Authentication
- User Registration
- Secure Login
- JWT Authentication
- Bcrypt Password Encryption

### 🤖 Machine Learning
- Cancer Risk Prediction
- Cancer Recurrence Prediction
- XGBoost Prediction Model
- Probability Score
- Risk Classification

### 📊 Analytics Dashboard
- Total Predictions
- Risk Distribution
- Prediction Statistics
- Cancer Type Analysis

### 🧠 Explainable AI
- SHAP Feature Importance
- Model Interpretation
- Clinical Feature Contribution

### 📄 Report Generation
- Download Prediction Report as PDF
- Patient Summary
- Prediction Summary

### 💾 Data Management
- SQLite Database
- Patient Records
- Prediction History

---

# 🛠️ Technology Stack

## Frontend
- React.js
- HTML5
- CSS3
- JavaScript

## Backend
- Python
- Flask
- Flask-CORS
- Flask-JWT-Extended

## Machine Learning
- XGBoost Classifier
- Scikit-learn
- SHAP (Explainable AI)
- Joblib
- NumPy

## Database
- SQLite

## Authentication
- JWT (JSON Web Token)
- Bcrypt Password Hashing

---

# 📂 Project Structure

```
Cancer_Risk_Prediction/
│
├── backend/
│   ├── app.py
│   ├── model.pkl
│   ├── train_model.py
│   ├── templates/
│   ├── static/
│   └── users.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── data/
│   └── cancer_data_extended.csv
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

# ⚙️ Installation Guide

## Clone the Repository

```bash
git clone https://github.com/meganathm123-lgtm/AI-Cancer-Care-Recurrence-Prediction.git
```

```bash
cd AI-Cancer-Care-Recurrence-Prediction
```

---

## Backend Setup

Create Virtual Environment

```bash
python -m venv venv
```

Activate Environment (Windows)

```bash
venv\Scripts\activate
```

Install Required Packages

```bash
pip install -r requirements.txt
```

Run Flask Server

```bash
python backend/app.py
```

---

## Frontend Setup

```bash
cd frontend
```

Install Dependencies

```bash
npm install
```

Start React Application

```bash
npm start
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing using Bcrypt
- Protected Prediction APIs
- Environment Variable Support
- Secure User Management

---

# 🤖 Machine Learning Workflow

1. Clinical Data Collection
2. Data Preprocessing
3. Feature Engineering
4. Model Training
5. Performance Evaluation
6. Cancer Risk Prediction
7. SHAP Explainability
8. Store Prediction in Database
9. Display Results
10. Generate PDF Report

---

# 📈 Model Information

### Algorithms Evaluated
- Random Forest Classifier
- XGBoost Classifier

### Final Deployed Model
- XGBoost Classifier (XGBClassifier)

### Evaluation Metrics
- Accuracy
- Precision
- Recall
- F1-Score

### Explainability
- SHAP (SHapley Additive exPlanations)

---

# 📷 Application Modules

- Home Page
- User Registration
- Login
- Patient Dashboard
- Cancer Risk Prediction
- Prediction Results
- Explainability Dashboard
- Analytics Dashboard
- Admin Dashboard
- PDF Report Generation

---

# 🚀 Future Enhancements

- Deep Learning-based Prediction Models
- Multi-Cancer Prediction
- Cloud Deployment
- Doctor Dashboard
- Mobile Application
- PostgreSQL Database Integration
- AI Chatbot for Patient Assistance
- Email & SMS Notification System

---

# 👨‍💻 Developer

**Meganath M**

Bachelor of Engineering

Computer Science and Engineering (Artificial Intelligence & Machine Learning)

---

# 📄 License

This project is developed for academic learning, research, and educational purposes.

---

# 🙏 Acknowledgement

This project was developed as part of an academic major project to demonstrate the application of Artificial Intelligence, Machine Learning, Explainable AI, and Secure Web Technologies in healthcare for cancer risk and recurrence prediction.
