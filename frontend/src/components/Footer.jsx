//footer component
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        
        <div className="footer-left">
          <div className="brand-section">
            <h2>AETHER & EARTH</h2>
          </div>

          <div className="newsletter-section">
            <h3>Newsletter</h3>
            <p>Subscribe to the newsletter and receive information about promotions and new arrivals</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <Mail size={18} className="mail-icon" />
              <input type="email" placeholder="email@example.com" required />
              <button type="submit" aria-label="Subscribe">
                <ArrowUpRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="footer-links-grid">
          
          <div className="link-column">
            <div className="link-group">
              <h4>Customer service</h4>
              <ul>
                <li><Link to="#">Follow your order/return</Link></li>
                <li><Link to="#">FAQ</Link></li>
                <li><Link to="#">Orders</Link></li>
                <li><Link to="#">Deliveries</Link></li>
                <li><Link to="#">Payments</Link></li>
                <li><Link to="#">Return and refunds</Link></li>
                <li><Link to="#">Contact us</Link></li>
              </ul>
            </div>
            
            <div className="link-group">
              <h4>About us</h4>
              <ul>
                <li><Link to="#">Company</Link></li>
                <li><Link to="#">Careers</Link></li>
                <li><Link to="#">Student & Graduate Discounts</Link></li>
              </ul>
            </div>
          </div>

          <div className="link-column">
            <div className="link-group">
              <h4>Product guide</h4>
              <ul>
                <li><Link to="#">Size guide</Link></li>
                <li><Link to="#">Style guide</Link></li>
                <li><Link to="#">Summer style guide</Link></li>
                <li><Link to="#">Fabrics</Link></li>
                <li><Link to="#">Care</Link></li>
              </ul>
            </div>

            <div className="link-group">
              <h4>Legal area</h4>
              <ul>
                <li><Link to="#">Privacy policy</Link></li>
                <li><Link to="#">Conditions of use</Link></li>
                <li><Link to="#">Conditions of sale</Link></li>
                <li><Link to="#">Information on reviews</Link></li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <p>AETHER & EARTH INC. 350 5TH AVENUE, 41ST FL – NY, NY 10118</p>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: #fdfdfd;
          border-top: 1px solid #eaeaea;
          padding: 80px 5% 30px;
          margin-top: auto;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 80px;
        }

        .footer-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand-section h2 {
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -1px;
          margin-bottom: 15px;
          color: var(--text-dark);
        }

        .social-icons {
          display: flex;
          gap: 15px;
          margin-bottom: 60px;
        }

        .social-icons a {
          color: var(--text-dark);
          transition: color 0.3s ease;
        }

        .social-icons a:hover {
          color: var(--accent-sand);
        }

        .newsletter-section h3 {
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 15px;
          color: var(--text-dark);
        }

        .newsletter-section p {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.5;
          margin-bottom: 25px;
          max-width: 350px;
        }

        .newsletter-form {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #333;
          padding-bottom: 10px;
          max-width: 400px;
        }

        .mail-icon {
          color: #666;
          margin-right: 15px;
        }

        .newsletter-form input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 1rem;
          color: var(--text-dark);
        }

        .newsletter-form input::placeholder {
          color: #999;
        }

        .newsletter-form button {
          background: var(--text-dark);
          color: white;
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .newsletter-form button:hover {
          background: var(--accent-sand);
          transform: scale(1.05);
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .link-column {
          display: flex;
          flex-direction: column;
          gap: 50px;
        }

        .link-group h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 20px;
        }

        .link-group ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .link-group a {
          text-decoration: none;
          color: #777;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .link-group a:hover {
          color: var(--accent-sand);
        }

        .footer-bottom {
          margin-top: 80px;
          padding-top: 30px;
          border-top: 1px solid #eaeaea;
          text-align: center;
        }

        .footer-bottom p {
          font-size: 0.75rem;
          color: #999;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 60px;
          }
          .footer-links-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;