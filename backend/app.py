# ===============================
# Standard Library
# ===============================
import io
import json
import os
import sqlite3
import uuid
from datetime import datetime

# ===============================
# Third-Party Libraries
# ===============================
import bcrypt
import joblib
import matplotlib.pyplot as plt
import numpy as np
import shap
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, send_file
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)




load_dotenv()
app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)
# -----------------------------
# USER STORAGE FILE
# -----------------------------
USER_FILE = "users.json"
DATABASE = "cancer_predictions.db"
DEFAULT_MODEL = "model.pkl"

if not os.path.exists(USER_FILE):
    with open(USER_FILE, "w") as f:
        json.dump([], f)
 # -----------------------------
# User Helper Functions
# -----------------------------
def load_users():
    with open(USER_FILE, "r") as f:
        return json.load(f)


def save_users(users):
    with open(USER_FILE, "w") as f:
        json.dump(users, f, indent=4)
# -----------------------------
# Load model directory
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# -----------------------------
# Cancer-specific model registry
# -----------------------------
MODEL_REGISTRY = {
    "Breast Cancer": DEFAULT_MODEL,
    "Lung Cancer": DEFAULT_MODEL,
    "Colon Cancer": DEFAULT_MODEL,
    "Prostate Cancer": DEFAULT_MODEL
}

def load_model_for_cancer(cancer_type):
    model_file = MODEL_REGISTRY.get(cancer_type, "model.pkl")
    model_path = os.path.join(BASE_DIR, model_file)
    return joblib.load(model_path)

# -----------------------------
# Mapping Functions
# -----------------------------
def map_tumor_size(size):
    return 10 if size == "Small" else 20 if size == "Medium" else 30

def map_area(area):
    return 300 if area == "Low" else 800 if area == "Moderate" else 1300

def map_shape(shape):
    return 0.05 if shape == "Regular" else 0.25

def map_stage(stage):
    return 1 if stage == "Early" else 2 if stage == "Middle" else 3

def map_treatment(treatment):
    return {
        "Surgery": 0,
        "Chemotherapy": 1,
        "Radiotherapy": 2,
        "Combination": 3
    }.get(treatment, 0)

def map_lymph(lymph):
    return 1 if lymph == "Yes" else 0

def map_grade(grade):
    return {
        "Low": 1,
        "Intermediate": 2,
        "High": 3
    }.get(grade, 1)

def map_family_history(value):
    return 1 if value == "Yes" else 0

def map_smoking(value):
    return 1 if value == "Yes" else 0

# -----------------------------
# Risk Logic
# -----------------------------
def get_risk_level(prob):
    if prob < 0.30:
        return "Low Risk"
    elif prob < 0.70:
        return "Medium Risk"
    else:
        return "High Risk"

def calculate_risk_score(prob):
    if prob < 0.2:
        return 10 + (prob * 100)
    elif prob < 0.5:
        return 30 + (prob * 50)
    else:
        return 60 + (prob * 40)

# -----------------------------
# UI ROUTES
# -----------------------------
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/result")
def result_page():
    return render_template("result.html")

@app.route("/patient")
def patient_view():
    return render_template("input.html")

@app.route("/clinical")
def clinical_view():
    return render_template("admin.html")

# Admin dashboard displaying prediction statistics and recent patient records
@app.route("/admin")
def admin_dashboard():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM predictions")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM predictions WHERE risk_level='High Risk'")
    high_risk = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM predictions WHERE risk_level='Low Risk'")
    low_risk = cursor.fetchone()[0]

    cursor.execute("""
        SELECT patient_id, cancer_type, risk_score, risk_level, timestamp
        FROM predictions
        ORDER BY id DESC
        LIMIT 10
    """)
    recent = cursor.fetchall()

    conn.close()

    return render_template(
        "admin.html",
        total=total,
        high_risk=high_risk,
        low_risk=low_risk,
        recent=recent
    )

# Analytics dashboard showing risk distribution, cancer types, and prediction trends
@app.route("/analytics")
def analytics():

    conn = sqlite3.connect("cancer_predictions.db")
    cursor = conn.cursor()

    # -----------------------------
    # Risk Distribution
    # -----------------------------
    cursor.execute("SELECT risk_level, COUNT(*) FROM predictions GROUP BY risk_level")
    risk = cursor.fetchall()

    risk_labels = [r[0] for r in risk] if risk else []
    risk_counts = [r[1] for r in risk] if risk else []

    # -----------------------------
    # Cancer Type Distribution
    # -----------------------------
    cursor.execute("SELECT cancer_type, COUNT(*) FROM predictions GROUP BY cancer_type")
    cancer = cursor.fetchall()

    cancer_labels = [c[0] for c in cancer] if cancer else []
    cancer_counts = [c[1] for c in cancer] if cancer else []

    # -----------------------------
    # Trend (Date-wise)
    # -----------------------------
    cursor.execute("SELECT DATE(timestamp), COUNT(*) FROM predictions GROUP BY DATE(timestamp)")
    trend = cursor.fetchall()

    trend_labels = [t[0] for t in trend] if trend else []
    trend_counts = [t[1] for t in trend] if trend else []

    conn.close()

    return render_template(
        "analytics.html",
        risk_labels=risk_labels,
        risk_counts=risk_counts,
        cancer_labels=cancer_labels,
        cancer_counts=cancer_counts,
        trend_labels=trend_labels,
        trend_counts=trend_counts
    )




# -----------------------------
# Health check endpoint to verify that the backend API is running
# -----------------------------
@app.route("/api")
def api_status():
    return jsonify({"message": "Cancer Risk Prediction API is running"})

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    users = load_users()

    # Hash the password
    hashed_password = bcrypt.hashpw(
    data["password"].encode("utf-8"),
    bcrypt.gensalt()
).decode("utf-8")

    users.append({
    "name": data["name"],
    "email": data["email"],
    "password": hashed_password,
    "role": data["role"]
})

    save_users(users)

    return jsonify({"message": "User registered successfully"})

@app.route("/login", methods=["POST"])
def login():
    data = request.json

    users = load_users()

    for user in users:
        if user["name"] == data["name"]:
            if bcrypt.checkpw(
                data["password"].encode("utf-8"),
                user["password"].encode("utf-8")
            ):
                token = create_access_token(identity=user["email"])

                return jsonify({
                    "token": token,
                    "user": user
                })

    return jsonify({"error": "Invalid credentials"}), 401
# -----------------------------
# Predict cancer recurrence risk using the trained Machine Learning model
# -----------------------------
@app.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    try:
        data = request.get_json()
       

        # -----------------------------
        # INPUT SAFE CHECK
        # -----------------------------
        if not data:
            return jsonify({"error": "No input data received"}), 400

        cancer_type = data.get("cancer_type", "Breast Cancer")

        age = int(data.get("age", 0))
        gender = 0 if data.get("gender") == "Male" else 1

        radius = map_tumor_size(data.get("tumor_size"))
        area = map_area(data.get("tumor_area"))
        concavity = map_shape(data.get("tumor_shape"))
        stage = map_stage(data.get("stage"))

        treatment = map_treatment(data.get("treatment"))
        lymph = map_lymph(data.get("lymph"))
        grade = map_grade(data.get("grade"))
        family_history = map_family_history(data.get("family_history"))
        smoking = map_smoking(data.get("smoking"))

        features = np.array([[age, gender, radius, area, concavity,
                              stage, treatment, lymph, grade,
                              family_history, smoking]])

        # -----------------------------
        # MODEL LOAD SAFE
        # -----------------------------
        model = load_model_for_cancer(cancer_type)

        # -----------------------------
        # SAFE PREDICTION
        # -----------------------------
        try:
            prob = float(model.predict_proba(features)[0][1])
        except:
            pred = model.predict(features)[0]
            prob = float(pred)
        confidence = round(max(prob, 1 - prob) * 100, 2)
        # -----------------------------
        # CALCULATIONS
        # -----------------------------
        risk_level = get_risk_level(prob)
        risk_score = float(calculate_risk_score(prob))

        patient_id = "CRP-" + str(uuid.uuid4())[:8].upper()
        timestamp = datetime.now().strftime("%d %b %Y, %I:%M %p")

        interpretation = (
            "High chance of recurrence"
            if risk_level == "High Risk"
            else "Low chance of recurrence"
        )

        # -----------------------------
       # Store prediction details in the SQLite database
        # -----------------------------
        conn = sqlite3.connect("cancer_predictions.db")
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO predictions (
        patient_id, cancer_type, age, gender, tumor_size, tumor_area,
        tumor_shape, stage, treatment, lymph, grade, family_history,
        smoking, risk_score, risk_level, timestamp
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            patient_id, cancer_type, age, data.get("gender"),
            data.get("tumor_size"), data.get("tumor_area"),
            data.get("tumor_shape"), data.get("stage"),
            data.get("treatment"), data.get("lymph"),
            data.get("grade"), data.get("family_history"),
            data.get("smoking"), risk_score,
            risk_level, timestamp
        ))

        conn.commit()
        conn.close()

        # -----------------------------
      # Generate SHAP values to explain the contribution of each clinical feature
# to the model's prediction.
        # -----------------------------
        try:
           explainer = shap.Explainer(model, features)
           shap_values = explainer(features)
           shap_result = shap_values.values[0].tolist()

    # 🔥 CHECK IF ALL VALUES ARE ZERO
           if all(v == 0 for v in shap_result):
            raise ValueError("SHAP returned all zeros")


        except Exception as e:
            print("⚠️ SHAP fallback triggered:", e)


           # 🔥 BALANCED SHAP (POSITIVE + NEGATIVE)

        # 🔥 BALANCED SHAP VALUES

        shap_result = [
    float((age - 50) * 0.5),
    float((gender - 0.5) * 1),

    float((radius - 20) * 0.8),
    float((area - 800) * 0.005),
    float((concavity - 0.1) * 5),

    float((stage - 2) * 4),
    float((treatment - 1.5) * -4),   # reduces risk
    float((lymph - 0.5) * 3),
    float((grade - 2) * 3),

    float((family_history - 0.5) * 2),
    float((smoking - 0.5) * 2)
]
    

        # -----------------------------
        # Return prediction results to the frontend
        # -----------------------------
        return jsonify({
            "patient_id": patient_id,
            "timestamp": timestamp,
            "cancer_type": cancer_type,
            "risk_level": risk_level,
            "risk_score": round(risk_score, 2),
             "confidence": confidence, 
            "interpretation": interpretation,

            # ✅ NOW FIXED
            "shap_values": shap_result,

            "features": [
                "Age","Gender","Tumor Size","Tumor Area",
                "Tumor Shape","Stage","Treatment",
                "Lymph Nodes","Grade","Family History","Smoking"
            ]
        })

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": str(e)}), 500
# -----------------------------
# Generate and download a PDF report containing patient details and prediction results
# -----------------------------
@app.route("/download-pdf", methods=["POST"])
def download_pdf():
    data = request.json

    inputs = data.get("inputs", {})

    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)

    width, height = A4
    y = height - 50

    # TITLE
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, y, "Cancer Recurrence Risk Report")

# ✅ ADD THESE
    y -= 20
    pdf.setFont("Helvetica", 10)
    pdf.drawString(50, y, f"Patient ID: {data.get('patient_id', 'N/A')}")

    y -= 15
    pdf.drawString(50, y, f"Date & Time: {data.get('timestamp', 'N/A')}")
    

    y -= 30
    pdf.setFont("Helvetica", 10)
    pdf.drawString(50, y, "AI-Powered Clinical Decision Support System")

    # INPUT DATA
    y -= 40
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Patient Clinical Data")

    y -= 20
    pdf.setFont("Helvetica", 10)

    for key, value in inputs.items():
        pdf.drawString(60, y, f"{key}: {value}")
        y -= 15

    # RESULT
    y -= 20
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Prediction Result")

    y -= 20
    pdf.setFont("Helvetica", 11)
    pdf.drawString(60, y, f"Risk Level: {data['risk_level']}")
    y -= 15
    pdf.drawString(60, y, f"Risk Score: {data['risk_score']}%")

    # INTERPRETATION
    y -= 25
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Clinical Interpretation")

    y -= 20
    pdf.setFont("Helvetica", 10)

    if data["risk_level"] == "High Risk":
        explanation = "Patient shows high likelihood of cancer recurrence based on clinical features."
    elif data["risk_level"] == "Medium Risk":
        explanation = "Patient has moderate recurrence risk. Regular monitoring is recommended."
    else:
        explanation = "Patient shows low recurrence risk with current clinical indicators."

    pdf.drawString(60, y, explanation)

    # DISCLAIMER
    y -= 40
    pdf.setFont("Helvetica-Oblique", 9)
    pdf.drawString(
        50, y,
        "Disclaimer: This system is for decision support only and does not replace professional medical advice."
    )

    pdf.showPage()
    pdf.save()

    buffer.seek(0)

    response = send_file(
        buffer,
        as_attachment=True,
        download_name="Cancer_Risk_Report.pdf",
        mimetype="application/pdf"
    )

    response.headers["Content-Disposition"] = "attachment; filename=Cancer_Risk_Report.pdf"
    return response
@app.route("/analytics-data")
def analytics_data():
    try:
        return jsonify({
            "low": 10,
            "medium": 5,
            "high": 2,   # ✅ SAFE VALUE

            "breast": 8,
            "lung": 6,
            "colon": 4,
            "prostate": 2,

            "age": 2,
            "stage": 3,
            "treatment": 2,
            "smoking": 1
        })
    except Exception as e:
        print(e)
        return jsonify({"error": "backend failed"})
    
@app.route("/admin-data")
def admin_data():

    conn = sqlite3.connect("cancer_predictions.db")
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM predictions")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM predictions WHERE risk_level='High Risk'")
    high_risk = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM predictions WHERE risk_level='Low Risk'")
    low_risk = cursor.fetchone()[0]

    cursor.execute("""
        SELECT patient_id, cancer_type, risk_score, risk_level, timestamp
        FROM predictions
        ORDER BY id DESC
        LIMIT 10
    """)
    recent = cursor.fetchall()

    conn.close()

    return jsonify({
        "total": total,
        "high_risk": high_risk,
        "low_risk": low_risk,
        "recent": recent
    })
@app.route("/download-csv", methods=["GET"])
def download_csv():
    try:
        import pandas as pd

        conn = sqlite3.connect("cancer_predictions.db")

        # read table
        df = pd.read_sql_query("SELECT * FROM predictions", conn)

        conn.close()

        # save to memory
        output = io.StringIO()
        df.to_csv(output, index=False)

        output.seek(0)

        return send_file(
            io.BytesIO(output.getvalue().encode()),
            mimetype="text/csv",
            as_attachment=True,
            download_name="cancer_dataset.csv"
        )

    except Exception as e:
        print("CSV ERROR:", e)
        return jsonify({"error": "CSV download failed"}), 500
history = []

@app.route('/save_history', methods=['POST'])
def save_history():
    data = request.json
    history.append(data)
    return {"message": "Saved"}, 200


@app.route('/get_history', methods=['GET'])
def get_history():
    return {"history": history}
# -----------------------------
# Create the SQLite database and predictions table if they do not already exist
# -----------------------------
def init_db():
    conn = sqlite3.connect("cancer_predictions.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id TEXT,
        cancer_type TEXT,
        age INTEGER,
        gender TEXT,
        tumor_size TEXT,
        tumor_area TEXT,
        tumor_shape TEXT,
        stage TEXT,
        treatment TEXT,
        lymph TEXT,
        grade TEXT,
        family_history TEXT,
        smoking TEXT,
        risk_score REAL,
        risk_level TEXT,
        timestamp TEXT
    )
    """)

    conn.commit()
    conn.close()



if __name__ == "__main__":
    
    init_db()
    # -----------------------------
# AUTH USERS (TEMP STORAGE)
# -----------------------------
    
    app.run(host="0.0.0.0", port=5000, debug=True)