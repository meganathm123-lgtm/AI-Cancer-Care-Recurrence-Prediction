import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "./components/AnimatedBackground";
import "./Patient.css";
import Logo from "./components/Logo";
import toast from "react-hot-toast"; // ✅ ADD THIS

function Patient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  toast.dismiss(); // ✅ clear old error toast
}, []);

  // ✅ AUTH + ROLE CHECK
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const user = JSON.parse(localStorage.getItem("user"));

    if (auth !== "true") {
      navigate("/login");
      return;
    }

    if (user?.role === "admin") {
      navigate("/clinical");
      return;
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    cancer_type: "Breast Cancer",
    age: "",
    gender: "Male",
    tumor_size: "Small",
    tumor_area: "Low",
    tumor_shape: "Regular",
    stage: "Early",
    treatment: "Surgery",
    lymph: "No",
    grade: "Low",
    family_history: "No",
    smoking: "No"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const predict = async () => {
  if (!formData.age) {
    toast.dismiss();
    toast.error("Please enter age");
    return;
  }

  setLoading(true);
  toast.dismiss(); // ✅ CLEAR EVERYTHING FIRST

  try {
    const token = localStorage.getItem("token");

const res = await fetch("http://127.0.0.1:5000/predict", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(formData)
});

    // ❗ HANDLE BAD RESPONSE BEFORE JSON
    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    // ❗ EXTRA SAFETY CHECK
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Empty response");
    }

    // ✅ SUCCESS ONLY HERE
    toast.success("Prediction completed");

// ✅ SAVE INPUT DATA
sessionStorage.setItem("patientData", JSON.stringify(formData));

// ✅ SAVE RESULT
sessionStorage.setItem("result", JSON.stringify(data));

navigate("/result");
  } catch (error) {
    console.error("Prediction Error:", error);

    // ❌ ERROR ONLY HERE
    toast.error("Prediction failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <AnimatedBackground />

      {loading && (
        <div id="loading">Analyzing clinical data...</div>
      )}

      <div className="page-content">
        <div className="box">

          <h2><Logo size={40} /> Cancer Recurrence Risk Prediction</h2>

          <p className="tagline">
            AI-Powered Clinical Decision Support System for Cancer Recurrence Prediction
          </p>

          <label>Cancer Type</label>
          <select id="cancer_type" onChange={handleChange}>
            <option>Breast Cancer</option>
            <option>Lung Cancer</option>
            <option>Colon Cancer</option>
            <option>Prostate Cancer</option>
          </select>

          <label>Age</label>
          <input id="age" type="number" onChange={handleChange} />

          <label>Gender</label>
          <select id="gender" onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
          </select>

          <label>Tumor Size</label>
          <select id="tumor_size" onChange={handleChange}>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>

          <label>Tumor Area</label>
          <select id="tumor_area" onChange={handleChange}>
            <option>Low</option>
            <option>Moderate</option>
            <option>High</option>
          </select>

          <label>Tumor Shape</label>
          <select id="tumor_shape" onChange={handleChange}>
            <option>Regular</option>
            <option>Irregular</option>
          </select>

          <label>Cancer Stage</label>
          <select id="stage" onChange={handleChange}>
            <option>Early</option>
            <option>Middle</option>
            <option>Advanced</option>
          </select>

          <label>Treatment Type</label>
          <select id="treatment" onChange={handleChange}>
            <option>Surgery</option>
            <option>Chemotherapy</option>
            <option>Radiotherapy</option>
            <option>Combination</option>
          </select>

          <label>Lymph Node Involvement</label>
          <select id="lymph" onChange={handleChange}>
            <option>No</option>
            <option>Yes</option>
          </select>

          <label>Tumor Grade</label>
          <select id="grade" onChange={handleChange}>
            <option>Low</option>
            <option>Intermediate</option>
            <option>High</option>
          </select>

          <label>Family History of Cancer</label>
          <select id="family_history" onChange={handleChange}>
            <option>No</option>
            <option>Yes</option>
          </select>

          <label>Smoking / Lifestyle Risk</label>
          <select id="smoking" onChange={handleChange}>
            <option>No</option>
            <option>Yes</option>
          </select>

          <button className="gradient-btn" onClick={predict}>
            Predict Risk
          </button>

        </div>
      </div>
    </>
  );
}

export default Patient;