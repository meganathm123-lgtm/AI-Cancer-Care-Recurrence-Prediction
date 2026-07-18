import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./Clinical.css";

function Explainability() {

  const chartRef = useRef(null);

  useEffect(() => {

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById("explainChart");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Age", "Gender", "Tumor Size", "Tumor Area",
          "Tumor Shape", "Cancer Stage", "Treatment",
          "Lymph Node", "Tumor Grade", "Family History", "Smoking"
        ],
        datasets: [{
          label: "Feature Importance",
          data: [5, 3, 40, 90, 80, 20, 25, 15, 10, 8, 12],
          backgroundColor: "#3b82f6"
        }]
      },
      options: {
        indexAxis: 'y', // 🔥 horizontal chart like flask
        responsive: true,
        maintainAspectRatio: false
      }
    });

  }, []);

  return (
    <div className="container">

      <h2 className="title">🤖 Model Explainability (Feature Importance)</h2>

      <div className="analytics-chart">
        <canvas id="explainChart"></canvas>
      </div>

    </div>
  );
}

export default Explainability;