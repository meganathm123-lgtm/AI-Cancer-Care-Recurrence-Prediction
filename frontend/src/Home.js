import { useNavigate } from "react-router-dom";
import AnimatedBackground from "./components/AnimatedBackground";
import "./Home.css";
import Logo from "./components/Logo";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
  <AnimatedBackground />

  {/* charts */}

    <div className="home-container">
     <h1 className="main-title">
      <span className="icon"><Logo size={40} /></span> Cancer Recurrence Risk Prediction System
      </h1>
      <p>Select Portal</p>

      <button className="patient" onClick={() => navigate("/patient")}>
        Patient Portal
      </button>

      <button className="clinical" onClick={() => navigate("/clinical")}>
        Clinical Portal
      </button>
    </div>
    </div>
  );
}

export default Home;