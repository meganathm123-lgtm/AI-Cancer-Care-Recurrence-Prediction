import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast"; // ✅ correct import

import Home from "./Home";
import Patient from "./Patient";
import Result from "./Result";
import Clinical from "./Clinical";
import Navbar from "./Navbar";
import AdminDashboard from "./AdminDashboard";
import Analytics from "./Analytics";
import Explainability from "./Explainability";
import AnimatedBackground from "./components/AnimatedBackground";
import Login from "./Login";
import Admin from "./Admin";
import Signup from "./Signup";



function AppWrapper() {
  const isAuth = localStorage.getItem("auth");

  return (
    <BrowserRouter>
      <MainApp isAuth={isAuth} />
    </BrowserRouter>
  );
}

function MainApp({ isAuth }) {
  
  
  const location = useLocation();
 
  return (
    <div>
      {/* 🌌 Background */}
      <AnimatedBackground />
      <Toaster position="top-right" />
      

      {/* ✅ Navbar (ONLY ONCE + OUTSIDE ROUTES) */}
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Navbar />
      )}

      <Routes>

        {/* 🔥 Default → Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 🔐 Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 Protected Admin */}
        <Route
          path="/admin"
          element={isAuth ? <Admin /> : <Navigate to="/login" />}
        />

        {/* 🏥 Main Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/result" element={<Result />} />
        <Route path="/clinical" element={<Clinical />} />

        {/* 📊 Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* 📈 Analytics */}
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/explain" element={<Explainability />} />

      </Routes>
    </div>
  );
}

export default AppWrapper;