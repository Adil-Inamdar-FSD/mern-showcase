import React, { useEffect, useState } from "react";
import "./adminprofile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";

function AdminProfile() {
  const navigate = useNavigate();

  const defaultAdmin = {
    name: "HealthHub Admin",
    email: "admin@healthhub.com",
    phone: "+91 9876543210",
    role: "Admin",
    address: "Nashik, Maharashtra, India",
    joined: "2026",
    image: "https://i.pravatar.cc/150?img=15",
  };

  const storedAdmin =
    JSON.parse(localStorage.getItem("loggedInUser")) ||
    JSON.parse(localStorage.getItem("admin"));

  const [adminData, setAdminData] = useState(storedAdmin || defaultAdmin);
  const [isEditing, setIsEditing] = useState(false);

  const products = JSON.parse(localStorage.getItem("medicines")) || [];
  const users = JSON.parse(localStorage.getItem("list")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  // ✅ Load from MongoDB
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${serverUrl}/api/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data?.user) {
          setAdminData(res.data.user);
        }
      } catch (err) {
        console.log("FETCH PROFILE ERROR:", err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setAdminData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ✅ SAVE TO MONGODB
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${serverUrl}/api/update-profile`,
        adminData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data?.user) {
        setAdminData(res.data.user);
        localStorage.setItem("loggedInUser", JSON.stringify(res.data.user));
      }

      setIsEditing(false);
    } catch (err) {
      console.log("PROFILE UPDATE ERROR:", err.message);
    }
  };

  const handleCancel = () => {
    setAdminData(storedAdmin || defaultAdmin);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <main className="admin-profile-page">
      <section className="admin-profile-header">
        <div>
          <span className="admin-profile-label">Admin Account</span>
          <h1>Admin Profile</h1>
          <p>Manage your HealthHub admin account and store controls.</p>
        </div>

        <button
          className="admin-profile-dashboard-btn"
          onClick={() => navigate("/admindashboard")}
        >
          <span className="material-symbols-outlined">dashboard</span>
          Dashboard
        </button>
      </section>

      <section className="admin-profile-layout">
        <aside className="admin-profile-sidebar-card">
          <div className="admin-profile-avatar-box">
            <div className="admin-profile-image-wrap">
              <img
                src={adminData.image || defaultAdmin.image}
                alt={adminData.name || "Admin"}
                className="admin-profile-avatar"
              />

              {isEditing && (
                <label className="admin-profile-image-btn">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <span className="material-symbols-outlined">
                    photo_camera
                  </span>
                </label>
              )}
            </div>

            {!isEditing ? (
              <>
                <h2>{adminData.name || "Admin"}</h2>
                <p>{adminData.email || "admin@healthhub.com"}</p>
              </>
            ) : (
              <>
                <input
                  name="name"
                  value={adminData.name || ""}
                  onChange={handleChange}
                  className="admin-profile-input center"
                  placeholder="Admin name"
                />

                <input
                  name="email"
                  value={adminData.email || ""}
                  onChange={handleChange}
                  className="admin-profile-input center"
                  placeholder="Admin email"
                />
              </>
            )}

            <span className="admin-profile-badge">
              {adminData.role || "Admin"}
            </span>
          </div>

          <div className="admin-profile-quick-actions">
            {isEditing ? (
              <div className="admin-profile-edit-actions">
                <button className="save" onClick={handleSave}>
                  <span className="material-symbols-outlined">save</span>
                  Save
                </button>

                <button className="cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)}>
                <span className="material-symbols-outlined">edit</span>
                Edit Profile
              </button>
            )}

            <button onClick={() => navigate("/addproduct")}>
              <span className="material-symbols-outlined">add_box</span>
              Add Medicine
            </button>

            <button onClick={() => navigate("/productlist")}>
              <span className="material-symbols-outlined">inventory_2</span>
              Medicine List
            </button>

            <button className="logout" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </aside>

        <section className="admin-profile-main">
          <div className="admin-profile-stats">
            <div className="admin-profile-stat">
              <span className="material-symbols-outlined">medication</span>
              <div>
                <h3>{products.length}</h3>
                <p>Products</p>
              </div>
            </div>

            <div className="admin-profile-stat">
              <span className="material-symbols-outlined">groups</span>
              <div>
                <h3>{users.length}</h3>
                <p>Users</p>
              </div>
            </div>

            <div className="admin-profile-stat">
              <span className="material-symbols-outlined">shopping_bag</span>
              <div>
                <h3>{orders.length}</h3>
                <p>Orders</p>
              </div>
            </div>
          </div>

          <div className="admin-profile-info-card">
            <div className="admin-profile-card-title">
              <h3>Admin Information</h3>
              <p>Basic account and contact details</p>
            </div>

            <div className="admin-profile-info-grid">
              <div className="admin-profile-field">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    name="name"
                    value={adminData.name || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>{adminData.name}</strong>
                )}
              </div>

              <div className="admin-profile-field">
                <label>Email Address</label>
                {isEditing ? (
                  <input
                    name="email"
                    value={adminData.email || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>{adminData.email}</strong>
                )}
              </div>

              <div className="admin-profile-field">
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    name="phone"
                    value={adminData.phone || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>{adminData.phone}</strong>
                )}
              </div>

              <div className="admin-profile-field">
                <label>Role</label>
                <strong>{adminData.role}</strong>
              </div>

              <div className="admin-profile-field full">
                <label>Address</label>
                {isEditing ? (
                  <input
                    name="address"
                    value={adminData.address || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>{adminData.address}</strong>
                )}
              </div>

              <div className="admin-profile-field">
                <label>Joined</label>
                <strong>{adminData.joined}</strong>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default AdminProfile;
