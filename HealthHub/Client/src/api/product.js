const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const createProduct = async (data) => {
  const res = await fetch(`${BASE_URL}/api/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/api/product`);
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/api/product/${id}`, {
    method: "DELETE",
  });

  return res.json();
};
