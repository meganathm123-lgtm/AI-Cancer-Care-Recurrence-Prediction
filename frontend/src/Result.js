import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import AnimatedBackground from "./components/AnimatedBackground";
import "./styles/glass.css";
import Logo from "./components/Logo";
import toast from "react-hot-toast";
import "./Result.css";

function Result() {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const handleDownloadPDF = async () => {
  try {
    const patientInputs = JSON.parse(sessionStorage.getItem("patientData")) || {};

    const response = await fetch("http://127.0.0.1:5000/download-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        patient_id: result.patient_id,
        timestamp: result.timestamp,
        risk_level: result.risk_level,
        risk_score: result.risk_score,
        inputs: {
          "Cancer Type": patientInputs.cancer_type,
          "Age": patientInputs.age,
          "Gender": patientInputs.gender,
          "Tumor Size": patientInputs.tumor_size,
          "Tumor Area": patientInputs.tumor_area,
          "Tumor Shape": patientInputs.tumor_shape,
          "Cancer Stage": patientInputs.stage,
          "Treatment Type": patientInputs.treatment,
          "Lymph Node Involvement": patientInputs.lymph,
          "Tumor Grade": patientInputs.grade,
          "Family History": patientInputs.family_history,
          "Smoking / Lifestyle Risk": patientInputs.smoking
        }
      })
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Cancer_Risk_Report.pdf";
    a.click();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(error);
    alert("PDF failed");
  }
};

  const riskChartInstance = useRef(null);
  const featureChartInstance = useRef(null);

  // Clear toast
  useEffect(() => {
    toast.dismiss();
  }, []);

  // Load result
  useEffect(() => {
    const r = JSON.parse(sessionStorage.getItem("result"));
    if (!r) return;

    setResult(r);
    setConfidence(r?.confidence);
  }, []);

  // Chart rendering (FIXED)
  useEffect(() => {
    if (!result) return;

    setTimeout(() => {
      // Destroy old charts
      if (riskChartInstance.current) {
        riskChartInstance.current.destroy();
      }
      if (featureChartInstance.current) {
        featureChartInstance.current.destroy();
      }

      const riskCanvas = document.getElementById("riskChart");
      const featureCanvas = document.getElementById("featureChart");

      if (!riskCanvas || !featureCanvas) return;

      // 🔵 Risk Chart
      riskChartInstance.current = new Chart(riskCanvas, {
        type: "bar",
        data: {
          labels: ["Tumor Size", "Stage", "Treatment", "Lymph", "Smoking"],
          datasets: [{
            label: "Risk Contribution (%)",
            data: [35, 45, 15, 20, 10],
            backgroundColor: "#3b82f6"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y"
        }
      });

      // 🟢 Feature Contribution Chart
      featureChartInstance.current = new Chart(featureCanvas, {
        type: "bar",
        data: {
          labels: ["Age", "Gender", "Tumor Size", "Tumor Area", "Tumor Shape"],
          datasets: [{
            label: "Feature Impact",
            data: [35, 100, 8, 1, 1],
            backgroundColor: "#22c55e"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });

    }, 100); // important delay

  }, [result]);

  // Static risk factors
 const getTopFeatures = (features, shapValues) => {
  if (!features || !shapValues) return [];

  return features
    .map((feature, index) => ({
      name: feature,
      value: shapValues[index]
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 5);
};

const topFeatures = getTopFeatures(result?.features, result?.shap_values);

// ✅ Safe check + dynamic explanation
let explanationLine = "";

if (topFeatures && topFeatures.length > 0) {
  const names = topFeatures.slice(0, 3).map(f => f.name.toLowerCase());

  let explanationLine = "";

if (topFeatures && topFeatures.length > 0) {
  const names = topFeatures.slice(0, 3).map(f => f.name);

  explanationLine = `Risk is mainly influenced by ${names.join(", ")}.`;
  if (!explanationLine) {
  explanationLine = "Risk is influenced by key clinical factors like age, tumor size and stage.";
}
}
}
  if (!result) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }
  const visibleFactors = [
  "Age",
  "Tumor Size",
  "Treatment"
];

const explanationText = `Risk is mainly influenced by ${visibleFactors.join(", ")}.`;

  const cls =
    result.risk_level.includes("High") ? "high" :
    result.risk_level.includes("Medium") ? "medium" : "low";

  return (
    <div className="result-container">
      <AnimatedBackground />

      <div className="box">
        <h2><Logo size={40} /> Cancer Recurrence Risk Result</h2>

        <p><b>Patient ID:</b> {result.patient_id}</p>
        <p><b>Date & Time:</b> {result.timestamp}</p>
        <p><b>Cancer Type:</b> {result.cancer_type}</p>

        <div className={`badge ${cls}`}>
          {cls === "high" ? "🚨" : cls === "medium" ? "⚠️" : "✅"}
          {" "}{result.risk_level}
        </div>

        <p><b>Risk Score:</b> {result.risk_score}%</p>

        <p><b>Interpretation:</b> {result.interpretation}</p>

<p style={{ marginTop: "10px", fontWeight: "500", color: "#444" }}>
  🧠 Risk is mainly influenced by{" "}
  {topFeatures && topFeatures.length > 0
    ? topFeatures.slice(0, 3).map(f => f.name).join(", ")
    : "age, tumor size and stage"}.
</p>
        <p>
          <strong>Model Confidence:</strong>{" "}
          {confidence !== null ? `${confidence}%` : "Calculating..."}
        </p>

        <h3>Risk Factor Analysis</h3>
        <div style={{ height: "300px", marginTop: "10px" }}>
          <canvas id="riskChart"></canvas>
        </div>

        <h3 style={{ marginTop: "30px" }}>
          Feature Contribution (AI Explanation)
        </h3>

        <div style={{ height: "300px", marginTop: "10px" }}>
          <canvas id="featureChart"></canvas>
        </div>

        {/* Key Risk Factors */}
        <div className="glass-card">
          <h3>🧠 Key Risk Factors</h3>

          {topFeatures.map((item, index) => (
            <div key={index} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              marginBottom: "8px",
              background: "#ffe5e5",
              borderLeft: "5px solid #ef4444"
            }}>
              <span>{item.name}</span>
              <span>🔴 Increases risk ({item.value})</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
  <button onClick={() => navigate("/patient")}>
    New Prediction
  </button>

  <button onClick={handleDownloadPDF}>
    Download PDF
  </button>
</div>
      </div>
    </div>
  );
}

export default Result;