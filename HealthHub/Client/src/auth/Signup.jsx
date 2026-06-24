import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import axios from "axios";
import { serverUrl } from "../App";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    pass: "",
    confirm: "",
    type: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    pass: "",
    confirm: "",
    type: "",
    general: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });

    setErrors({
      ...errors,
      [e.target.name]: "",
      general: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      username: "",
      email: "",
      pass: "",
      confirm: "",
      type: "",
      general: "",
    };

    if (!data.name.trim()) newErrors.name = "Full name is required";
    if (!data.username.trim()) newErrors.username = "Username is required";
    if (!data.email.trim()) newErrors.email = "Email is required";
    if (!data.pass.trim()) newErrors.pass = "Password is required";
    if (!data.confirm.trim())
      newErrors.confirm = "Confirm password is required";
    if (!data.type.trim()) newErrors.type = "Please select account type";

    if (data.pass && data.confirm && data.pass !== data.confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    if (
      newErrors.name ||
      newErrors.username ||
      newErrors.email ||
      newErrors.pass ||
      newErrors.confirm ||
      newErrors.type
    ) {
      setErrors(newErrors);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${serverUrl}/api/auth/register`, {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.pass,
        role: data.type,
      });

      const user = res.data.user;

      if (user?._id) {
        localStorage.setItem("userId", user._id);
      }
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);

    
      const message =
        err.response?.data?.message || err.message || "Server error";

      setErrors({
        ...newErrors,
        general: message,
      });
    }
  };
  return (
    <main className="signup-page">
      <section className="signup-container">
        <div className="signup-left-panel">
          <div className="signup-brand">
            <div className="signup-logo-circle">
              <span className="material-symbols-outlined">local_mall</span>
            </div>

            <div>
              <h1>HealthHub</h1>
              <p>Smart healthcare shopping platform</p>
            </div>
          </div>

          <div className="signup-hero-text">
            <h2>Create Account</h2>
            <p>
              Join HealthHub to shop medicines, manage orders, upload
              prescriptions and book appointments.
            </p>
          </div>
        </div>

        <div className="signup-card">
          <div className="signup-card-header">
            <button className="signup-back-btn" onClick={() => navigate("/")}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <div>
              <h2>Sign Up</h2>
              <p>Create your HealthHub account</p>
            </div>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            {errors.general && (
              <p className="signup-error general">{errors.general}</p>
            )}

            <div className="signup-grid">
              <div className="signup-input-group">
                <label>Full Name</label>

                <div
                  className={`signup-input-box ${
                    errors.name ? "input-box-error" : ""
                  }`}
                >
                  <span className="material-symbols-outlined">person</span>

                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={data.name}
                    onChange={handleChange}
                  />
                </div>

                {errors.name && <p className="signup-error">{errors.name}</p>}
              </div>

              <div className="signup-input-group">
                <label>Username</label>

                <div
                  className={`signup-input-box ${
                    errors.username ? "input-box-error" : ""
                  }`}
                >
                  <span className="material-symbols-outlined">badge</span>

                  <input
                    type="text"
                    name="username"
                    placeholder="john123"
                    value={data.username}
                    onChange={handleChange}
                  />
                </div>

                {errors.username && (
                  <p className="signup-error">{errors.username}</p>
                )}
              </div>

              <div className="signup-input-group">
                <label>Email Address</label>

                <div
                  className={`signup-input-box ${
                    errors.email ? "input-box-error" : ""
                  }`}
                >
                  <span className="material-symbols-outlined">mail</span>

                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={data.email}
                    onChange={handleChange}
                  />
                </div>

                {errors.email && <p className="signup-error">{errors.email}</p>}
              </div>

              <div className="signup-input-group">
                <label>Account Type</label>

                <select
                  name="type"
                  value={data.type}
                  onChange={handleChange}
                  className={`signup-select ${
                    errors.type ? "input-box-error" : ""
                  }`}
                >
                  <option value="">Select Type</option>
                  <option value="owner">Owner</option>
                  <option value="user">User</option>
                </select>

                {errors.type && <p className="signup-error">{errors.type}</p>}
              </div>

              <div className="signup-input-group">
                <label>Password</label>

                <div
                  className={`signup-input-box ${
                    errors.pass ? "input-box-error" : ""
                  }`}
                >
                  <span className="material-symbols-outlined">lock</span>

                  <input
                    type="password"
                    name="pass"
                    placeholder="••••••••"
                    value={data.pass}
                    onChange={handleChange}
                  />
                </div>

                {errors.pass && <p className="signup-error">{errors.pass}</p>}
              </div>

              <div className="signup-input-group">
                <label>Confirm Password</label>

                <div
                  className={`signup-input-box ${
                    errors.confirm ? "input-box-error" : ""
                  }`}
                >
                  <span className="material-symbols-outlined">lock</span>

                  <input
                    type="password"
                    name="confirm"
                    placeholder="••••••••"
                    value={data.confirm}
                    onChange={handleChange}
                  />
                </div>

                {errors.confirm && (
                  <p className="signup-error">{errors.confirm}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="signup-btn-primary"
            >
              {loading ? "Creating..." : "Create Account"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <p className="signup-login-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Sign in</span>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Signup;
