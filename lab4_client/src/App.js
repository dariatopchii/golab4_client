import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import Analytics from './components/Analytics';
import Register from './components/Register';
import Login from './components/Login';
import Purchases from './components/Purchases';
import Cart from './components/Cart';

function App() {
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', color: '#ff6347' }}>Новорічні дива</h1>
        <nav>
          <ul style={{ display: 'flex', justifyContent: 'center', gap: '20px', listStyle: 'none', padding: '0' }}>
            {!user ? (
              <>
                <li><Link to="/login">Увійти</Link></li>
                <li><Link to="/register">Реєстрація</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/">Товари</Link></li>
                <li><Link to="/add-product">Додати товар</Link></li>
                <li><Link to="/cart">Кошик</Link></li>
                <li><Link to="/purchases">Мої покупки</Link></li>
                {user.is_admin && <li><Link to="/analytics">Аналітика</Link></li>}
                <li><button onClick={logout} style={{ border: 'none', backgroundColor: 'transparent', color: '#ff6347', cursor: 'pointer' }}>Вийти</button></li>
              </>
            )}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={user ? <ProductList user={user} /> : <Navigate to="/login" />} />
          <Route path="/add-product" element={user ? <ProductForm /> : <Navigate to="/login" />} />
          <Route path="/cart" element={user ? <Cart user={user} /> : <Navigate to="/login" />} />
          <Route path="/purchases" element={user ? <Purchases user={user} /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={user && user.is_admin ? <Analytics user={user} /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
