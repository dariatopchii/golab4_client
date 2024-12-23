import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

export default function PayPalButton({ totalAmount, user }) {
  const paypal = useRef();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const addPayPalScript = async () => {
      try {
        if (window.paypal) {
          renderPayPalButtons();
          return;
        }

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=AWyujO1skZ-qwgFhFXqYAyru6aKB9ZIdtEih6eSZKwnyCdUdnpIyfcFLtJHSyO21xcXLvNAAIUI5myPN&currency=USD`;
        script.onload = () => renderPayPalButtons();
        script.onerror = () => console.error("Помилка завантаження PayPal SDK");
        document.body.appendChild(script);
      } catch (err) {
        console.error("Помилка при додаванні PayPal SDK:", err);
      }
    };

    const renderPayPalButtons = () => {
      if (!window.paypal) {
        console.error("PayPal SDK не завантажено.");
        return;
      }

      try {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    description: "Ваше замовлення",
                    amount: {
                      currency_code: "USD",
                      value: totalAmount,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              try {
                const order = await actions.order.capture();
                console.log("Деталі замовлення:", order);

                const payload = {
                  orderID: order.id,
                  amount: order.purchase_units[0].amount.value,
                  currency: order.purchase_units[0].amount.currency_code,
                  payer: {
                    email: order.payer.email_address,
                    name: `${order.payer.name.given_name} ${order.payer.name.surname}`,
                  },
                };

                await axios.post(
                  "http://localhost:8080/checkout",
                  payload,
                  {
                    headers: { "User-ID": user.id },
                  }
                );

                alert("Покупка успішно завершена!");
              } catch (err) {
                console.error("Помилка при надсиланні даних на бекенд:", err);
                setErrorMessage(err.response?.data || "Сталася невідома помилка.");
              }
            },
            onError: (err) => {
              console.error("Помилка PayPal:", err);
              alert("Помилка під час оплати.");
            },
          })
          .render(paypal.current);
      } catch (err) {
        console.error("Помилка рендерингу кнопок PayPal:", err);
      }
    };

    addPayPalScript();
  }, [totalAmount, user]);

  return (
    <div>
      <div ref={paypal}></div>
      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>
          Помилка: {errorMessage}
        </div>
      )}
    </div>
  );
}
