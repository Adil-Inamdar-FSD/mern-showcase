import React, { useEffect, useState } from "react";
import "./orderspage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/get-order`, {
        withCredentials: true,
      });
      console.log(result.data);
      setOrders(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetOrder();
  }, []);

  const formatINR = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  };

const getOrderTotal = (order) => {
  if (order.totalAmount) return Number(order.totalAmount);

  return (order.items || []).reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
    0,
  );
};

  const removeOrder = (id) => {
    const updatedOrders = orders.filter((order) => order._id !== id);
    setOrders(updatedOrders);
  };

  const downloadInvoice = (order) => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${order._id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              background: #f1f3f6;
              color: #172337;
            }
            .invoice-box {
              max-width: 850px;
              margin: auto;
              background: white;
              padding: 32px;
              border-radius: 16px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              border-bottom: 3px solid #0f766e;
              padding-bottom: 18px;
              margin-bottom: 24px;
            }
            h1 {
              margin: 0;
              color: #0f766e;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 12px;
              text-align: left;
            }
            th {
              background: #ecfeff;
              color: #0f766e;
            }
            .summary {
              width: 320px;
              margin-left: auto;
              margin-top: 22px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .total {
              border-top: 1px dashed #94a3b8;
              padding-top: 12px;
              font-size: 20px;
              font-weight: bold;
              color: #0f766e;
            }
            .badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 999px;
              background: #dcfce7;
              color: #15803d;
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <h1>HealthHub</h1>
                <p>Medical Store Invoice</p>
              </div>
              <div>
                <p><strong>Invoice ID:</strong> ${order._id}</p>
                <p><strong>Date:</strong> ${order.createdAt || order.date || "N/A"}</p>
                <p><strong>Status:</strong> <span class="badge">${order.status || "Placed"}</span></p>
              </div>
            </div>

            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${order.name || "Customer"}</p>
            <p><strong>Email:</strong> ${order.email || "N/A"}</p>
            <p><strong>Phone:</strong> ${order.phone || "N/A"}</p>
            <p><strong>Address:</strong> ${order.address || "N/A"}</p>
            <p><strong>Payment:</strong> ${String(order.paymentMethod.type).toUpperCase()}</p>

            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
            ${(order.items || [])
              .map((item) => {
                const qty = Number(item.qty || 1);
                const price = Number(item.price || 0);

                return `
      <tr>
        <td>${item.name || "Medicine"}</td>
        <td>${qty}</td>
        <td>${formatINR(price)}</td>
        <td>${formatINR(price * qty)}</td>
      </tr>
    `;
              })
              .join("")}
              </tbody>
            </table>

            <div class="summary">
              <div class="row">
                <span>Subtotal</span>
                <strong>${formatINR(order.subtotal)}</strong>
              </div>
              <div class="row">
                <span>Tax</span>
                <strong>${formatINR(order.tax)}</strong>
              </div>
              <div class="row total">
                <span>Total</span>
                <strong>${formatINR(getOrderTotal(order))}</strong>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for shopping with HealthHub.</p>
              <p>This is a computer generated invoice.</p>
            </div>
          </div>

          <script>
            window.print();
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <main className="orders-page">
      <div className="orders-page-header">
        <div>
          <h1>My Orders</h1>
          <p>Track orders and download medicine invoices</p>
        </div>

        <button
          className="orders-shop-btn"
          onClick={() => navigate("/userhome")}
        >
          <span className="material-symbols-outlined">storefront</span>
          Continue Shopping
        </button>
      </div>

      {orders.length > 0 ? (
        <section className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <div className="order-top">
                <div>
                  <p className="order-label">Order ID</p>
                  <h3>#{order._id}</h3>
                  <span>
                    {order.createdAt || order.date || "Recently placed"}
                  </span>
                </div>

                <span
                  className={`order-status ${String(order.status || "placed").toLowerCase()}`}
                >
                  {order.status || "Placed"}
                </span>
              </div>

              <div className="order-content">
                <div className="order-customer">
                  <h4>Delivery Details</h4>

                  <div className="order-info-grid">
                    <p>
                      <span>Name</span>
                      <strong>{order.name || "N/A"}</strong>
                    </p>
                    <p>
                      <span>Phone</span>
                      <strong>{order.phone || "N/A"}</strong>
                    </p>
                    <p>
                      <span>Email</span>
                      <strong>{order.email || "N/A"}</strong>
                    </p>
                    <p>
                      <span>City</span>
                      <strong>{order.city || "N/A"}</strong>
                    </p>
                    <p className="full">
                      <span>Address</span>
                      <strong>{order.address || "N/A"}</strong>
                    </p>
                    <p>
                      <span>Pincode</span>
                      <strong>{order.pincode || "N/A"}</strong>
                    </p>
                    <p>
                      <span>Payment</span>
                      <strong>
                        {String(order.paymentMethod.type).toUpperCase()}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Ordered Items</h4>

                  {(order.items || []).map((item, index) => (
                    <div
                      className="order-item-row"
                      key={item._id || item.id || index}
                    >
                      <div>
                        <strong>{item.name || "Medicine"}</strong>
                        <span>Qty: {item.quantity || 1}</span>
                      </div>

                      <b>{formatINR((item.price || 0) * (item.quantity || 1))}</b>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-bottom">
                <div className="order-summary">
                  <div className="order-summary-row">
                    <span>Subtotal</span>
                    <strong>{formatINR(order.subtotal)}</strong>
                  </div>

                  <div className="order-summary-row">
                    <span>Tax</span>
                    <strong>{formatINR(order.tax)}</strong>
                  </div>

                  <div className="order-summary-row total-row">
                    <span>Total</span>
                    <strong>{formatINR(getOrderTotal(order))}</strong>
                  </div>
                </div>

                <div className="order-actions">
                  <button
                    className="order-download-btn"
                    onClick={() => downloadInvoice(order)}
                  >
                    <span className="material-symbols-outlined">download</span>
                    Download Invoice
                  </button>

                  <button
                    className="order-delete-btn"
                    onClick={() => removeOrder(order._id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="orders-empty">
          <span className="material-symbols-outlined">inventory_2</span>
          <h3>No orders found</h3>
          <p>You have not placed any medicine order yet.</p>
          <button onClick={() => navigate("/userhome")}>Shop Now</button>
        </div>
      )}
    </main>
  );
}

export default OrdersPage;
