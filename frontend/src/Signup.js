import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/glass.css";
import "./styles/buttons.css";
import "./styles/auth.css";
import Logo from "./components/Logo";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import toast from "react-hot-toast";
import { useEffect } from "react";

function Signup() {
  useEffect(() => {
  toast.dismiss();
}, []);
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ MANUAL SIGNUP
  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(data.error || "Signup failed");
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

        <h2 style={{ textAlign: "center" }}>Sign up</h2>

        {/* 🔽 ROLE */}
        <select onChange={(e) => setRole(e.target.value)}>
          <option value="patient">Patient</option>
          <option value="admin">Admin</option>
        </select>

        {/* 🧑 NAME */}
        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        {/* 📧 EMAIL */}
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔑 PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🔥 SIGNUP BUTTON */}
        <button className="gradient-btn" onClick={handleSignup}>
          Sign up
        </button>

        {/* 🔥 DIVIDER */}
        <div className="divider">
          <span>or</span>
        </div>

        {/* 🔥 GOOGLE BUTTON */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
            alt="google"
          />
          Continue with Google
        </button>

        {/* 🔗 SIGN IN */}
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            className="link"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;