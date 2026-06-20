import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { TbReceiptRupeeFilled } from "react-icons/tb";
import axios from "axios";
import { serverUrl } from "../App";
import { setSearchItems, setUserData } from "../redux/userslice";
import { useNavigate } from "react-router-dom";

function Nav() {
  const { userData, currentCity, cartItems } = useSelector(
    (state) => state.user,
  );
  const { myShopData } = useSelector((state) => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchItems = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`,
        { withCredentials: true },
      );
      dispatch(setSearchItems(result.data));
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {
  const timer = setTimeout(() => {
    if (query.trim()) {
      handleSearchItems();
    } else {
      dispatch(setSearchItems([]));
    }
  }, 500);

  return () => clearTimeout(timer);
}, [query]);

  return (
    <div className="w-full h-20 flex items-center justify-between md:justify-center gap-7 px-5 fixed top-0 z-9999 bg-[#fff9f6]">
      {/* Mobile Search Popup */}
      {showSearch && userData.role === "user" && (
        <div className="w-[90%] h-16 bg-white shadow-xl rounded-lg flex md:hidden items-center gap-5 fixed top-20 left-[5%] px-3 z-9999">
          <div className="flex items-center w-[30%] overflow-hidden gap-2 border-r border-gray-300 pr-2">
            <FaLocationDot size={20} className="text-[#ff4d2d]" />
            <div className="truncate text-gray-600">{currentCity}</div>
          </div>

          <div className="flex-1 flex items-center gap-2">
            <FaSearch size={20} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full outline-none text-gray-700"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Logo */}
      <h1 className="text-3xl font-bold text-[#ff4d2d]">QuickBite</h1>
      {userData.role == "user" && (
        <div className="hidden md:flex md:w-[60%] lg:w-[40%] h-16 bg-white shadow-xl rounded-lg items-center gap-5 px-3">
          <div className="flex items-center w-[30%] overflow-hidden gap-2 border-r border-gray-300 pr-2">
            <FaLocationDot size={20} className="text-[#ff4d2d]" />
            <div className="truncate text-gray-600">{currentCity}</div>
          </div>

          <div className="flex-1 flex items-center gap-2">
            <FaSearch size={20} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full outline-none text-gray-700"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {userData.role == "user" && showSearch ? (
          <RxCross2
            size={25}
            className="text-[#ff4d2d] md:hidden cursor-pointer"
            onClick={() => setShowSearch(false)}
          />
        ) : (
          <FaSearch
            size={22}
            className="text-[#ff4d2d] md:hidden cursor-pointer"
            onClick={() => setShowSearch(true)}
          />
        )}

        {userData.role == "owner" ? (
          <>
            {myShopData && (
              <>
                <button
                  className="hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={18} />
                  <span>Add Food Item</span>
                </button>
                <button
                  className="md:hidden flex items-center  p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={18} />
                </button>
              </>
            )}
            <div
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg  bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceiptRupeeFilled size={20} />
              <span>My Orders</span>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-px">
                0
              </span>
            </div>
            <div
              className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg  bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceiptRupeeFilled size={20} />
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-px">
                0
              </span>
            </div>
          </>
        ) : (
          <>
            {userData.role == "user" && (
              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <FaShoppingCart size={24} className="text-[#ff4d2d]" />
                <span className="absolute -right-2 -top-3 text-[#ff4d2d]">
                  {cartItems.length}
                </span>
              </div>
            )}
            <button
              className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium"
              onClick={() => navigate("/my-orders")}
            >
              My Orders
            </button>
          </>
        )}

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-lg shadow-xl font-semibold cursor-pointer"
          onClick={() => setShowInfo((prev) => !prev)}
        >
          {userData?.fullName?.charAt(0)}
        </div>

        {/* User Menu */}
        {showInfo && (
          <div className="fixed top-20 right-3 md:right-[10%] lg:right-[25%] w-48 bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-3 z-9999">
            <div className="font-semibold text-[17px]">
              {userData?.fullName}
            </div>
            {userData.role == "user" && (
              <div
                className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer"
                onClick={() => navigate("/my-orders")}
              >
                My Orders
              </div>
            )}
            <div
              className="text-[#ff4d2d] font-semibold cursor-pointer"
              onClick={handleLogout}
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;