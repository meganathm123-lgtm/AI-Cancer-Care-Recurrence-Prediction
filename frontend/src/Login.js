import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/glass.css";
import "./styles/buttons.css";
import "./styles/auth.css";
import Logo from "./components/Logo";
import toast from "react-hot-toast";
import { useEffect } from "react";

// 🔥 Firebase
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

function Login() {
  useEffect(() => {
  toast.dismiss();
}, []);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // ✅ MANUAL LOGIN
  const handleLogin = async () => {
    if (!name || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("auth", "true");

        if (data.user.role === "admin") {
          navigate("/clinical");
        } else {
          navigate("/patient");
        }
      } else {
        alert(data.error || "Invalid login");
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // ✅ GOOGLE LOGIN (FIXED)
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        role: "patient"
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("auth", "true");

      // 🔥 IMPORTANT FIX
      setTimeout(() => {
        navigate("/patient");
      }, 300);

    } catch (error) {
      console.error(error);
      alert("Google login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* ✅ FIXED LOGO */}
        <div style={{ textAlign: "center" }}>
          <Logo size={50} />
          <h3 style={{ color: "#2563eb", marginBottom: "10px" }}>
            Cancer Recurrence AI System
          </h3>
        </div>

        <h2 style={{ textAlign: "center" }}>Welcome back</h2>

        {/* 🔹 NAME */}
        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        {/* 🔹 PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🔥 LOGIN BUTTON */}
        <button className="gradient-btn" onClick={handleLogin}>
          Sign in
        </button>

        {/* 🔥 DIVIDER */}
        <div className="divider">
          <span>or</span>
        </div>

        

        {/* 🔗 SIGNUP */}
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="link"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;