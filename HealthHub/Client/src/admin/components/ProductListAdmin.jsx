import React, { useEffect, useMemo, useState } from "react";
import "./productlistadimin.css";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getProducts } from "../../api/product";
import axios from "axios";
import { serverUrl } from "../../App";

const FALLBACK_IMAGE = "https://via.placeholder.com/300x220?text=No+Image";

function ProductListAdmin() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  // LOAD PRODUCTS
  const loadProducts = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/product`)
      console.log(res.data.data)

      // ✅ FIX: backend returns { success, data }
      const data = res.data?.data || [];

      setProducts(data);
    } catch (err) {
      console.log("GET PRODUCTS ERROR:", err.message);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.log("DELETE ERROR:", err.message);
    }
  };

  // UNIQUE CATEGORIES
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category || "Uncategorized");
    return ["All", ...new Set(cats)];
  }, [products]);

  // FILTERED PRODUCTS
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchSearch =
        (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.brand || "").toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, search]);

  // STOCK STATUS
  const getStockStatus = (stock) => {
    if (stock <= 5) {
      return {
        label: "Low Stock",
        className: "low",
        width: "30%",
      };
    } else if (stock <= 20) {
      return {
        label: "Medium Stock",
        className: "medium",
        width: "60%",
      };
    } else {
      return {
        label: "In Stock",
        className: "high",
        width: "100%",
      };
    }
  };

  // IMAGE HANDLER
  const getImageUrl = (item) => {
    return item.imageUrl || FALLBACK_IMAGE;
  };

  return (
    <div className="pla-container">
      <div className="pla-header">
        <div className="pla-header-left">
          <div className="pla-icon">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>

          <div className="pla-header-text">
            <h1>Medicine List</h1>
            <p>Manage all medicines from your admin panel</p>
          </div>
        </div>

        <div className="pla-header-center">
          <div className="pla-search-box">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search medicine, brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="pla-header-right">
          <button
            className="pla-action-btn pla-primary-btn"
            onClick={() => navigate("/addproduct")}
          >
            <span className="material-symbols-outlined">add</span>
            Add Medicine
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="pla-filters">
        <div className="pla-filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="pla-product-list">
        <div className="pla-card-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => {
              const stockInfo = getStockStatus(item.stock || 0);

              return (
                <div className="pla-card" key={item._id}>
                  <div className="pla-card-img">
                    <img
                      src={getImageUrl(item)}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

                  <div className="pla-card-body">
                    <h3>{item.name}</h3>
                    <p>{item.category}</p>
                    <p>Brand: {item.brand}</p>
                    <p>₹{item.price}</p>

                    <div className="pla-card-stock">
                      <div>
                        <span>Stock: {item.stock}</span>
                      </div>

                      <div className="pla-product-stock-bar">
                        <div
                          className={`pla-product-stock-fill ${stockInfo.className}`}
                          style={{ width: stockInfo.width }}
                        ></div>
                      </div>

                      <span
                        className={`pla-stock-badge ${stockInfo.className}`}
                      >
                        {stockInfo.label}
                      </span>
                    </div>

                    <p className="pla-card-desc">{item.description}</p>
                  </div>

                  <div className="pla-card-actions">
                    <button
                      onClick={() => navigate(`/updateproduct/${item._id}`)}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>

                    <button onClick={() => handleDelete(item._id)}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="pla-empty-state">
              <span className="material-symbols-outlined">inventory_2</span>
              <h3>No Medicines Found</h3>
              <p>Add medicines from admin panel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductListAdmin;
