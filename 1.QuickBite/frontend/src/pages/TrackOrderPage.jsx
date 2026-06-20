import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../component/DeliveryBoyTracking";
import { useSelector } from "react-redux";

function TrackOrderPage() {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState();
  const navigate = useNavigate();
  const { socket } = useSelector((state) => state.user);
  const [liveLocation, setLiveLocation] = useState({});

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true },
      );

      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handler = ({ deliveryBoyId, latitude, longitude }) => {
      console.log("LIVE UPDATE:", deliveryBoyId, latitude, longitude);

      setLiveLocation((prev) => ({
        ...prev,
        [deliveryBoyId]: {
          lat: latitude,
          lon: longitude,
        },
      }));
    };

    socket.on("updateDeliveryLocation", handler);

    return () => {
      socket.off("updateDeliveryLocation", handler);
    };
  }, [socket]);

  useEffect(() => {
    if (orderId) {
      handleGetOrder();
    }
  }, [orderId]);
  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div className="relative top-5 flex items-center gap-4 left-5 z-10 mb-2.5">
        <IoIosArrowRoundBack
          size={35}
          onClick={() => navigate("/")}
          className="text-[#ff4d2d]"
        />
        <h1 className="text-2xl font-bold md:text-center">Track Order</h1>
      </div>
      {currentOrder?.shopOrders?.map((shopOrder, index) => {
        const liveBoy = liveLocation?.[shopOrder.assignedDeliveryBoy?._id];

        const deliveryBoyLocation = {
          lat:
            liveBoy?.lat ??
            shopOrder.assignedDeliveryBoy?.location?.coordinates?.[1],
          lon:
            liveBoy?.lon ??
            shopOrder.assignedDeliveryBoy?.location?.coordinates?.[0],
        };

        return (
          <div
            key={index}
            className="bg-white p-4 rounded-2xl shadow-md border border-orange-50 space-y-4"
          >
            <div>
              <p className="text-lg font-bold mb-2 text-[#ff4d2d]">
                {shopOrder.shop.name}
              </p>

              <p className="font-semibold">
                <span>Items</span>{" "}
                {shopOrder.shopOrderItems.map((i) => i.name).join(",")}
              </p>

              <p>
                <span className="font-semibold">Subtotal</span>{" "}
                {shopOrder.subtotal}
              </p>

              <p className="mt-6">
                <span className="font-semibold">Delivery Address</span>{" "}
                {currentOrder?.deliveryAddress?.text}
              </p>
            </div>

            {shopOrder.status !== "delivered" ? (
              shopOrder.assignedDeliveryBoy ? (
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">
                    Delivery boy name: {shopOrder.assignedDeliveryBoy.fullName}
                  </p>
                  <p className="font-semibold">
                    Delivery boy contact number:{" "}
                    {shopOrder.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              ) : (
                <p className="font-semibold">
                  Delivery boy is not assigned yet.
                </p>
              )
            ) : (
              <p className="text-green-600 font-semibold text-lg">Delivered</p>
            )}

            {shopOrder.assignedDeliveryBoy &&
              shopOrder.status !== "delivered" && (
                <div className="h-100 w-full rounded-2xl shadow-md">
                  <DeliveryBoyTracking
                    data={{
                      deliveryBoyLocation,
                      customerLocation: {
                        lat: currentOrder.deliveryAddress.latitude,
                        lon: currentOrder.deliveryAddress.longitude,
                      },
                    }}
                  />
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
}

export default TrackOrderPage;