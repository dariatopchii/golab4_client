import React, { useState, useEffect } from "react";
import { addProduct } from "../services/api";
import { useNavigate } from "react-router-dom";

function ProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/images.json");
        const imageList = await response.json();
        setImages(imageList);
        if (imageList.length > 0) {
          setImage(imageList[0]);
        }
      } catch (error) {
        console.error("Failed to fetch image list:", error);
      }
    };

    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct({ name, price: parseFloat(price), image_url: `${image}` });
      setName("");
      setPrice("");
      setImage(images[0] || "");
      alert("Товар додано успішно!");
      navigate("/");
    } catch (error) {
      alert("Помилка додавання товару.");
    }
  };

  return (
    <div>
      <h2>Додати товар</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Назва товару"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Ціна"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <select value={image} onChange={(e) => setImage(e.target.value)}>
          {images.map((img) => (
            <option key={img} value={img}>
              {img}
            </option>
          ))}
        </select>
        <button type="submit">Додати</button>
      </form>
    </div>
  );
}

export default ProductForm;
