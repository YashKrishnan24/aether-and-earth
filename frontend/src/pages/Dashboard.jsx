import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProfile, logout } from '../store/authSlice';
import { Package, MapPin, CreditCard, LogOut, Loader2, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Load profile data if user exists but data unavailable
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  if (loading) {
    return (
      <div className="dashboard-loader">
        <Loader2 size={40} className="spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Prevent rendering if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="dashboard-page fade-in">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div className="user-intro">
            <h1>Welcome, {user?.name || 'User'}</h1>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="tab-nav">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Package size={18} /> Orders
            </button>
            <button 
              className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={18} /> Addresses
            </button>
            <button 
              className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <CreditCard size={18} /> Payments
            </button>
            <button className="tab-btn checkout-btn" onClick={() => navigate('/checkout')}>
              <ShoppingBag size={18} /> Checkout
            </button>
            <button className="tab-btn logout" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* OVERVIEW/ORDERS TAB */}
          {activeTab === 'overview' && (
            <section className="tab-content">
              <h2>Your Orders</h2>
              <div className="empty-state">
                <ShoppingBag size={48} />
                <p>No orders yet</p>
                <button onClick={() => navigate('/shop')} className="browse-btn">
                  Start Shopping
                </button>
              </div>
            </section>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <section className="tab-content">
              <h2>Delivery Addresses</h2>
              <div className="addresses-container">
                <div className="address-card">
                  <h3>Default Address</h3>
                  <p>No addresses saved yet</p>
                  <button className="add-btn">+ Add Address</button>
                </div>
              </div>
            </section>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <section className="tab-content">
              <h2>Payment Methods</h2>
              <div className="payments-container">
                <div className="payment-card">
                  <h3>Saved Cards</h3>
                  <p>No payment methods saved</p>
                  <button className="add-btn">+ Add Payment Method</button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <style>{`
        .dashboard-page { min-height: calc(100vh - 160px); background: linear-gradient(135deg, #f8f7f4 0%, #fafafa 100%); }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .dashboard-loader { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .dashboard-header { background: white; padding: 40px; border-bottom: 1px solid #e0e0e0; }
        .header-content { display: flex; align-items: center; gap: 20px; max-width: 1300px; margin: 0 auto; }
        .user-avatar { width: 60px; height: 60px; border-radius: 50%; background: var(--accent-sand); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700; }
        .user-intro h1 { font-size: 1.8rem; font-weight: 600; margin-bottom: 5px; color: var(--text-dark); }
        .user-intro p { color: #888; font-size: 0.95rem; }

        .dashboard-container { display: grid; grid-template-columns: 250px 1fr; gap: 30px; padding: 40px; max-width: 1300px; margin: 0 auto; }
        .dashboard-sidebar { position: sticky; top: 100px; height: fit-content; }
        .tab-nav { display: flex; flex-direction: column; gap: 10px; }
        .tab-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; border: none; background: white; border: 1px solid #e0e0e0; border-radius: 10px; cursor: pointer; font-weight: 500; color: #555; transition: all 0.3s ease; font-family: inherit; font-size: 0.95rem; }
        .tab-btn:hover { border-color: var(--accent-sand); background: #fafafa; }
        .tab-btn.active { background: var(--accent-sand); color: white; border-color: var(--accent-sand); }
        .tab-btn.checkout-btn { background: var(--text-dark); color: white; border-color: var(--text-dark); font-weight: 600; margin-top: 10px; }
        .tab-btn.checkout-btn:hover { opacity: 0.9; }
        .tab-btn.logout { color: #e74c3c; border-color: #ffcdd2; }
        .tab-btn.logout:hover { background: #ffebee; }

        .dashboard-main { }
        .tab-content h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 30px; color: var(--text-dark); }

        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 40px; text-align: center; background: white; border-radius: 16px; border: 1px solid #e0e0e0; }
        .empty-state svg { color: #ccc; margin-bottom: 15px; }
        .empty-state p { font-size: 1.1rem; color: #888; margin-bottom: 25px; }
        .browse-btn { padding: 12px 30px; background: var(--accent-sand); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .browse-btn:hover { background: #c57676; }

        .addresses-container, .payments-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .address-card, .payment-card { background: white; padding: 25px; border-radius: 12px; border: 1px solid #e0e0e0; }
        .address-card h3, .payment-card h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 12px; color: var(--text-dark); }
        .address-card p, .payment-card p { color: #888; font-size: 0.95rem; margin-bottom: 20px; }
        .add-btn { width: 100%; padding: 12px; background: #f5f5f5; border: 2px dashed #ddd; border-radius: 8px; cursor: pointer; font-weight: 500; color: #666; transition: 0.3s; }
        .add-btn:hover { background: #efefef; border-color: var(--accent-sand); color: var(--accent-sand); }

        @media (max-width: 900px) {
          .dashboard-container { grid-template-columns: 1fr; }
          .dashboard-sidebar { position: sticky; top: 100px; }
          .tab-nav { flex-direction: row; overflow-x: auto; gap: 10px; padding-bottom: 10px; }
          .tab-btn { flex-shrink: 0; }
          .dashboard-header { padding: 20px; }
          .header-content { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
