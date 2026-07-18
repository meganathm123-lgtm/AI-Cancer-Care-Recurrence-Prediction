import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import AnimatedBackground from "./components/AnimatedBackground";
import "./Clinical.css";

function Analytics() {

  const pieRef = useRef(null);
  const barRef = useRef(null);
  const factorRef = useRef(null);

  const pieChart = useRef(null);
  const barChart = useRef(null);
  const factorChart = useRef(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/analytics-data")
      .then(res => res.json())
      .then(data => {

        // Destroy old charts (important)
        if (pieChart.current) pieChart.current.destroy();
        if (barChart.current) barChart.current.destroy();
        if (factorChart.current) factorChart.current.destroy();

        // 🔵 1. PIE CHART → Risk Level Distribution
        pieChart.current = new Chart(pieRef.current, {
          type: "pie",
          data: {
            labels: ["Low Risk", "Medium Risk", "High Risk"],
datasets: [{
  data: [
    data.low || 0,
    data.medium || 0,
    data.high || 0   // ✅ ADD THIS
  ],
  backgroundColor: [
    "#3b82f6",   // blue
    "#f59e0b",   // yellow
    "#ef4444"    // red
  ]
}]
          },
         options: {
  responsive: true,
  maintainAspectRatio: false,  // MUST
  layout: {
    padding: 5   // 🔥 reduce internal spacing
  }
}
        });

        // 🔵 2. BAR CHART → Cancer Type Distribution
        barChart.current = new Chart(barRef.current, {
          type: "bar",
          data: {
            labels: ["Breast", "Lung", "Colon", "Prostate"],
            datasets: [{
              label: "Cases",
              data: [
                data.breast || 0,
                data.lung || 0,
                data.colon || 0,
                data.prostate || 0
              ],
              backgroundColor: "#3b82f6"
            }]
          },
         options: {
  responsive: true,
  maintainAspectRatio: false,  // MUST
  layout: {
    padding: 5   // 🔥 reduce internal spacing
  }
}
        });

        // 🔵 3. FACTOR IMPACT → Feature Importance
        factorChart.current = new Chart(factorRef.current, {
          type: "bar",
          data: {
            labels: ["Age", "Stage", "Treatment", "Smoking"],
            datasets: [{
              label: "Impact Score",
              data: [
                data.age || 0,
                data.stage || 0,
                data.treatment || 0,
                data.smoking || 0
              ],
              backgroundColor: "#22c55e"
            }]
          },
        options: {
  responsive: true,
  maintainAspectRatio: false,  // MUST
  layout: {
    padding: 5   // 🔥 reduce internal spacing
  }
}
        });

      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
  <AnimatedBackground />

  {/* charts */}

    <div className="container">

      <h2 className="title">📊 Prediction Analytics Dashboard</h2>

      {/* 🔵 PIE */}
      <h3 className="chart-title">Risk Level Distribution</h3>

      <div className="analytics-chart">
        <canvas ref={pieRef}></canvas>
      </div>

      {/* 🔵 BAR */}
      <h3 className="chart-title">Cancer Type Distribution</h3>
      <div className="analytics-chart">
       
        <canvas ref={barRef}></canvas>
      </div>

      {/* 🔵 FACTOR */}
      <h3 className="chart-title">Feature Impact Analysis</h3>
      <div className="analytics-chart">
       
        <canvas ref={factorRef}></canvas>
      </div>

    </div>
    </div>
  );
}

export default Analytics;