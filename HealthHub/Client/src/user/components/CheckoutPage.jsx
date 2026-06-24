import React, { useState } from "react";
import "./checkout.css";
import { useCart } from "../components/context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";

function CheckoutPage() {
  const [method, setMethod] = useState("upi");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    pincode: "",
    upiId: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const { cartItems, subtotal, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  const formatINR = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";

    if (method === "upi" && !formData.upiId.trim()) {
      newErrors.upiId = "UPI ID is required";
    }

    if (method === "card") {
      if (!formData.cardName.trim())
        newErrors.cardName = "Card holder name is required";
      if (!formData.cardNumber.trim())
        newErrors.cardNumber = "Card number is required";
      if (!formData.expiry.trim()) newErrors.expiry = "Expiry date is required";
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
    }

    if (cartItems.length === 0) {
      newErrors.general = "Your cart is empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {

      const orderPayload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        address: formData.address,
        pincode: formData.pincode,

        paymentMethod: {
          type: method,
          upiId: method === "upi" ? formData.upiId : undefined,
          cardName: method === "card" ? formData.cardName : undefined,
          cardNumber: method === "card" ? formData.cardNumber : undefined,
          expiry: method === "card" ? formData.expiry : undefined,
          cvv: method === "card" ? formData.cvv : undefined,
        },

        items: cartItems.map((item) => ({
          productId: item._id || item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.qty || 1),
        })),

        subtotal: Number(subtotal),
        tax: Number(tax),
        totalAmount: Number(total),
      };

      console.log("Order Payload:", orderPayload);
      const res = await axios.post(
        `${serverUrl}/api/create-order`,
        orderPayload,
        { withCredentials: true },
      );
      console.log("Order created:", res.data);

      clearCart();
      navigate("/orders");
    } catch (error) {
      console.log("Order error:", error.response?.data || error.message);
    }
  };

  return (
    <main className="checkout-page">
      <div className="checkout-page-header">
        <div>
          <h1>Secure Checkout</h1>
          <p>Complete your medicine order safely</p>
        </div>

        <button className="checkout-back-btn" onClick={() => navigate("/cart")}>
          <span className="material-symbols-outlined">shopping_cart</span>
          Back to Cart
        </button>
      </div>

      <section className="checkout-layout">
        <div className="checkout-left">
          <div className="checkout-card">
            <div className="checkout-card-title">
              <h2>Delivery Details</h2>
              <p>Enter your address and contact information</p>
            </div>

            {errors.general && (
              <div className="checkout-error-box">{errors.general}</div>
            )}

            <div className="checkout-form-grid">
              <div className="checkout-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "checkout-input-error" : ""}
                />
                {errors.name && <span>{errors.name}</span>}
              </div>

              <div className="checkout-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "checkout-input-error" : ""}
                />
                {errors.phone && <span>{errors.phone}</span>}
              </div>

              <div className="checkout-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "checkout-input-error" : ""}
                />
                {errors.email && <span>{errors.email}</span>}
              </div>

              <div className="checkout-field">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? "checkout-input-error" : ""}
                />
                {errors.city && <span>{errors.city}</span>}
              </div>

              <div className="checkout-field checkout-full">
                <label>Street Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "checkout-input-error" : ""}
                />
                {errors.address && <span>{errors.address}</span>}
              </div>

              <div className="checkout-field">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={errors.pincode ? "checkout-input-error" : ""}
                />
                {errors.pincode && <span>{errors.pincode}</span>}
              </div>
            </div>

            <div className="checkout-card-title payment-title">
              <h2>Payment Method</h2>
              <p>Select your preferred payment option</p>
            </div>

            <div className="payment-methods">
              <label className={method === "upi" ? "active-method" : ""}>
                <input
                  type="radio"
                  name="payment"
                  checked={method === "upi"}
                  onChange={() => {
                    setMethod("upi");
                    setErrors({});
                  }}
                />
                <span className="material-symbols-outlined">
                  account_balance_wallet
                </span>
                UPI
              </label>

              <label className={method === "card" ? "active-method" : ""}>
                <input
                  type="radio"
                  name="payment"
                  checked={method === "card"}
                  onChange={() => {
                    setMethod("card");
                    setErrors({});
                  }}
                />
                <span className="material-symbols-outlined">credit_card</span>
                Card
              </label>
            </div>

            {method === "upi" ? (
              <div className="payment-box">
                <div className="checkout-field">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    name="upiId"
                    placeholder="example@upi"
                    value={formData.upiId}
                    onChange={handleChange}
                    className={errors.upiId ? "checkout-input-error" : ""}
                  />
                  {errors.upiId && <span>{errors.upiId}</span>}
                </div>
              </div>
            ) : (
              <div className="payment-box checkout-form-grid">
                <div className="checkout-field checkout-full">
                  <label>Card Holder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Name on card"
                    value={formData.cardName}
                    onChange={handleChange}
                    className={errors.cardName ? "checkout-input-error" : ""}
                  />
                  {errors.cardName && <span>{errors.cardName}</span>}
                </div>

                <div className="checkout-field checkout-full">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className={errors.cardNumber ? "checkout-input-error" : ""}
                  />
                  {errors.cardNumber && <span>{errors.cardNumber}</span>}
                </div>

                <div className="checkout-field">
                  <label>Expiry</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                    className={errors.expiry ? "checkout-input-error" : ""}
                  />
                  {errors.expiry && <span>{errors.expiry}</span>}
                </div>

                <div className="checkout-field">
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    placeholder="***"
                    value={formData.cvv}
                    onChange={handleChange}
                    className={errors.cvv ? "checkout-input-error" : ""}
                  />
                  {errors.cvv && <span>{errors.cvv}</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="checkout-right">
          <div className="summary-card">
            <h3>Order Summary</h3>

            {cartItems.length > 0 ? (
              <>
                <div className="summary-items">
                  {cartItems.map((item, index) => (
                    <div
                      className="summary-item"
                      key={item._id || item.id || index}
                    >
                      <div>
                        <strong>{item.name || "Medicine"}</strong>
                        <span>Qty: {item.qty || 1}</span>
                      </div>

                      <b>
                        {formatINR(
                          (Number(item.price) || 0) * (Number(item.qty) || 1),
                        )}
                      </b>
                    </div>
                  ))}
                </div>

                <div className="summary-line"></div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{formatINR(subtotal)}</strong>
                </div>

                <div className="summary-row">
                  <span>Tax</span>
                  <strong>{formatINR(tax)}</strong>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <strong className="free-text">Free</strong>
                </div>

                <div className="summary-line"></div>

                <div className="summary-total">
                  <span>Total</span>
                  <strong>{formatINR(total)}</strong>
                </div>

                <button
                  className="checkout-btn"
                  onClick={handlePlaceOrder}
                  disabled={cartItems.length === 0}
                >
                  Place Order
                </button>
              </>
            ) : (
              <div className="checkout-empty">
                <span className="material-symbols-outlined">shopping_cart</span>
                <p>Your cart is empty.</p>
                <button onClick={() => navigate("/userhome")}>Shop Now</button>
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default CheckoutPage;
