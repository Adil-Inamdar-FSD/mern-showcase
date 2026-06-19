import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setShopInMyCity, setUserData } from "../redux/userslice";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-by-city/${currentCity}`,
          {
            withCredentials: true,
          },
        );

        dispatch(setShopInMyCity(result.data));
      } catch (err) {
        setError(err?.response?.data || err.message);
        console.log(err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [currentCity]);

  return { loading, error };
}

export default useGetShopByCity;
