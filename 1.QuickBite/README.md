# 🍔 QuickBite – MERN Stack Food Ordering App

QuickBite is a full-stack food ordering web application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to browse food items, manage cart, place orders, and experience a smooth and modern food ordering flow.

🚀 Live Demo: https://mern-showcase.vercel.app/

---

## 📌 Features

- 🍽️ Browse food menu
- 🛒 Add/remove items from cart
- 📦 Place orders
- 👤 User authentication (Signup/Login)
- 🧾 View order history
- ⚡ Fast and responsive UI
- 📱 Mobile-friendly design
- 🔐 Secure backend with JWT authentication

---

## 🛠️ Tech Stack

Frontend:
- React.js
- CSS / Tailwind CSS
- Axios
- React Router

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js

Deployment:
- Frontend: Vercel
- Backend: Render / Railway
- Database: MongoDB Atlas

---

## 📁 Project Structure

QuickBite/
├── client (React Frontend)
├── server (Node + Express Backend)
│   ├── models
│   ├── routes
│   ├── controllers
│   └── middleware
├── .env
└── README.md

---

## ⚙️ Setup Instructions

### Clone repo
git clone https://github.com/your-username/quickbite.git

### Install dependencies

Backend:
cd server
npm install

Frontend:
cd client
npm install

---

## 🔐 Environment Variables

Create a `.env` file inside server folder:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

---

## ▶️ Run Project

Backend:
cd server
npm start

Frontend:
cd client
npm start

---

## 🔑 Authentication

- JWT-based authentication system
- Passwords encrypted using bcrypt
- Protected routes for user safety

---

## 🚀 Future Improvements

- Payment gateway integration (Razorpay / Stripe)
- Admin dashboard
- Real-time order tracking (Socket.io)
- Coupon system
- Vendor/restaurant panel

---

## 👨‍💻 Developer

Built with ❤️ by Adil  
Live Project: https://mern-showcase.vercel.app/
