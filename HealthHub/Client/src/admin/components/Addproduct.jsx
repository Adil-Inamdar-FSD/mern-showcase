import React, { useState } from "react";
import "./addproduct.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProduct } from "../../api/product";
const BaseUrl = import.meta.env.VITE_SERVER_URL;

function AddProduct() {
  const navigate = useNavigate();

  const [formdata, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    brand: "",
  });

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= IMAGE PICK =================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ================= CLEAR =================
  const handleClear = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      brand: "",
    });

    setPreview("");
    setImageFile(null);
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    if (
      !formdata.name?.trim() ||
      !formdata.category?.trim() ||
      !formdata.brand?.trim() ||
      !formdata.price ||
      !formdata.stock ||
      !formdata.description?.trim()
    ) {
      toast.error("Please fill all required fields");
      return false;
    }

    return true;
  };

  // ================= CLOUDINARY UPLOAD =================
  const uploadToCloudinary = async () => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    return data.secure_url;
  };

  // ================= SUBMIT =================
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);
  const toastId = toast.loading("Adding medicine...");

  try {
    // Upload image to Cloudinary first
    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadToCloudinary();
    }

    // Create final product object
    const productData = {
      ...formdata,
      imageUrl: imageUrl,
    };

    const res = await fetch(`${BaseUrl}/api/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add medicine");
    }

    toast.dismiss(toastId);
    toast.success("Medicine added successfully");

    navigate("/admindashboard");
  } catch (error) {
    console.log(error);

    toast.dismiss(toastId);
    toast.error(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="add-product-page">
      <section className="ap-header">
        <div className="ap-brand">
          <div className="ap-brand-icon">
            <span className="material-symbols-outlined">medication</span>
          </div>

          <div>
            <h1>Add Medicine</h1>
            <p>Create medicine products for your HealthHub store</p>
          </div>
        </div>

        <div className="ap-header-actions">
          <button
            className="ap-nav-btn"
            onClick={() => navigate("/admindashboard")}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>

          <button
            className="ap-nav-btn"
            onClick={() => navigate("/productlist")}
          >
            <span className="material-symbols-outlined">inventory_2</span>
            Medicine List
          </button>
        </div>
      </section>

      <section className="ap-layout">
        <div className="ap-card">
          <div className="ap-card-top">
            <h2>Medicine Information</h2>
            <p>Fill all medicine details carefully.</p>
          </div>

          <form className="ap-form" onSubmit={handleSubmit}>
            <div className="ap-form-group">
              <label>Medicine Name</label>
              <input
                type="text"
                name="name"
                value={formdata.name}
                onChange={handleChange}
                className={""}
              />
            </div>

            <div className="ap-form-row">
              <div className="ap-form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formdata.category}
                  onChange={handleChange}
                />
              </div>

              <div className="ap-form-group">
                <label>Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formdata.brand}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ap-form-row">
              <div className="ap-form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formdata.price}
                  onChange={handleChange}
                />
              </div>

              <div className="ap-form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formdata.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ap-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formdata.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="ap-btn-row">
              <button
                type="button"
                className="ap-secondary-btn"
                onClick={handleClear}
              >
                Clear Form
              </button>

              <button
                type="submit"
                className="ap-primary-btn"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Medicine"}
              </button>
            </div>
          </form>
        </div>

        <aside className="ap-card ap-side-card">
          <div className="ap-card-top">
            <h2>Medicine Image</h2>
            <p>Upload medicine image to preview instantly.</p>
          </div>

          <label className="ap-upload-box">
            <input type="file" onChange={handleImageUpload} />

            <div className="ap-upload-content">
              <span className="material-symbols-outlined ap-upload-icon">
                upload
              </span>
              <h3>Upload Image</h3>
              <p>Click here to select medicine image</p>
            </div>
          </label>

          <div className="ap-preview-box">
            {preview ? (
              <img src={preview} className="ap-preview-img" />
            ) : (
              <div className="ap-preview-empty">
                <span className="material-symbols-outlined">image</span>
                <p>No image selected</p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default AddProduct;
