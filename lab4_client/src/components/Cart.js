import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

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

  const handleCheckout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/checkout",
        {},
        {
          headers: { "User-ID": user.id },
        }
      );
      alert("Покупку завершено!");
      loadCart();
    } catch (error) {
      console.error("Помилка під час оформлення покупки:", error);
      alert("Не вдалося завершити покупку.");
    }
  };

  if (!cart) {
    return <div>Завантаження...</div>;
  }

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
              style={{ width: "50px", height: "50px", marginRight: "10px", borderRadius: "5px" }}
            />
            <div>
              <div style={{ fontWeight: "bold" }}>{item.product.name}</div>
              <div>{item.product.price.toFixed(2)}₴</div>
            </div>
            <div>
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value, 10))}
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
        Загальна сума:{" "}
        {cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}₴
      </h3>
      {cart.items.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleCheckout}
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Оформити замовлення
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
