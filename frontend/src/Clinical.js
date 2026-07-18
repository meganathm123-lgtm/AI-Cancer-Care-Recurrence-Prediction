import { useNavigate } from "react-router-dom";
import AnimatedBackground from "./components/AnimatedBackground";
import "./Clinical.css";
import { useEffect } from "react";

function Clinical() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const user = JSON.parse(localStorage.getItem("user"));

    // 🔒 AUTH CHECK
    if (auth !== "true") {
      navigate("/login");
      return;
    }

    // 🔒 ROLE CHECK (ADMIN ONLY)
    if (user?.role !== "admin") {
      navigate("/patient");
      return;
    }

  }, [navigate]);

  return (
    <div>
      <AnimatedBackground />

      <div className="container">

        {/* TITLE */}
        <h2 className="title">🏥 Hospital Admin Panel</h2>

        {/* NAVIGATION BUTTONS */}
        <div className="nav-buttons">

          {/* DASHBOARD */}
          <button
            className="nav-btn primary"
            onClick={() => navigate("/admin-dashboard")}
          >
            🏥 Dashboard
          </button>

          {/* ANALYTICS */}
          <button
            className="nav-btn secondary"
            onClick={() => navigate("/analytics")}
          >
            📊 Analytics
          </button>

          {/* EXPLAIN AI */}
          <button
            className="nav-btn secondary"
            onClick={() => navigate("/explain")}
          >
            🤖 Explain AI
          </button>

        </div>

      </div>
    </div>
  );
}

export default Clinical;