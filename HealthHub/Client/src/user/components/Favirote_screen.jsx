import React, { useEffect, useMemo, useState } from "react";
import "../components/favirotescreen.css";
import { useNavigate } from "react-router-dom";

function Favirotescreen() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saveditems = JSON.parse(localStorage.getItem("favirote")) || [];
    setItems(Array.isArray(saveditems) ? saveditems : []);
  }, []);

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/300x300?text=No+Image";

    if (url.startsWith("http") || url.startsWith("data:image")) {
      return url;
    }

    return `https://batch-6-backend-production.up.railway.app${url}`;
  };

  const formatINR = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  };

  const removeItem = (id) => {
    const updateditems = items.filter(
      (item, index) => String(item._id || item.id || index) !== String(id)
    );

    setItems(updateditems);
    localStorage.setItem("favirote", JSON.stringify(updateditems));
    window.dispatchEvent(new Event("faviroteUpdated"));
  };

  const addToCart = (item) => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemId = item._id || item.id || item.name;

    const existing = savedCart.find(
      (cartItem, index) =>
        String(cartItem._id || cartItem.id || index) === String(itemId)
    );

    let updatedCart;

    if (existing) {
      updatedCart = savedCart.map((cartItem, index) => {
        const cartId = cartItem._id || cartItem.id || index;

        if (String(cartId) === String(itemId)) {
          return {
            ...cartItem,
            qty: Number(cartItem.qty || 1) + 1,
          };
        }

        return cartItem;
      });
    } else {
      updatedCart = [
        ...savedCart,
        {
          ...item,
          qty: 1,
          imageUrl: getImageUrl(item.imageUrl || item.image),
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const filteredItems = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return items;

    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(search) ||
        item.brand?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search)
    );
  }, [items, searchTerm]);

  return (
    <main className="fav-page">
      <div className="fav-page-header">
        <div>
          <h1>My Wishlist</h1>
          <p>View and manage your saved medicines</p>
        </div>

        <button className="fav-continue-btn" onClick={() => navigate("/userhome")}>
          <span className="material-symbols-outlined">storefront</span>
          Continue Shopping
        </button>
      </div>

      <div className="fav-toolbar">
        <div className="fav-search-wrap">
          <span className="material-symbols-outlined fav-search-icon">
            search
          </span>

          <input
            className="fav-search"
            type="search"
            placeholder="Search wishlist medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fav-count-pill">
          <span className="material-symbols-outlined">favorite</span>
          {filteredItems.length} saved items
        </div>
      </div>

      <section className="fav-container">
        {filteredItems.length > 0 ? (
          <div className="fav-grid">
            {filteredItems.map((item, index) => {
              const itemId = item._id || item.id || index;

              return (
                <div className="fav-card" key={itemId}>
                  <div className="fav-card-img">
                    <img
                      src={getImageUrl(item.imageUrl || item.image)}
                      alt={item.name || "Medicine"}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x300?text=No+Image";
                      }}
                    />

                    <button
                      className="fav-fav-btn"
                      onClick={() => removeItem(itemId)}
                      title="Remove from wishlist"
                    >
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                  </div>

                  <div className="fav-card-body">
                    <p className="fav-category">
                      {item.brand || item.category || "Medicine"}
                    </p>

                    <h3>{item.name || "Medicine"}</h3>

                    <div className="fav-price-row">
                      <strong>{formatINR(item.price)}</strong>
                      <span>Free delivery</span>
                    </div>

                    <div className="fav-card-actions">
                      <button
                        className="fav-add-cart"
                        onClick={() => addToCart(item)}
                      >
                        <span className="material-symbols-outlined">
                          add_shopping_cart
                        </span>
                        Add to Cart
                      </button>

                      <button
                        className="fav-remove"
                        onClick={() => removeItem(itemId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="fav-empty">
            <span className="material-symbols-outlined">favorite</span>
            <h3>No favorites found</h3>
            <p>Add medicines to wishlist from the store page.</p>
            <button onClick={() => navigate("/userhome")}>Shop Medicines</button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Favirotescreen;