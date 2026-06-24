import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./adminlayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const admin =
    JSON.parse(localStorage.getItem("admin")) ||
    JSON.parse(localStorage.getItem("loggedInUser")) ||
    {};

  const products = JSON.parse(localStorage.getItem("medicines")) || [];

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <span className="material-symbols-outlined">local_mall</span>
          </div>

          <div>
            <h2>HealthHub</h2>
            <p>Admin Panel</p>
          </div>
        </div>

        <div className="admin-user-card">
          <div className="admin-avatar">
            {admin.image ? (
              <img src={admin.image} alt={admin.name || "Admin"} />
            ) : (
              <span>{(admin.name || "A").charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div>
            <p>Welcome,</p>
            <h3>{admin.name || "Admin"}</h3>
          </div>
        </div>

        <nav className="admin-nav">
          <p className="admin-nav-title">Management</p>

          <NavLink to="/admindashboard">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </NavLink>

          <NavLink to="/addproduct">
            <span className="material-symbols-outlined">add_box</span>
            Add Medicine
          </NavLink>

          <NavLink to="/productlist">
            <span className="material-symbols-outlined">inventory_2</span>
            Product List
            {products.length > 0 && <b>{products.length}</b>}
          </NavLink>

          <p className="admin-nav-title">Account</p>

          <NavLink to="/adminprofile">
            <span className="material-symbols-outlined">
              admin_panel_settings
            </span>
            Admin Profile
          </NavLink>

          <NavLink to="/userhome">
            <span className="material-symbols-outlined">storefront</span>
            View Store
          </NavLink>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;