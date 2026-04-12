import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Package, CreditCard, LogOut, Award, Plus, Smartphone, Building2, Settings, LayoutDashboard
} from 'lucide-react';

const Account = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [currentTab, setCurrentTab] = useState(searchParams.get('tab') || 'dashboard');
  
  // DYNAMIC ORDERS STATE
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    if (!localStorage.getItem('isAuthenticated')) {
      navigate('/login');
      return;
    }
    
    // Load dynamic orders from storage
    const savedOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
    setMyOrders(savedOrders);

    const tab = searchParams.get('tab') || 'dashboard';
    setCurrentTab(tab);
    window.scrollTo(0, 0);
  }, [searchParams, navigate]);

  const handleTabChange = (tabName) => setSearchParams({ tab: tabName });

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Payment State
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentMethods] = useState([
    { id: 1, type: "Card", provider: "Visa", last4: "4242", expiry: "12/28", isDefault: true },
  ]);

  const renderPaymentIcon = (type) => {
    return type === 'UPI' ? <Smartphone size={20} /> : <CreditCard size={20} />;
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <div className="account-fade-in">
            <div className="account-header">
              <h1>Welcome back, Yash</h1>
              <p>Everything looks good. You have {myOrders.filter(o => o.status === 'Processing').length} orders currently processing.</p>
            </div>
            
            <div className="account-stats-grid">
              <div className="account-stat-card">
                <div className="stat-icon-wrapper"><Award size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Aether Points</span>
                  <span className="stat-value">1,250 pts</span>
                </div>
              </div>
              <div className="account-stat-card">
                <div className="stat-icon-wrapper"><Package size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Total Orders</span>
                  <span className="stat-value">{myOrders.length} Orders</span>
                </div>
              </div>
            </div>

            <div className="account-section-box">
              <div className="section-title-row">
                <h2>Recent Orders</h2>
                <button className="account-text-btn" onClick={() => handleTabChange('orders')}>View All</button>
              </div>
              
              {myOrders.length === 0 ? (
                 <p style={{ color: '#888' }}>You haven't placed any orders yet.</p>
              ) : (
                myOrders.slice(0, 3).map(order => (
                  <div key={order.id} className="account-order-item">
                    <div className="order-main">
                      <span className="order-id-tag">#{order.id}</span>
                      <span className="order-date-text">{order.date} • {order.items} Items</span>
                    </div>
                    <div className="order-status">
                      <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                      <span className="order-amt">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="account-fade-in">
            <div className="account-header">
              <h1>Order History</h1>
              <p>Manage your recent purchases and track shipments.</p>
            </div>
            <div className="account-order-list">
              {myOrders.length === 0 ? (
                 <div className="account-section-box"><p>No orders found.</p></div>
              ) : (
                myOrders.map(order => (
                  <div key={order.id} className="account-order-item hoverable">
                    <div className="order-main">
                      <span className="order-id-tag">#{order.id}</span>
                      <span className="order-date-text">{order.date} • {order.items} Items</span>
                    </div>
                    <div className="order-status">
                      <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                      <span className="order-amt">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="account-fade-in">
            <div className="account-header">
              <h1>Account Settings</h1>
              <p>Update your personal info and security preferences.</p>
            </div>
            <div className="account-section-box">
              <h3>Profile Information</h3>
              <div className="account-form-grid">
                <div className="form-field"><label>Full Name</label><input type="text" defaultValue="Yash" /></div>
                <div className="form-field"><label>Email Address</label><input type="email" defaultValue="yash@example.com" /></div>
              </div>
              <button className="account-primary-btn">Save Changes</button>
            </div>

            <div className="account-section-box mt-30">
              <div className="section-title-row">
                <h3>Payment Methods</h3>
                <button className="account-add-btn" onClick={() => setShowAddForm(true)}><Plus size={16} /> Add New</button>
              </div>
              <div className="payment-stack">
                {paymentMethods.map(method => (
                  <div key={method.id} className="payment-row">
                    <div className="payment-meta">
                      <div className={`payment-icon-box ${method.type.toLowerCase()}`}>{renderPaymentIcon(method.type)}</div>
                      <div className="payment-details">
                        <p>{method.provider} {method.last4 ? `•••• ${method.last4}` : ''}</p>
                        <span>{method.identifier || `Expires ${method.expiry}`}</span>
                      </div>
                    </div>
                    {method.isDefault && <span className="default-tag">Primary</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="account-page-bg">
      <div className="account-layout">
        <aside className="account-nav-sidebar">
          <div className="user-profile-summary">
            <div className="user-avatar-circle">Y</div>
            <div className="user-text"><h3>Yash</h3><p>Member since 2024</p></div>
          </div>
          <nav className="account-sidebar-links">
            <button className={currentTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}><LayoutDashboard size={18} /> Dashboard</button>
            <button className={currentTab === 'orders' ? 'active' : ''} onClick={() => handleTabChange('orders')}><Package size={18} /> My Orders</button>
            <button className={currentTab === 'settings' ? 'active' : ''} onClick={() => handleTabChange('settings')}><Settings size={18} /> Settings</button>
            <div className="sidebar-divider"></div>
            <button className="logout-btn-sidebar" onClick={handleLogout}><LogOut size={18} /> Sign Out</button>
          </nav>
        </aside>
        <main className="account-view-area">{renderContent()}</main>
      </div>

      <style>{`
        /* Keeping your exact CSS from previous iterations */
        .account-page-bg { background: #fcfcfc; min-height: 100vh; padding: 40px 5%; }
        .account-layout { display: grid; grid-template-columns: 280px 1fr; gap: 50px; max-width: 1400px; margin: 0 auto; }
        .account-nav-sidebar { background: white; border-radius: 24px; padding: 30px 20px; border: 1px solid #f0f0f0; height: fit-content; position: sticky; top: 120px; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
        .user-profile-summary { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; padding: 0 10px; }
        .user-avatar-circle { width: 50px; height: 50px; background: #1a1a1a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1.2rem; }
        .user-text h3 { font-size: 1.1rem; font-weight: 600; margin: 0; }
        .user-text p { font-size: 0.8rem; color: #888; margin: 0; }
        .account-sidebar-links { display: flex; flex-direction: column; gap: 8px; }
        .account-sidebar-links button { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border: none; background: transparent; border-radius: 12px; cursor: pointer; color: #666; font-weight: 500; font-size: 0.95rem; transition: 0.2s; text-align: left; }
        .account-sidebar-links button:hover { background: #f8f8f8; color: #1a1a1a; }
        .account-sidebar-links button.active { background: #1a1a1a; color: white; }
        .sidebar-divider { height: 1px; background: #eee; margin: 10px 0; }
        .logout-btn-sidebar { color: #e74c3c !important; }
        .logout-btn-sidebar:hover { background: #fff1f0 !important; }
        .account-header { margin-bottom: 40px; }
        .account-header h1 { font-size: 2.2rem; font-weight: 400; margin-bottom: 8px; letter-spacing: -1px; }
        .account-header p { color: #888; }
        .account-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .account-stat-card { background: white; padding: 25px; border-radius: 20px; border: 1px solid #f0f0f0; display: flex; align-items: center; gap: 20px; }
        .stat-icon-wrapper { width: 50px; height: 50px; background: #f8f3f0; color: #c5a992; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .stat-label { display: block; font-size: 0.8rem; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .stat-value { font-size: 1.4rem; font-weight: 600; }
        .account-section-box { background: white; padding: 30px; border-radius: 24px; border: 1px solid #f0f0f0; }
        .section-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .section-title-row h2, .section-title-row h3 { font-size: 1.2rem; font-weight: 600; margin: 0; }
        .account-text-btn { background: none; border: none; color: #c5a992; font-weight: 600; cursor: pointer; }
        .account-order-item { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-radius: 16px; border: 1px solid #f8f8f8; background: #fafafa; margin-bottom: 12px; }
        .account-order-item.hoverable:hover { transform: translateY(-2px); border-color: #eee; background: white; box-shadow: 0 5px 15px rgba(0,0,0,0.02); cursor: pointer; }
        .order-id-tag { display: block; font-weight: 600; margin-bottom: 4px; }
        .order-date-text { font-size: 0.85rem; color: #888; }
        .order-status { text-align: right; }
        .order-amt { display: block; font-weight: 600; margin-top: 6px; }
        .status-pill { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 5px 12px; border-radius: 50px; }
        .status-pill.processing { background: #fff4e5; color: #ff9800; }
        .status-pill.delivered { background: #e8f5e9; color: #2e7d32; }
        .account-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
        .form-field { display: flex; flex-direction: column; gap: 8px; }
        .form-field label { font-size: 0.85rem; font-weight: 600; color: #555; }
        .form-field input { padding: 14px; border-radius: 12px; border: 1px solid #eee; background: #fafafa; outline: none; transition: 0.2s; }
        .form-field input:focus { border-color: #c5a992; background: white; }
        .account-primary-btn { padding: 14px 30px; background: #1a1a1a; color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; }
        .payment-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #f8f8f8; }
        .payment-meta { display: flex; align-items: center; gap: 15px; }
        .payment-icon-box { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; color: #555; }
        .payment-details p { font-size: 0.95rem; font-weight: 600; margin: 0; }
        .payment-details span { font-size: 0.8rem; color: #888; }
        .default-tag { font-size: 0.7rem; background: #f0f0f0; padding: 4px 10px; border-radius: 4px; font-weight: 600; color: #666; }
        .mt-30 { margin-top: 30px; }
        .account-fade-in { animation: accFadeIn 0.5s ease-out; }
        @keyframes accFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 1000px) { .account-layout { grid-template-columns: 1fr; } .account-nav-sidebar { position: static; } .account-form-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Account;