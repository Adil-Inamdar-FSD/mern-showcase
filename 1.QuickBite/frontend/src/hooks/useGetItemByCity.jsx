import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity, setShopInMyCity, setUserData } from "../redux/userslice";

function useGetItemByCity() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${currentCity}`,
          {
            withCredentials: true,
          },
        );

        dispatch(setItemsInMyCity(result.data));
      } catch (err) {
        setError(err?.response?.data || err.message);
        console.log(err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [currentCity]);

  return { loading, error };
}

export default useGetItemByCity;
