import React, { useState } from "react";
import "./contact.css";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // fake success (no backend)
    setSuccess("Your message has been sent successfully 🎉");

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <main className="contact-page">
      <div className="contact-page-header">
        <div>
          <h1>Contact Support</h1>
          <p>Need help? Send your query to HealthHub support team</p>
        </div>

        <span className="contact-header-icon material-symbols-outlined">
          support_agent
        </span>
      </div>

      <section className="contact-layout">
        <div className="contact-info-card">
          <h2>Support Details</h2>

          <div className="contact-info-list">
            <div className="contact-info-item">
              <span className="material-symbols-outlined">mail</span>
              <div>
                <p>Email Support</p>
                <strong>support@healthhub.com</strong>
              </div>
            </div>

            <div className="contact-info-item">
              <span className="material-symbols-outlined">call</span>
              <div>
                <p>Phone Support</p>
                <strong>+91 9876543210</strong>
              </div>
            </div>

            <div className="contact-info-item">
              <span className="material-symbols-outlined">schedule</span>
              <div>
                <p>Available Time</p>
                <strong>Mon - Sat, 9:00 AM - 8:00 PM</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          <div className="contact-card-title">
            <h2>Help Form</h2>
          </div>

          {success && <div className="contact-success">{success}</div>}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "contact-input-error" : ""}
              />
              {errors.name && <span>{errors.name}</span>}
            </div>

            <div className="contact-field">
              <label>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "contact-input-error" : ""}
              />
              {errors.email && <span>{errors.email}</span>}
            </div>

            <div className="contact-field">
              <label>Message</label>
              <textarea
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? "contact-input-error" : ""}
              />
              {errors.message && <span>{errors.message}</span>}
            </div>

            <button type="submit" className="contact-send-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;
