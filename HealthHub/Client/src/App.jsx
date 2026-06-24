import { BrowserRouter, Route, Routes } from "react-router-dom";

/* AUTH */
import Login from "./auth/Login";
import Signup from "./auth/Signup";

/* USER */
import Favirotescreen from "./user/components/Favirote_screen";
import ShoppingCart from "./user/components/ShoppingCart";
import UserHomeScreen from "./user/components/UserHome";
import Profile from "./user/components/Profile";
import DoctorInfoPage from "./user/components/DoctorInfoPage";
import CheckoutPage from "./user/components/CheckoutPage";
import ContactPage from "./user/components/ContactPage";
import PrescriptionUploader from "./user/components/PrescriptionUploader";
import AppointmentPage from "./user/components/AppointmentPage";
import UserLayout from "./user/components/UserLayout";
import InvoicePage from "./user/components/InvoicePage";
import ProductDetail from "./user/components/ProductDetail";
import OrdersPage from "./user/components/OrdersPage";

/* ADMIN */
import AdminLayout from "./admin/components/AdminLayout";
import AddProduct from "./admin/components/Addproduct";
import AdminDashboard from "./admin/components/AdminDashboard";
import ProductListAdmin from "./admin/components/ProductListAdmin";
import Updateproduct from "./admin/components/Update-product";
import AdminProfile from "./admin/components/AdminProfile";

/* CONTEXT */
import CartProvider from "./user/components/context/CartContext";
export const serverUrl = "http://localhost:5000"

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* AUTH */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* USER ROUTES */}
          <Route element={<UserLayout />}>
            <Route path="/userhome" element={<UserHomeScreen />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/priscription" element={<PrescriptionUploader />} />
            <Route path="/doctorinfo" element={<DoctorInfoPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/productdetail/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/favirote" element={<Favirotescreen />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/invoice" element={<InvoicePage />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<AdminLayout />}>
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/adminprofile" element={<AdminProfile />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/productlist" element={<ProductListAdmin />} />
            <Route path="/updateproduct/:id" element={<Updateproduct />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
