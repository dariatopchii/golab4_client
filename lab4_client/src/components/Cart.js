import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PayPalButton from "./PayPalButton";

function Cart({ user }) {
  const [cart, setCart] = useState(null);

  const loadCart = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/cart", {
        headers: { "User-ID": user.id },
      });
      setCart(response.data);
    } catch (error) {
      console.error("Помилка завантаження кошика:", error);
      alert("Не вдалося завантажити кошик.");
    }
  }, [user.id]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantityChange = async (productID, newQuantity) => {
    try {
      await axios.post(
        "http://localhost:8080/cart/update",
        { id: productID, quantity: newQuantity },
        {
          headers: { "User-ID": user.id },
        }
      );
      loadCart();
    } catch (error) {
      console.error("Помилка зміни кількості:", error);
      alert("Не вдалося змінити кількість.");
    }
  };

  if (!cart) {
    return <div>Завантаження...</div>;
  }

  if (cart.items.length === 0) {
    return <div>Ваш кошик порожній</div>;
  }

  const totalAmount = cart.items
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ color: "red" }}>Ваш кошик</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cart.items.map((item) => (
          <li
            key={item.product.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <img
              src={`images/${item.product.image_url}`}
              alt={item.product.name}
              style={{
                width: "50px",
                height: "50px",
                marginRight: "10px",
                borderRadius: "5px",
              }}
            />
            <div>
              <div style={{ fontWeight: "bold" }}>{item.product.name}</div>
              <div>{item.product.price.toFixed(2)} USD</div>
            </div>
            <div>
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) =>
                  handleQuantityChange(item.product.id, parseInt(e.target.value, 10))
                }
                style={{
                  width: "60px",
                  padding: "5px",
                  marginRight: "10px",
                  textAlign: "center",
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <h3 style={{ color: "red", textAlign: "center" }}>
        Загальна сума: {totalAmount} USD
      </h3>
      <PayPalButton totalAmount={totalAmount} user={user} />
      <div
        id="paypal-button-container"
        style={{ position: "relative", textAlign: "center" }}
      >
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "50%",
            backgroundColor: "white",
            zIndex: 1,
            opacity: 0.9,
          }}
        ></div>
      </div>
    </div>
  );
}

export default Cart;
