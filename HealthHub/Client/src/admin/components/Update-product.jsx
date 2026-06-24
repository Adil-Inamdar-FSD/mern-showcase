import React, { useEffect, useState } from "react";
import "./updateproduct.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";

const BASE_URL = "http://localhost:5000/api/product";

function Updateproduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});

  const [product, setProduct] = useState({
    _id: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    brand: "",
    imageUrl: "",
  });

  // ✅ FETCH PRODUCT FROM BACKEND
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/${id}`);

        const data = res.data?.data;

        if (!data) {
          navigate("/productlist");
          return;
        }

        setProduct(data);
        setPreviewImage(data.imageUrl || "");
      } catch (err) {
        console.log("FETCH PRODUCT ERROR:", err.message);
        navigate("/productlist");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleInputChange = (field, value) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!product.name?.trim()) newErrors.name = "Medicine name is required";
    if (!product.price?.toString().trim())
      newErrors.price = "Price is required";
    if (!product.stock?.toString().trim())
      newErrors.stock = "Stock is required";
    if (!product.category?.trim()) newErrors.category = "Category is required";
    if (!product.brand?.trim()) newErrors.brand = "Brand is required";
    if (!product.description?.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ✅ UPDATE PRODUCT VIA API
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`${BASE_URL}/${id}`, {
        ...product,
        imageUrl: previewImage || product.imageUrl,
        price: Number(product.price),
        stock: Number(product.stock),
      });

      navigate("/productlist");
    } catch (err) {
      console.log("UPDATE ERROR:", err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setProduct((prev) => ({
        ...prev,
        imageUrl: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ✅ DELETE PRODUCT VIA API
  const deleteItem = async () => {
    try {
      await axios.delete(`${serverUrl}/api/product/${id}`);
      navigate("/productlist");
    } catch (err) {
      console.log("DELETE ERROR:", err.message);
    }
  };

  const handleClear = () => {
    setProduct({
      _id: "",
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      brand: "",
      imageUrl: "",
    });

    setPreviewImage("");
    setErrors({});
  };

  return (
    <main className="up-page">
      <section className="up-header">
        <div className="up-header-left">
          <div className="up-header-icon">
            <span className="material-symbols-outlined">edit_square</span>
          </div>

          <div>
            <h1>Update Medicine</h1>
            <p>Edit medicine details, stock, price and product image</p>
          </div>
        </div>

        <div className="up-header-actions">
          <button
            className="up-nav-btn"
            onClick={() => navigate("/productlist")}
          >
            <span className="material-symbols-outlined">inventory_2</span>
            Medicine List
          </button>

          <button
            className="up-nav-btn primary"
            onClick={() => navigate("/addproduct")}
          >
            <span className="material-symbols-outlined">add</span>
            Add Medicine
          </button>
        </div>
      </section>

      <section className="up-layout">
        <aside className="up-media-card">
          <div className="up-card-title">
            <h2>Medicine Image</h2>
            <p>Preview and update medicine image</p>
          </div>

          <div className="up-image-box">
            {previewImage ? (
              <img src={previewImage} alt="Preview" />
            ) : (
              <div className="up-no-image">
                <span className="material-symbols-outlined">image</span>
                <p>No image selected</p>
              </div>
            )}
          </div>

          <label className="up-upload-btn">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <span className="material-symbols-outlined">photo_camera</span>
            Change Image
          </label>
        </aside>

        <section className="up-form-card">
          <div className="up-card-title">
            <h2>Medicine Information</h2>
            <p>Update all required medicine information</p>
          </div>

          <div className="up-form">
            <div className="up-field">
              <label>Medicine Name</label>
              <input
                type="text"
                value={product.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "up-input-error" : ""}
              />
              {errors.name && <span>{errors.name}</span>}
            </div>

            <div className="up-grid-2">
              <div className="up-field">
                <label>Price</label>
                <div
                  className={`up-input-icon ${
                    errors.price ? "up-input-error" : ""
                  }`}
                >
                  <span>₹</span>
                  <input
                    type="number"
                    value={product.price || ""}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>
                {errors.price && <span>{errors.price}</span>}
              </div>

              <div className="up-field">
                <label>Stock Units</label>
                <input
                  type="number"
                  value={product.stock || ""}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  className={errors.stock ? "up-input-error" : ""}
                />
                {errors.stock && <span>{errors.stock}</span>}
              </div>
            </div>

            <div className="up-grid-2">
              <div className="up-field">
                <label>Category</label>
                <input
                  type="text"
                  value={product.category || ""}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className={errors.category ? "up-input-error" : ""}
                />
                {errors.category && <span>{errors.category}</span>}
              </div>

              <div className="up-field">
                <label>Brand</label>
                <input
                  type="text"
                  value={product.brand || ""}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  className={errors.brand ? "up-input-error" : ""}
                />
                {errors.brand && <span>{errors.brand}</span>}
              </div>
            </div>

            <div className="up-field">
              <label>Description</label>
              <textarea
                rows="5"
                value={product.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={errors.description ? "up-input-error" : ""}
              />
              {errors.description && <span>{errors.description}</span>}
            </div>

            <div className="up-actions">
              <button className="up-btn up-primary" onClick={handleUpdate}>
                <span className="material-symbols-outlined">save</span>
                Update Medicine
              </button>

              <button className="up-btn up-secondary" onClick={handleClear}>
                <span className="material-symbols-outlined">restart_alt</span>
                Clear Form
              </button>

              <button className="up-btn up-danger" onClick={deleteItem}>
                <span className="material-symbols-outlined">delete</span>
                Delete Medicine
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Updateproduct;
