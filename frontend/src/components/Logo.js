import logo from "../assets/logo.png";
import "./logo.css";

function Logo({ size = 40 }) {
  return (
    <img
      src={logo}
      alt="logo"
      className="logo-animate"
      style={{ width: size, height: size }}
    />
  );
}

export default Logo;