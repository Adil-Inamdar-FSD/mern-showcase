import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./UserLayout.css";

function UserLayout() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const wishlist = JSON.parse(localStorage.getItem("favirote")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="user-layout">
      <aside className="user-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <span className="material-symbols-outlined">local_mall</span>
          </div>

          <div>
            <h2>HealthHub</h2>
            <p>Smart Medicine Store</p>
          </div>
        </div>

        <div className="sidebar-user-card">
          <div className="user-avatar">
            {(user.name || "U").charAt(0).toUpperCase()}
          </div>

          <div>
            <p>Hello,</p>
            <h3>{user.name || "User"}</h3>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-title">Shopping</p>

          <NavLink to="/userhome">
            <span className="material-symbols-outlined">storefront</span>
            Home
          </NavLink>

          <NavLink to="/cart">
            <span className="material-symbols-outlined">shopping_cart</span>
            Cart
            {cart.length > 0 && <b>{cart.length}</b>}
          </NavLink>

          <NavLink to="/favirote">
            <span className="material-symbols-outlined">favorite</span>
            Wishlist
            {wishlist.length > 0 && <b>{wishlist.length}</b>}
          </NavLink>

          <NavLink to="/orders">
            <span className="material-symbols-outlined">receipt_long</span>
            Orders
            {orders.length > 0 && <b>{orders.length}</b>}
          </NavLink>

          <p className="sidebar-title">Health Services</p>

          <NavLink to="/priscription">
            <span className="material-symbols-outlined">upload_file</span>
            Prescription
          </NavLink>

          <NavLink to="/doctorinfo">
            <span className="material-symbols-outlined">medical_services</span>
            Health Info
          </NavLink>

          <NavLink to="/appointment">
            <span className="material-symbols-outlined">calendar_month</span>
            Appointments
          </NavLink>

          <p className="sidebar-title">Account</p>

          <NavLink to="/profile">
            <span className="material-symbols-outlined">person</span>
            My Account
          </NavLink>

          <NavLink to="/contact">
            <span className="material-symbols-outlined">support_agent</span>
            Help Center
          </NavLink>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </aside>

      <main className="user-content">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;