import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const fetchProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (product) => axios.post(`${API_URL}/products`, product);
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);
export const fetchAnalytics = () => axios.get(`${API_URL}/analytics`);
