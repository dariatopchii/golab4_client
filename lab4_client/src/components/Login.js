import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Для обработки ошибок
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset errors for a new request
        try {
            const response = await axios.post('http://localhost:8080/login', { username, password });
            
            console.log('Login Response:', response.data); // Log the server response
            setUser(response.data.user); // Set the user object
            
            console.log('User after login:', response.data.user); // Confirm user object is set
            alert('Login successful');
        } catch (err) {
            setError(err.response?.data || 'Login failed');
            console.error(err.response?.data || err.message);
        }
    };
     
  
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Показываем ошибку */}
      </div>
    );
  }

export default Login;
