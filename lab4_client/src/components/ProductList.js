import React, { useState, useEffect } from "react";
import { fetchProducts, deleteProduct } from "../services/api";
import axios from "axios";
import "./ProductList.css"; // Подключаем CSS для стилей

function ProductList({ user }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetchProducts();
      setProducts(response.data);
      const initialQuantities = response.data.reduce((acc, product) => {
        acc[product.id] = 1; // Default quantity set to 1
        return acc;
      }, {});
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Помилка завантаження товарів:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error("Помилка видалення товару:", error);
    }
  };

  const handleAddToCart = async (productID) => {
    try {
      await axios.post(
        "http://localhost:8080/cart",
        { id: productID, quantity: quantities[productID] },
        { headers: { "User-ID": user.id } }
      );
      alert("Товар додано до кошика!");
    } catch (error) {
      console.error("Помилка додавання до кошика:", error);
      alert("Не вдалося додати товар до кошика.");
    }
  };

  const handleQuantityChange = (productID, value) => {
    setQuantities({ ...quantities, [productID]: parseInt(value) || 1 });
  };

  return (
    <div className="product-list">
      <h2 className="product-list-title">Список товарів</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              className="product-image"
              src={`images/${product.image_url}`}
              alt={product.name}
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{product.price.toFixed(2)}₴</p>
            <div className="product-actions">
              <input
                type="number"
                value={quantities[product.id] || 1}
                min="1"
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                className="product-quantity"
              />
              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(product.id)}
              >
                Додати до кошика
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(product.id)}
              >
                Видалити товар
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
