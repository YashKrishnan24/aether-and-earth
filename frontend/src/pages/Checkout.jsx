import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import { CheckCircle, CreditCard, Lock, Loader2 } from 'lucide-react';

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0) || 0;

  
  useEffect(() => {
    const timer = setTimeout(() => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      if (!isAuthenticated) {
        
        navigate('/login', { state: { from: '/checkout' } });
      } else {
        setIsVerifyingAuth(false); 
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [navigate]);

  
  const [cardNumber, setCardNumber] = useState('');
  const [cardBrand, setCardBrand] = useState('unknown');

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('4')) setCardBrand('visa');
    else if (value.startsWith('5')) setCardBrand('mastercard');
    else setCardBrand('unknown');
    let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
    setCardNumber(formattedValue);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: cartItems.length,
        total: totalAmount,
        status: 'Processing'
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
      localStorage.setItem('myOrders', JSON.stringify([newOrder, ...existingOrders]));

      dispatch(clearCart());
      window.scrollTo(0, 0);
    }, 2000);
  };

  if (isVerifyingAuth) {
    return (
      <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <Loader2 className="spinner" size={40} color="#c5a992" />
        <p style={{ color: '#888', letterSpacing: '1px' }}>SECURE REDIRECT...</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="success-container fade-in">
        <div className="success-icon-wrapper"><CheckCircle size={80} color="#2e7d32" strokeWidth={1.5} /></div>
        <h2>Payment Successful</h2>
        <p>Your order has been placed successfully.</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
            <Link to="/shop"><button className="stripe-pay-btn" style={{ width: 'auto', background: '#fff', color: '#1a1a1a', border: '1px solid #1a1a1a' }}>Continue Shopping</button></Link>
            <Link to="/account?tab=orders"><button className="stripe-pay-btn" style={{ width: 'auto', marginTop: 0 }}>View Order Dashboard</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container fade-in">
      <div className="checkout-header text-center">
        <h1>Secure Checkout</h1>
        <p><Lock size={14} style={{ display: 'inline', marginBottom: '-2px' }} /> SSL Encrypted Payment</p>
      </div>

      <div className="checkout-main-grid">
        <form className="checkout-form" onSubmit={handlePayment}>
          <div className="form-section">
            <h3 className="section-title">Shipping Details</h3>
            <div className="input-grid">
              <input type="text" placeholder="First Name" className="stripe-input" required />
              <input type="text" placeholder="Last Name" className="stripe-input" required />
              <input type="text" placeholder="Street Address" className="stripe-input full-width" required />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Payment Information</h3>
            <div className="stripe-card-element">
              <div className="stripe-input-row border-bottom">
                <CreditCard size={20} className={`brand-icon ${cardBrand}`} color="#888" />
                <input type="text" placeholder="Card number" value={cardNumber} onChange={handleCardNumberChange} className="stripe-input-naked" required />
              </div>
              <div className="stripe-input-row split-row">
                <input type="text" placeholder="MM / YY" className="stripe-input-naked border-right" required />
                <input type="password" placeholder="CVC" className="stripe-input-naked cvc-input" required />
              </div>
            </div>
          </div>
          
          <button type="submit" className={`stripe-pay-btn ${isProcessing ? 'processing' : ''}`} disabled={isProcessing || cartItems.length === 0}>
            {isProcessing ? <Loader2 className="spinner" size={20} /> : `Pay $${totalAmount.toFixed(2)}`}
          </button>
        </form>
        
        <aside className="checkout-sidebar">
          <div className="order-summary-box">
            <h3>Order Summary</h3>
            {cartItems.length === 0 ? <p>Your cart is empty.</p> : cartItems.map((item, index) => (
              <div key={index} className="summary-item">
                <span className="item-name">{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="totals-row grand-total">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .checkout-container { padding: 40px 5%; max-width: 1200px; margin: 0 auto; min-height: 80vh; }
        .success-container { text-align: center; padding: 100px 20px; }
        .success-icon-wrapper { margin-bottom: 20px; display: flex; justify-content: center; }
        .checkout-main-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 60px; margin-top: 40px; }
        .section-title { font-size: 1.1rem; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .full-width { grid-column: span 2; }
        .stripe-input { width: 100%; padding: 14px; border: 1px solid #e6e6e6; border-radius: 8px; outline: none; font-family: inherit; }
        .stripe-input:focus { border-color: #1a1a1a; }
        .form-section { margin-bottom: 40px; }
        .stripe-card-element { border: 1px solid #e6e6e6; border-radius: 8px; overflow: hidden; background: white; }
        .stripe-input-row { display: flex; align-items: center; padding: 0 15px; }
        .stripe-input-naked { flex: 1; border: none; padding: 16px; outline: none; font-family: inherit; }
        .border-bottom { border-bottom: 1px solid #e6e6e6; }
        .border-right { border-right: 1px solid #e6e6e6; }
        .stripe-pay-btn { width: 100%; padding: 16px; background: #1a1a1a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: 0.3s; }
        .stripe-pay-btn:hover:not(:disabled) { background: #c5a992; }
        .stripe-pay-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .order-summary-box { background: #fafafa; padding: 30px; border-radius: 16px; border: 1px solid #eee; position: sticky; top: 100px; }
        .summary-item { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 0.95rem; color: #555; }
        .grand-total { border-top: 1px solid #ddd; padding-top: 20px; margin-top: 10px; font-weight: 700; font-size: 1.2rem; color: #1a1a1a; display: flex; justify-content: space-between; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 900px) { .checkout-main-grid { grid-template-columns: 1fr; } .input-grid { grid-template-columns: 1fr; } .full-width { grid-column: span 1; } }
      `}</style>
    </div>
  );
};

export default Checkout;