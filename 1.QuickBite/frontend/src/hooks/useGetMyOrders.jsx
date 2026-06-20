import React from "react";
import { setMyOrders } from "../redux/userslice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userdata } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
        });

        dispatch(setMyOrders(result.data));
        // console.log(result.data[0]?.shopOrders?.[0]?.shopOrderItems);
      } catch (err) {
        console.log(err?.response?.data || err.message);
      }
    };

    fetchOrders();
  }, [userdata, dispatch]);
}

export default useGetMyOrders;