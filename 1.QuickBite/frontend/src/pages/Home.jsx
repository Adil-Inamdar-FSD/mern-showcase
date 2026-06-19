import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../component/UserDashboard";
import OwnerDashboard from "../component/OwnerDashboard";
import DeliveryBoy from "../component/DeliveryBoy";
import Nav from "../component/Nav";

function Home() {
  const { userData } = useSelector((state) => state.user);
  return (
    <div className="w-screen min-h-screen pt-25 flex flex-col items-center bg-[#fff9f6]">
      {userData.role === "user" && <UserDashboard />}
      {userData.role === "owner" && <OwnerDashboard />}
      {userData.role === "deliveryBoy" && <DeliveryBoy />}
    </div>
  );
}

export default Home;
