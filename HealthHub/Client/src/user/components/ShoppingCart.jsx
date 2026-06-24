import React, { useEffect, useMemo, useState } from "react";
import "./shoppingcart.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/context/CartContext";

function ShoppingCart() {
  const navigate = useNavigate();

  const {
    cartItems = [],
    cartCount = 0,
    subtotal = 0,
    tax = 0,
    total = 0,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  const [fallbackCart, setFallbackCart] = useState([]);

  useEffect(() => {
    const syncCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setFallbackCart(Array.isArray(savedCart) ? savedCart : []);
    };

    syncCart();
    window.addEventListener("cartUpdated", syncCart);

    return () => window.removeEventListener("cartUpdated", syncCart);
  }, []);

  const finalCartItems = useMemo(() => {
    return cartItems.length > 0 ? cartItems : fallbackCart;
  }, [cartItems, fallbackCart]);

  const finalCartCount = useMemo(() => {
    if (cartItems.length > 0) return cartCount;
    return finalCartItems.reduce((sum, item) => sum + Number(item.qty || 1), 0);
  }, [cartItems.length, cartCount, finalCartItems]);

  const finalSubtotal = useMemo(() => {
    if (cartItems.length > 0) return subtotal;

    return finalCartItems.reduce(
      (sum, item) =>
        sum +
        Number(item.price || item.mrp || item.cost || 0) *
          Number(item.qty || 1),
      0
    );
  }, [cartItems.length, subtotal, finalCartItems]);

  const finalTax = useMemo(() => {
    return cartItems.length > 0 ? tax : finalSubtotal * 0.05;
  }, [cartItems.length, tax, finalSubtotal]);

  const finalTotal = useMemo(() => {
    return cartItems.length > 0 ? total : finalSubtotal + finalTax;
  }, [cartItems.length, total, finalSubtotal, finalTax]);

  const formatINR = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  };

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/300x300?text=No+Image";

    if (url.startsWith("http") || url.startsWith("data:image")) {
      return url;
    }

    return `https://batch-6-backend-production.up.railway.app${url}`;
  };

  const updateLocalCart = (updated) => {
    localStorage.setItem("cart", JSON.stringify(updated));
    setFallbackCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleDecrease = (itemId, qty) => {
    if (qty <= 1) {
      removeFromCart(itemId);

      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updated = savedCart.filter(
        (item, index) => String(item._id || item.id || index) !== String(itemId)
      );

      updateLocalCart(updated);
      return;
    }

    decreaseQty(itemId);

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updated = savedCart.map((item, index) => {
      const currentId = item._id || item.id || index;

      if (String(currentId) === String(itemId)) {
        return { ...item, qty: Number(item.qty || 1) - 1 };
      }

      return item;
    });

    updateLocalCart(updated);
  };

  const handleIncrease = (itemId) => {
    increaseQty(itemId);

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updated = savedCart.map((item, index) => {
      const currentId = item._id || item.id || index;

      if (String(currentId) === String(itemId)) {
        return { ...item, qty: Number(item.qty || 1) + 1 };
      }

      return item;
    });

    updateLocalCart(updated);
  };

  const handleRemove = (itemId) => {
    removeFromCart(itemId);

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updated = savedCart.filter(
      (item, index) => String(item._id || item.id || index) !== String(itemId)
    );

    updateLocalCart(updated);
  };

  return (
    <main className="cart-page">
      <div className="cart-page-header">
        <div>
          <h1>My Cart</h1>
          <p>Review your medicines before checkout</p>
        </div>

        <button className="cart-continue-btn" onClick={() => navigate("/userhome")}>
          <span className="material-symbols-outlined">storefront</span>
          Continue Shopping
        </button>
      </div>

      <section className="cart-layout">
        <div className="cart-left">
          <div className="cart-card-header">
            <div>
              <h2>Shopping Cart</h2>
              <p>{finalCartCount} items added</p>
            </div>

            <button className="cart-wishlist-btn" onClick={() => navigate("/favirote")}>
              <span className="material-symbols-outlined">favorite</span>
              Wishlist
            </button>
          </div>

          <div className="cart-items-list">
            {finalCartItems.length > 0 ? (
              finalCartItems.map((item, index) => {
                const itemId = item._id || item.id || index;
                const price = Number(item.price || item.mrp || item.cost || 0);
                const qty = Number(item.qty || 1);

                return (
                  <div className="cart-item" key={itemId}>
                    <div className="cart-img-wrap">
                      <img
                        src={getImageUrl(item.imageUrl || item.image || item.img)}
                        alt={item.name || "Medicine"}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x300?text=No+Image";
                        }}
                      />
                    </div>

                    <div className="cart-details">
                      <p className="cart-category">
                        {item.category || "Medicine"}
                      </p>

                      <h3>{item.name || item.title || item.productName || "Medicine"}</h3>

                      <p className="cart-stock">In stock • Free delivery available</p>

                      <div className="cart-mobile-price">{formatINR(price)}</div>

                      <div className="cart-actions-row">
                        <div className="cart-qty">
                          <button onClick={() => handleDecrease(itemId, qty)}>
                            -
                          </button>
                          <span>{qty}</span>
                          <button onClick={() => handleIncrease(itemId)}>
                            +
                          </button>
                        </div>

                        <button
                          className="cart-remove-btn"
                          onClick={() => handleRemove(itemId)}
                        >
                          <span className="material-symbols-outlined">delete</span>
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart-price-box">
                      <strong>{formatINR(price)}</strong>
                      <span>Total: {formatINR(price * qty)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="cart-empty">
                <span className="material-symbols-outlined">shopping_cart</span>
                <h2>Your cart is empty</h2>
                <p>Add medicines to your cart and they will appear here.</p>
                <button onClick={() => navigate("/userhome")}>Shop Now</button>
              </div>
            )}
          </div>
        </div>

        <aside className="cart-summary">
          <h2>Price Details</h2>

          <div className="cart-row">
            <span>Price ({finalCartCount} items)</span>
            <strong>{formatINR(finalSubtotal)}</strong>
          </div>

          <div className="cart-row">
            <span>Shipping</span>
            <strong className="cart-green">Free</strong>
          </div>

          <div className="cart-row">
            <span>Tax</span>
            <strong>{formatINR(finalTax)}</strong>
          </div>

          <div className="cart-divider"></div>

          <div className="cart-total">
            <span>Total Amount</span>
            <strong>{formatINR(finalTotal)}</strong>
          </div>

          <p className="cart-save-text">
            You are saving delivery charges on this order.
          </p>

          <button
            className="cart-checkout"
            onClick={() => navigate("/checkout")}
            disabled={finalCartItems.length === 0}
          >
            Proceed to Checkout
          </button>

          <button className="cart-secondary-btn" onClick={() => navigate("/userhome")}>
            Add More Medicines
          </button>
        </aside>
      </section>
    </main>
  );
}

export default ShoppingCart;