import React, { useEffect, useMemo, useState } from "react";
import "./UserHome.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/context/CartContext";
import { serverUrl } from "../../App";
import axios from "axios";

function UserHomeScreen() {
  const navigate = useNavigate();

  const [product, setProduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(10000);

  const { addToCart } = useCart();

  const [favirote, setfavirote] = useState(() => {
    return JSON.parse(localStorage.getItem("favirote")) || [];
  });

  // ✅ FIX 1: correct data loading effect
  const handleProduct = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/product`, {
        withCredentials: true,
      });

      setProduct(result.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleProduct();
  }, []); // ❌ FIXED (was [setProduct])

  useEffect(() => {
    localStorage.setItem("favirote", JSON.stringify(favirote));
  }, [favirote]);

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/300x300?text=No+Image";

    return url.startsWith("http") || url.startsWith("data:image")
      ? url
      : `${serverUrl}${url}`;
  };

  const formatINR = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  };

  const categories = useMemo(() => {
    const allCategories = product.map((item) => item.category).filter(Boolean);
    return ["all", ...new Set(allCategories)];
  }, [product]);

  const highestPrice = useMemo(() => {
    if (product.length === 0) return 10000;
    return Math.max(...product.map((item) => Number(item.price) || 0), 1000);
  }, [product]);

  useEffect(() => {
    setMaxPrice(highestPrice);
  }, [highestPrice]);

  const togglefavirote = (item) => {
    const existingItem = favirote.find((fav) => fav._id === item._id);

    if (existingItem) {
      setfavirote(favirote.filter((fav) => fav._id !== item._id));
    } else {
      const faviroteitems = {
        ...item,
        imageUrl: getImageUrl(item.imageUrl),
      };

      setfavirote([...favirote, faviroteitems]);
    }
  };

  const isfavirote = (id) => {
    return favirote.some((fav) => fav._id === id);
  };

  // ✅ FIX 2 + 3: proper filtering + numeric price fix
  const filteredProducts = useMemo(() => {
    return product.filter((item) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        item.name?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const matchesPrice = Number(item.price || 0) <= Number(maxPrice || 0);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [product, searchTerm, selectedCategory, maxPrice]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setMaxPrice(highestPrice);
  };

  return (
    <div className="uhs-container">
      <main className="uhs-main">
        <div className="uhs-home-header">
          <div>
            <h2>Medicines Store</h2>
            <p>Search medicines, compare prices and add items to cart</p>
          </div>

          <div className="uhs-home-search">
            <span className="material-symbols-outlined uhs-home-search-icon">
              search
            </span>

            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <section className="uhs-product-section">
          <div className="uhs-section-header">
            <div>
              <h3>Available Medicines</h3>
              <p>{filteredProducts.length} medicines found</p>
            </div>

            <button className="uhs-view-all-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>

          <div className="uhs-filter-bar">
            <div className="uhs-filter-group">
              <label>Category</label>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="uhs-filter-group">
              <label>Price Range: {formatINR(maxPrice)}</label>

              <input
                type="range"
                min="0"
                max={highestPrice}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="uhs-product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <div className="uhs-product-card" key={item._id}>
                  <div className="uhs-product-image">
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x300?text=No+Image";
                      }}
                    />

                    <button
                      className={`uhs-favorite-btn ${
                        isfavirote(item._id) ? "active" : ""
                      }`}
                      onClick={() => togglefavirote(item)}
                    >
                      <span className="material-symbols-outlined">
                        favorite
                      </span>
                    </button>
                  </div>

                  <div className="uhs-product-info">
                    <p className="uhs-category">{item.category}</p>
                    <h4 className="uhs-title">{item.name}</h4>

                    <div className="uhs-product-bottom">
                      <div className="uhs-price-row">
                        <span className="uhs-price">
                          {formatINR(item.price)}
                        </span>

                        <button
                          className="uhs-cart-btn-small"
                          onClick={() => addToCart(item)}
                        >
                          <span className="material-symbols-outlined">
                            add_shopping_cart
                          </span>
                        </button>
                      </div>

                      <button
                        className="uhs-link-btn"
                        onClick={() => navigate(`/productdetail/${item._id}`)}
                      >
                        See more
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="uhs-no-products">
                No medicines found. Try changing filters or add medicines from
                admin panel.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserHomeScreen;
