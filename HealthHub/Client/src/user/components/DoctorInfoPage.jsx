import React from "react";
import "./doctorinfo.css";

function DoctorInfoPage() {
  const healthCards = [
    {
      icon: "thermostat",
      title: "Fever Care",
      text: "Drink enough water, take proper rest, and use medicines only as directed.",
    },
    {
      icon: "vaccines",
      title: "Vitamin Guide",
      text: "Daily vitamins can support immunity, but avoid unnecessary supplements.",
    },
    {
      icon: "healing",
      title: "Cold & Cough",
      text: "Use steam, warm fluids, and consult a doctor if symptoms continue.",
    },
  ];

  const guidance = [
    "Check expiry date before using any medicine.",
    "Follow the correct dosage written on the prescription.",
    "Do not mix medicines without medical advice.",
    "Store medicines in a cool and dry place.",
  ];

  return (
    <main className="doctor-page">
      <div className="doctor-page-header">
        <div>
          <h1>Health Information</h1>
          <p>Simple medicine guidance and wellness tips for daily care</p>
        </div>

        <span className="doctor-header-icon material-symbols-outlined">
          medical_information
        </span>
      </div>

      <section className="doctor-grid">
        {healthCards.map((item) => (
          <div className="doctor-card" key={item.title}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </section>

      <section className="doctor-info-card">
        <div>
          <h2>Medicine Guidance</h2>
          <p>Follow these safety tips before taking medicines.</p>
        </div>

        <ul>
          {guidance.map((item) => (
            <li key={item}>
              <span className="material-symbols-outlined">check_circle</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default DoctorInfoPage;