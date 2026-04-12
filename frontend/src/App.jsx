import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import CategoryPage from './pages/CategoryPage';
import Shop from './pages/Shop';
import Deals from './pages/Deals';
import Login from './pages/Login';

function App() {
  return (
    <Router> 
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff' }}>
        
        <Navbar />
        
        <main style={{ paddingTop: '80px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/deals" element={<Deals />} />
          </Routes>
        </main>
        
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;