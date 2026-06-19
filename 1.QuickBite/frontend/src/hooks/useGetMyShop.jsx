import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userslice";
import { setMyShopData } from "../redux/ownerSlice";

function useGetMyShop() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my`, {
          withCredentials: true,
        });

        dispatch(setMyShopData(result.data));
      } catch (err) {
        setError(err?.response?.data || err.message);
        console.log(err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [dispatch]);

  return { loading, error };
}

export default useGetMyShop;
