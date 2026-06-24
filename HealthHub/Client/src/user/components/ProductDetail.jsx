import React, { useEffect, useState } from "react";
import "./productdetail.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../components/context/CartContext";

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [favorites, setFavorites] = useState([]);

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/500x500?text=No+Image";

    return url.startsWith("http") || url.startsWith("data:image")
      ? url
      : `https://batch-6-backend-production.up.railway.app${url}`;
  };

  const formatINR = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  };

  useEffect(() => {
    const medicines = JSON.parse(localStorage.getItem("medicines")) || [];
    const foundProduct = medicines.find(
      (item) => String(item._id || item.id) === String(id)
    );

    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(getImageUrl(foundProduct.imageUrl || foundProduct.image));
    }

    const savedFavorites = JSON.parse(localStorage.getItem("favirote")) || [];
    setFavorites(Array.isArray(savedFavorites) ? savedFavorites : []);
  }, [id]);

  const isFavorite = (productId) => {
    return favorites.some(
      (item) => String(item._id || item.id) === String(productId)
    );
  };

  const toggleFavorite = (item) => {
    const itemId = item._id || item.id;
    let updatedFavorites;

    if (isFavorite(itemId)) {
      updatedFavorites = favorites.filter(
        (fav) => String(fav._id || fav.id) !== String(itemId)
      );
    } else {
      updatedFavorites = [
        ...favorites,
        {
          ...item,
          imageUrl: getImageUrl(item.imageUrl || item.image),
        },
      ];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favirote", JSON.stringify(updatedFavorites));
  };

  if (!product) {
    return (
      <main className="pd-page">
        <div className="pd-not-found">
          <span className="material-symbols-outlined">inventory_2</span>
          <h2>Product not found</h2>
          <p>This medicine is not available or removed from admin panel.</p>
          <button onClick={() => navigate("/userhome")}>Back to Store</button>
        </div>
      </main>
    );
  }

  const productId = product._id || product.id;
  const price = Number(product.price || 0);
  const oldPrice = price + Math.round(price * 0.15);

  return (
    <main className="pd-page">
      <div className="pd-page-header">
        <div>
          <h1>Product Details</h1>
          <p>View medicine details, price and add to cart</p>
        </div>

        <button className="pd-back-btn" onClick={() => navigate("/userhome")}>
          <span className="material-symbols-outlined">storefront</span>
          Back to Store
        </button>
      </div>

      <section className="pd-layout">
        <div className="pd-gallery-card">
          <div className="pd-image-box">
            <img
              src={selectedImage}
              alt={product.name || "Medicine"}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x500?text=No+Image";
              }}
            />

            <button
              className={`pd-fav-btn ${isFavorite(productId) ? "active" : ""}`}
              onClick={() => toggleFavorite(product)}
            >
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>

          <div className="pd-thumb-row">
            <button
              className={`pd-thumb ${
                selectedImage === getImageUrl(product.imageUrl || product.image)
                  ? "pd-thumb-active"
                  : ""
              }`}
              onClick={() =>
                setSelectedImage(getImageUrl(product.imageUrl || product.image))
              }
            >
              <img
                src={getImageUrl(product.imageUrl || product.image)}
                alt={product.name || "Medicine"}
              />
            </button>
          </div>
        </div>

        <div className="pd-content-card">
          <div className="pd-main-info">
            <p className="pd-brand">{product.brand || "HealthHub Medicine"}</p>
            <h2>{product.name || "Medicine"}</h2>

            <div className="pd-rating-row">
              <span className="pd-rating">4.8 ★</span>
              <span>95 reviews</span>
              <span>Free delivery</span>
            </div>
          </div>

          <div className="pd-price-box">
            <h3>{formatINR(price)}</h3>
            <span>{formatINR(oldPrice)}</span>
            <p>Inclusive of all taxes</p>
          </div>

          <div className="pd-action-row">
            <button className="pd-cart-btn" onClick={() => addToCart(product)}>
              <span className="material-symbols-outlined">shopping_cart</span>
              Add to Cart
            </button>

            <button
              className="pd-buy-btn"
              onClick={() => {
                addToCart(product);
                navigate("/cart");
              }}
            >
              Buy Now
            </button>
          </div>

          <div className="pd-info-grid">
            <div className="pd-info-box">
              <span className="material-symbols-outlined">category</span>
              <div>
                <p>Category</p>
                <strong>{product.category || "Medicine"}</strong>
              </div>
            </div>

            <div className="pd-info-box">
              <span className="material-symbols-outlined">local_shipping</span>
              <div>
                <p>Delivery</p>
                <strong>Free delivery</strong>
              </div>
            </div>

            <div className="pd-info-box">
              <span className="material-symbols-outlined">verified</span>
              <div>
                <p>Quality</p>
                <strong>Verified product</strong>
              </div>
            </div>

            <div className="pd-info-box">
              <span className="material-symbols-outlined">payments</span>
              <div>
                <p>Payment</p>
                <strong>UPI / Card / COD</strong>
              </div>
            </div>
          </div>

          <div className="pd-section">
            <h3>Description</h3>
            <p>
              {product.description ||
                `${product.name} is a reliable healthcare product in the ${
                  product.category || "medicine"
                } category. Carefully selected to support your daily wellness and medical needs.`}
            </p>
          </div>

          <div className="pd-section warning">
            <h3>Medicine Safety</h3>
            <p>
              Check dosage, expiry date and consult a doctor before using any
              medicine if you are unsure.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;