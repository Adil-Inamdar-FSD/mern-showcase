import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    name: "",
    pass: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    pass: "",
    general: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

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
      pass: "",
      general: "",
    };

    if (!data.name.trim()) newErrors.name = "Username or email is required";
    if (!data.pass.trim()) newErrors.pass = "Password is required";

    if (newErrors.name || newErrors.pass) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(`${serverUrl}/api/auth/login`, {
        emailOrUsername: data.name,
        password: data.pass,
      });

      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

      // store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      // optional: axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // role-based navigation
      if (user.role === "owner") {
        navigate("/admindashboard");
      } else {
        navigate("/userhome");
      }
    } catch (err) {
      setErrors({
        ...newErrors,
        general: err.response?.data?.message || "Invalid credentials",
      });
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-left-panel">
          <div className="login-brand">
            <div className="login-logo-circle">
              <span className="material-symbols-outlined">local_mall</span>
            </div>

            <div>
              <h1>HealthHub</h1>
              <p>Smart healthcare shopping platform</p>
            </div>
          </div>

          <div className="login-hero-text">
            <h2>Welcome Back</h2>
            <p>
              Login to manage medicines, orders, prescriptions and appointments.
            </p>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Sign In</h2>
            <p>Enter your account details to continue</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label>Email or Username</label>

              <div
                className={`login-input-box ${
                  errors.name ? "input-box-error" : ""
                }`}
              >
                <span className="material-symbols-outlined">person</span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter email or username"
                  value={data.name}
                  onChange={handleChange}
                />
              </div>

              {errors.name && <p className="login-error">{errors.name}</p>}
            </div>

            <div className="login-input-group">
              <label>Password</label>

              <div
                className={`login-input-box ${
                  errors.pass ? "input-box-error" : ""
                }`}
              >
                <span className="material-symbols-outlined">lock</span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="pass"
                  placeholder="••••••••"
                  value={data.pass}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {errors.pass && <p className="login-error">{errors.pass}</p>}
            </div>

            {errors.general && (
              <p className="login-error general">{errors.general}</p>
            )}

            <button type="submit" className="login-btn">
              Sign In
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <p className="login-signup">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Join now</span>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
