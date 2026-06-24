import { useEffect, useState } from "react";
import "./invoice.css";

function InvoicePage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(Array.isArray(savedOrders) ? [...savedOrders].reverse() : []);
  }, []);

  const formatINR = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  };

  const cancelOrder = (id) => {
    const updatedOrders = orders.map((item) =>
      item.id === id ? { ...item, status: "Cancelled" } : item
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify([...updatedOrders].reverse())
    );
  };

  const clearCancelledOrders = () => {
    const filteredOrders = orders.filter(
      (item) => item.status !== "Cancelled"
    );

    setOrders(filteredOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify([...filteredOrders].reverse())
    );
  };

  const getOrderTotal = (order) => {
    if (order.total || order.amount) {
      return Number(order.total || order.amount);
    }

    if (Array.isArray(order.items)) {
      return order.items.reduce((sum, item) => {
        if (typeof item === "string") return sum;

        return (
          sum + Number(item.price || 0) * Number(item.qty || 1)
        );
      }, 0);
    }

    return 0;
  };

  const handlePrintInvoice = (order) => {
    const customer = order.customer || {};

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${order.id}</title>

          <style>
            body{
              font-family:Arial,sans-serif;
              padding:30px;
              background:#f1f5f9;
              color:#172337;
            }

            .invoice-box{
              max-width:850px;
              margin:auto;
              background:white;
              border-radius:18px;
              padding:32px;
            }

            .header{
              display:flex;
              justify-content:space-between;
              border-bottom:3px solid #0f766e;
              padding-bottom:18px;
              margin-bottom:24px;
            }

            h1{
              margin:0;
              color:#0f766e;
            }

            .badge{
              display:inline-block;
              padding:6px 12px;
              border-radius:999px;
              background:#dcfce7;
              color:#15803d;
              font-weight:bold;
            }

            .cancelled{
              background:#fee2e2;
              color:#dc2626;
            }

            table{
              width:100%;
              border-collapse:collapse;
              margin-top:20px;
            }

            th,td{
              border:1px solid #e5e7eb;
              padding:12px;
              text-align:left;
            }

            th{
              background:#ecfeff;
              color:#0f766e;
            }

            .summary{
              margin-top:24px;
              margin-left:auto;
              width:320px;
            }

            .row{
              display:flex;
              justify-content:space-between;
              margin-bottom:10px;
            }

            .total{
              padding-top:12px;
              border-top:1px dashed #94a3b8;
              font-size:20px;
              font-weight:bold;
              color:#0f766e;
            }

            .footer{
              margin-top:30px;
              text-align:center;
              color:#64748b;
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
                <p><strong>Invoice ID:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${
                  order.createdAt || order.date || "N/A"
                }</p>

                <p>
                  <strong>Status:</strong>

                  <span class="${
                    order.status === "Cancelled"
                      ? "badge cancelled"
                      : "badge"
                  }">
                    ${order.status || "Placed"}
                  </span>
                </p>
              </div>
            </div>

            <h3>Customer Details</h3>

            <p><strong>Name:</strong> ${
              customer.name || "Customer"
            }</p>

            <p><strong>Email:</strong> ${
              customer.email || "N/A"
            }</p>

            <p><strong>Phone:</strong> ${
              customer.phone || "N/A"
            }</p>

            <p><strong>Address:</strong> ${
              customer.address || "N/A"
            }</p>

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
                ${
                  order.items && Array.isArray(order.items)
                    ? order.items
                        .map((item) => {
                          const name =
                            typeof item === "string"
                              ? item
                              : item.name;

                          const qty =
                            typeof item === "string"
                              ? 1
                              : item.qty || 1;

                          const price =
                            typeof item === "string"
                              ? 0
                              : Number(item.price || 0);

                          return `
                            <tr>
                              <td>${name}</td>
                              <td>${qty}</td>
                              <td>${formatINR(price)}</td>
                              <td>${formatINR(price * qty)}</td>
                            </tr>
                          `;
                        })
                        .join("")
                    : ""
                }
              </tbody>
            </table>

            <div class="summary">
              <div class="row">
                <span>Subtotal</span>
                <strong>${formatINR(
                  Number(order.subtotal || getOrderTotal(order))
                )}</strong>
              </div>

              <div class="row">
                <span>Tax</span>
                <strong>${formatINR(Number(order.tax || 0))}</strong>
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
    <main className="invoice-page">
      <div className="invoice-header">
        <div>
          <h1>Download Invoices</h1>
          <p>Your HealthHub order invoices and bills</p>
        </div>

        <button
          className="clear-orders-btn"
          onClick={clearCancelledOrders}
        >
          Clear Cancelled
        </button>
      </div>

      <div className="invoice-grid">
        {orders.length > 0 ? (
          orders.map((item, index) => (
            <div className="invoice-card" key={item.id || index}>
              <div className="invoice-card-top">
                <div>
                  <h3>{item.id}</h3>

                  <p>
                    {item.createdAt ||
                      item.date ||
                      "Recently placed"}
                  </p>
                </div>

                <span
                  className={
                    item.status === "Cancelled"
                      ? "invoice-status cancelled"
                      : "invoice-status"
                  }
                >
                  {item.status || "Placed"}
                </span>
              </div>

              <div className="invoice-details">
                <p>
                  <strong>Customer</strong>

                  <span>
                    {item.customer?.name || "Customer"}
                  </span>
                </p>

                <p>
                  <strong>Payment</strong>

                  <span>
                    {String(
                      item.paymentMethod || "COD"
                    ).toUpperCase()}
                  </span>
                </p>

                <p>
                  <strong>Items</strong>

                  <span>
                    {Array.isArray(item.items)
                      ? item.items.length
                      : 0}
                  </span>
                </p>

                <p>
                  <strong>Total</strong>

                  <span>
                    {formatINR(getOrderTotal(item))}
                  </span>
                </p>
              </div>

              <div className="invoice-btns">
                <button
                  onClick={() => handlePrintInvoice(item)}
                  className="download-btn"
                >
                  Download Invoice
                </button>

                {item.status !== "Cancelled" && (
                  <button
                    onClick={() => cancelOrder(item.id)}
                    className="cancel-order-btn"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-invoice">
            <span className="material-symbols-outlined">
              receipt_long
            </span>

            <h2>No invoices available</h2>

            <p>
              Your medicine order invoices will appear here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default InvoicePage;