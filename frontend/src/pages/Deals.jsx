import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Plus, Tag, Clock } from 'lucide-react';

const Deals = () => {
  const dispatch = useDispatch();
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else { minutes = 59; hours--; }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        
        
        const discountedItems = data.slice(0, 8).map(item => ({
          ...item,
          originalPrice: item.price,
          price: item.price * 0.70 
        }));
        
        setSaleItems(discountedItems);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };
    
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="deals-page-wrapper">
      
      {/* High-Impact Hero Section */}
      <section className="deals-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="sale-badge">
              <Tag size={16} /> Seasonal Event
            </div>
            <h1>The Archive Sale</h1>
            <p>Up to 30% off selected minimalist essentials. Limited time only.</p>
            
            {/* Live Countdown Timer */}
            <div className="countdown-timer">
              <Clock size={20} className="clock-icon" />
              <div className="time-block">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span><label>HRS</label>
              </div>
              <span className="colon">:</span>
              <div className="time-block">
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span><label>MIN</label>
              </div>
              <span className="colon">:</span>
              <div className="time-block">
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span><label>SEC</label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Product Grid */}
      <section className="deals-products">
        <header className="section-header">
          <h2>Curated Markdowns</h2>
          <p>{saleItems.length} Exclusive Offers</p>
        </header>

        {loading ? (
          <div className="loading-state">Unlocking discounts...</div>
        ) : (
          <div className="product-grid">
            {saleItems.map((product) => (
              <div key={product._id} className="product-card fade-in-up">
                <div className="product-image-wrapper">
                  <div className="discount-tag">-30%</div>
                  <img src={product.image} alt={product.name} />
                  <button 
                    className="quick-add"
                    onClick={() => dispatch(addToCart({...product, id: product._id}))}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="product-meta">
                  <div className="meta-left">
                    <h4>{product.name}</h4>
                    <p>{product.category}</p>
                  </div>
                  <div className="meta-right price-block">
                    <p className="original-price">${product.originalPrice.toFixed(2)}</p>
                    <p className="sale-price">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .deals-page-wrapper {
          min-height: 100vh;
          animation: fadeIn 0.5s ease;
        }

        /* Dark Premium Hero */
        .deals-hero {
          height: 65vh;
          min-height: 450px;
          background-image: url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(20, 20, 20, 0.9) 0%, rgba(20, 20, 20, 0.6) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 20px;
        }

        .hero-content {
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: slideUp 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .sale-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 25px;
          backdrop-filter: blur(5px);
        }

        .hero-content h1 {
          font-size: 4.5rem;
          font-weight: 300;
          margin-bottom: 15px;
          letter-spacing: -2px;
          color: #fff;
        }

        .hero-content p {
          font-size: 1.2rem;
          color: #ccc;
          margin-bottom: 40px;
        }

        /* Countdown Timer */
        .countdown-timer {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(0, 0, 0, 0.4);
          padding: 15px 30px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }

        .clock-icon { color: var(--accent-sand); margin-right: 10px; }

        .time-block { display: flex; flex-direction: column; align-items: center; min-width: 45px; }
        .time-block span { font-size: 1.8rem; font-weight: 600; line-height: 1; }
        .time-block label { font-size: 0.7rem; color: var(--accent-sand); margin-top: 5px; letter-spacing: 1px; }
        .colon { font-size: 1.5rem; font-weight: 300; opacity: 0.5; margin: 0 -5px; padding-bottom: 15px; }

        /* Products Grid */
        .deals-products { padding: 80px 5%; max-width: 1500px; margin: 0 auto; }
        
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .section-header h2 { font-size: 2rem; font-weight: 400; color: #b71c1c; /* Deep red for sale */ }
        .section-header p { color: #888; }

        .loading-state { text-align: center; padding: 100px 0; color: #888; font-size: 1.2rem; }

        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 40px; }
        .product-card { cursor: pointer; }
        
        .product-image-wrapper { position: relative; overflow: hidden; border-radius: var(--radius-md); aspect-ratio: 3/4; background: #eee; }
        
        /* The Red Sale Tag */
        .discount-tag { position: absolute; top: 15px; left: 15px; background: #b71c1c; color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; z-index: 10; letter-spacing: 1px; }

        .product-image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1); }
        .product-card:hover img { transform: scale(1.08); }

        .quick-add { position: absolute; bottom: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background: white; border: none; display: flex; align-items: center; justify-content: center; transform: translateY(100px); opacity: 0; transition: 0.4s; box-shadow: 0 10px 20px rgba(0,0,0,0.1); cursor: pointer; color: var(--text-dark); }
        .product-card:hover .quick-add { transform: translateY(0); opacity: 1; }
        .quick-add:hover { background: var(--text-dark); color: white; }

        .product-meta { display: flex; justify-content: space-between; margin-top: 20px; }
        .meta-left h4 { font-size: 1.1rem; font-weight: 500; }
        .meta-left p { color: #888; font-size: 0.9rem; margin-top: 4px; }
        
        /* Pricing Styling for Sales */
        .price-block { text-align: right; }
        .original-price { font-size: 0.9rem; color: #999; text-decoration: line-through; margin-bottom: 2px; }
        .sale-price { font-weight: 600; font-size: 1.15rem; color: #b71c1c; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        .fade-in-up { animation: slideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }

        @media (max-width: 768px) {
          .hero-content h1 { font-size: 3rem; text-align: center; }
          .countdown-timer { padding: 12px 20px; gap: 10px; }
          .deals-hero { background-attachment: scroll; }
        }
      `}</style>
    </div>
  );
};

export default Deals;