import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    return Array.isArray(savedCart) ? savedCart : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const productId = product._id || product.id;

      const existing = prev.find(
        (item) => String(item._id || item.id) === String(productId)
      );

      if (existing) {
        return prev.map((item) =>
          String(item._id || item.id) === String(productId)
            ? { ...item, qty: Number(item.qty || 1) + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        String(item._id || item.id) === String(id)
          ? { ...item, qty: Number(item.qty || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          String(item._id || item.id) === String(id)
            ? { ...item, qty: Number(item.qty || 1) - 1 }
            : item
        )
        .filter((item) => Number(item.qty) > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => String(item._id || item.id) !== String(id))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.qty || 1),
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.qty || 1),
    0
  );

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        tax,
        total,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;