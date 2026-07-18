import React from "react";
import "./AnimatedBackground.css";

import dna from "../assets/dna.png";
import ribbon from "../assets/ribbon.png";
import cell from "../assets/cell.png";
import microscope from "../assets/microscope.png";
import hospital from "../assets/hospital.png";
import report from "../assets/report.png";

import doctor from "../assets/doctor.png";
import stethoscope from "../assets/stethoscope.png";
import injection from "../assets/injection.png";
import tablets from "../assets/tablets.png";

function AnimatedBackground() {
  return (
    <div className="animated-bg">

      {/* 🔥 WRAP ICONS IN LAYER */}
      <div className="bg-icons">

        <img src={dna} className="float-icon slow" alt="" />
        <img src={ribbon} className="float-icon medium" alt="" />
        <img src={cell} className="float-icon fast" alt="" />
        <img src={microscope} className="float-icon slow" alt="" />
        <img src={hospital} className="float-icon medium" alt="" />
        <img src={report} className="float-icon fast" alt="" />
        <img src={doctor} className="float-icon slow" alt="" />
        <img src={stethoscope} className="float-icon medium" alt="" />
        <img src={injection} className="float-icon fast" alt="" />
        <img src={tablets} className="float-icon slow" alt="" />

      </div>

    </div>
  );
}

export default AnimatedBackground;