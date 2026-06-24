import React, { useEffect, useMemo, useState } from "react";
import "./admindashboard.css";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const adminData = JSON.parse(localStorage.getItem("loggedInUser")) || null;

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
  const fetchData = async () => {
    try {
      const [medRes, orderRes, presRes] = await Promise.allSettled([
        axios.get(`${serverUrl}/api/product`),
        axios.get(`${serverUrl}/api/get-order`),
        axios.get(`${serverUrl}/api/get-prescriptions`),
      ]);

      const products =
        medRes.status === "fulfilled"
          ? medRes.value.data?.data || medRes.value.data || []
          : [];

      const orders =
        orderRes.status === "fulfilled"
          ? orderRes.value.data?.data || orderRes.value.data || []
          : [];

      const prescriptions =
        presRes.status === "fulfilled"
          ? presRes.value.data?.data || presRes.value.data || []
          : [];

      setMedicines(products);
      setOrders(orders);
      setPrescriptions(prescriptions);

      const uniqueCategories = [
        ...new Set(products.map((item) => item.category).filter(Boolean)),
      ];

      setCategories(uniqueCategories);
    } catch (err) {
      console.log("Dashboard fetch error:", err.message);
    }
  };

  fetchData();
}, []);



  const formatINR = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  };

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/80x80?text=Med";

    return url.startsWith("http") || url.startsWith("data:image")
      ? url
      : `https://batch-6-backend-production.up.railway.app${url}`;
  };

  const filteredMedicines = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return medicines;

    return medicines.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term) ||
        item.brand?.toLowerCase().includes(term),
    );
  }, [searchTerm, medicines]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );

  const recentOrders = orders.slice(0, 5);
  const recentMedicines = filteredMedicines.slice(0, 6);

  return (
    <main className="admin-dash-page">
      <section className="admin-dash-header">
        <div>
          <span className="admin-dash-label">Admin Dashboard</span>
          <h1>Hello, {adminData.name}</h1>
          <p>Manage medicines, categories, orders and store activity.</p>
        </div>

        <div className="admin-dash-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search medicines, brands, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <span className="material-symbols-outlined">medication</span>
          </div>
          <div>
            <p>Total Medicines</p>
            <h2>{medicines.length}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <span className="material-symbols-outlined">category</span>
          </div>
          <div>
            <p>Categories</p>
            <h2>{categories.length}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <span className="material-symbols-outlined">shopping_bag</span>
          </div>
          <div>
            <p>Total Orders</p>
            <h2>{orders.length}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div>
            <p>Revenue</p>
            <h2>{formatINR(totalRevenue)}</h2>
          </div>
        </div>
      </section>

      <section className="admin-action-grid">
        <button onClick={() => navigate("/addproduct")}>
          <span className="material-symbols-outlined">add_box</span>
          <div>
            <h3>Add Medicine</h3>
            <p>Create new medicine listing</p>
          </div>
        </button>

        <button onClick={() => navigate("/productlist")}>
          <span className="material-symbols-outlined">inventory_2</span>
          <div>
            <h3>Manage Products</h3>
            <p>Edit, update and remove medicines</p>
          </div>
        </button>

        <button onClick={() => navigate("/userhome")}>
          <span className="material-symbols-outlined">storefront</span>
          <div>
            <h3>Open Store</h3>
            <p>Preview customer shopping page</p>
          </div>
        </button>

        <button onClick={() => navigate("/adminprofile")}>
          <span className="material-symbols-outlined">
            admin_panel_settings
          </span>
          <div>
            <h3>Admin Profile</h3>
            <p>View admin account details</p>
          </div>
        </button>
      </section>

      <section className="admin-main-grid">
        <div className="admin-panel admin-products-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Medicines Overview</h2>
              <p>{filteredMedicines.length} medicines found</p>
            </div>

            <button onClick={() => navigate("/productlist")}>View All</button>
          </div>

          {recentMedicines.length > 0 ? (
            <div className="admin-product-list">
              {recentMedicines.map((item, index) => (
                <div className="admin-product-row" key={item._id || index}>
                  <img
                    src={getImageUrl(item.imageUrl || item.image)}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80x80?text=Med";
                    }}
                  />

                  <div>
                    <h3>{item.name || "Medicine"}</h3>
                    <p>{item.category || "No category"}</p>
                  </div>

                  <strong>{formatINR(item.price)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-box">
              <span className="material-symbols-outlined">inventory</span>
              <p>No medicines found.</p>
            </div>
          )}
        </div>

        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Categories</h2>
              <p>Medicine groups</p>
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="admin-category-list">
              {categories.map((cat, index) => (
                <div className="admin-category-pill" key={index}>
                  <span className="material-symbols-outlined">label</span>
                  {cat}
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-box">
              <span className="material-symbols-outlined">category</span>
              <p>No categories found.</p>
            </div>
          )}
        </div>
      </section>

      <section className="admin-bottom-grid">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Recent Orders</h2>
              <p>Latest customer purchases</p>
            </div>
          </div>

          {recentOrders.length > 0 ? (
            <div className="admin-order-list">
              {recentOrders.map((order) => (
                <div className="admin-order-row" key={order.id}>
                  <div>
                    <h3>#{order.id}</h3>
                    <p>{order.customer?.name || "Customer"}</p>
                  </div>

                  <div>
                    <strong>{formatINR(order.total)}</strong>
                    <span>{order.status || "Placed"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-box">
              <span className="material-symbols-outlined">shopping_bag</span>
              <p>No orders available.</p>
            </div>
          )}
        </div>

        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Recent Prescriptions</h2>
              <p>Uploaded prescription files</p>
            </div>
          </div>

          {prescriptions.length > 0 ? (
            <div className="admin-prescription-list">
              {prescriptions.slice(0, 5).map((item, index) => (
                <div className="admin-prescription-row" key={item.id || index}>
                  <span className="material-symbols-outlined">description</span>

                  <div>
                    <h3>{item.name || "Prescription"}</h3>
                    <p>{item.date || "Recently uploaded"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-box">
              <span className="material-symbols-outlined">upload_file</span>
              <p>No prescriptions uploaded yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
