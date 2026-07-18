import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Load EXTENDED dataset
data = pd.read_csv("data/cancer_data_extended.csv")

# Drop unnecessary column
data = data.drop("Patient Id", axis=1)

# Encode categorical features
data["Gender"] = data["Gender"].map({"Male": 0, "Female": 1})

data["Stage"] = data["Stage"].map({
    "Early": 1,
    "Middle": 2,
    "Advanced": 3
})

le_treatment = LabelEncoder()
data["Treatment"] = le_treatment.fit_transform(data["Treatment"])

le_grade = LabelEncoder()
data["Grade"] = le_grade.fit_transform(data["Grade"])

# Feature set (11 features)
X = data[
    [
        "Age",
        "Gender",
        "Radius",
        "Area",
        "Concavity",
        "Stage",
        "Treatment",
        "Lymph",
        "Grade",
        "FamilyHistory",
        "Smoking"
    ]
]

y = data["Recurrence"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train XGBoost model
model = XGBClassifier(
    n_estimators=150,
    max_depth=4,
    learning_rate=0.1,
    eval_metric="logloss",
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# Save model
joblib.dump(model, "backend/model.pkl")

print("\nXGBoost model trained and saved successfully")
