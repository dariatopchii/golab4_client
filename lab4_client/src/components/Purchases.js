import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function Purchases({ user }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPurchases = useCallback(async () => {
    if (!user || !user.id) {
      console.error("Некоректна сесія користувача.");
      alert("Некоректна сесія користувача. Будь ласка, увійдіть ще раз.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/purchases", {
        headers: { "User-ID": user.id },
      });

      if (Array.isArray(response.data)) {
        setPurchases(response.data);
      } else {
        console.error("Несподіваний формат даних:", response.data);
        alert("Не вдалося завантажити покупки: несподіваний формат даних.");
      }
    } catch (error) {
      console.error("Помилка завантаження покупок:", error.response?.data || error.message);
      alert("Не вдалося завантажити покупки.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  if (loading) {
    return <div>Завантаження покупок...</div>;
  }

  if (!purchases || purchases.length === 0) {
    return <div>У вас ще немає покупок.</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ color: "red" }}>Ваші покупки</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {purchases.map((purchase) => (
          <li
            key={purchase.id || purchase.ID}
            style={{
              marginBottom: "20px",
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <h4>
              <span style={{ fontWeight: "bold", color: "green" }}>Дата покупки:</span>{" "}
              {purchase.date
                ? new Date(purchase.date).toLocaleDateString("uk-UA")
                : "Невідома дата"}
            </h4>
            <p style={{ fontWeight: "bold", color: "red" }}>
              Загальна сума:{" "}
              {purchase.total !== undefined
                ? `${purchase.total.toFixed(2)}₴`
                : "N/A"}
            </p>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {purchase.items?.length > 0 ? (
                purchase.items.map((item) => (
                  <li
                    key={item.id || item.ID}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      paddingBottom: "10px",
                      borderBottom: "1px dashed #ddd",
                    }}
                  >
                    <img
                      src={`images/${item.image_url}`}
                      alt={item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        marginRight: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: "bold" }}>{item.name || "Невідомий товар"}</div>
                      <div>{item.price ? `${item.price.toFixed(2)}₴` : "N/A"}</div>
                    </div>
                  </li>
                ))
              ) : (
                <li>Товари відсутні</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Purchases;
