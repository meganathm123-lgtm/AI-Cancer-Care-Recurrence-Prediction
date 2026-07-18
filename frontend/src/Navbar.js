import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./styles/navbar.css";
import logo from "./assets/logo.png";
import Logo from "./components/Logo";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const hideCenterMenu =
  location.pathname === "/patient" ||
  location.pathname === "/result";;

  // ❌ Hide Navbar in login/signup
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <div className="navbar">

      {/* 🔹 LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <Logo size={30} />
  <span>Cancer Recurrence AI System</span>
</div>


      {/* 🔹 CENTER */}
{/* 🔹 CENTER */}
<div className="nav-center">
  {!hideCenterMenu && (
    <>
      <span onClick={() => navigate("/home")}>Home</span>

      <span onClick={() => navigate("/patient")}>Patient Portal</span>

      {user?.role === "admin" && (
        <span onClick={() => navigate("/clinical")}>Clinical Portal</span>
      )}

      <span onClick={() => navigate("/analytics")}>Analytics</span>
    </>
  )}
</div>
      {/* 🔹 RIGHT */}
      <div className="nav-right">
        <FaUserCircle
          size={28}
          className="profile-icon"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="dropdown">
            <p onClick={handleLogout}>Logout</p>
          </div>
          
        )}
        
      </div>

    </div>
  );
}

export default Navbar;