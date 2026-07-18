import { useEffect, useState } from "react";
import "./Clinical.css";

function AdminDashboard() {

  const [data, setData] = useState({
    total: 0,
    high_risk: 0,
    low_risk: 0,
    recent: []
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/admin-data")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">

      <h2 className="title">🏥 Admin Dashboard</h2>

      {/* CARDS */}
      <div className="card-container">

        <div className="card">
          <h3>Total Predictions</h3>
          <h1>{data.total}</h1>
        </div>

        <div className="card high">
          <h3>High Risk Cases</h3>
          <h1>{data.high_risk}</h1>
        </div>

        <div className="card low">
          <h3>Low Risk Cases</h3>
          <h1>{data.low_risk}</h1>
        </div>

      </div>

      {/* DOWNLOAD */}
      <button
        className="download-btn"
        onClick={() => window.location.href = "http://127.0.0.1:5000/download-csv"}
      >
        ⬇ Download Dataset CSV
      </button>

      {/* TABLE */}
      <h3 className="table-title">Recent Patients</h3>

      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Cancer Type</th>
            <th>Risk Score</th>
            <th>Risk Level</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {data.recent.map((r, i) => (
            <tr key={i}>
              <td>{r[0]}</td>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
              <td>{r[3]}</td>
              <td>{r[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminDashboard;