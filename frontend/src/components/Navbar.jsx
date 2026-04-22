import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Search, ShoppingCart, User, ChevronDown, ArrowRight, Package, Settings, Heart, LogOut } from 'lucide-react';

const Navbar = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isBumping, setIsBumping] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const fetchProductsForSearch = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setAllProducts(data);
      } catch (error) {
        console.error("Error fetching products for search:", error);
      }
    };
    fetchProductsForSearch();
  }, []);

  const liveSearchResults = searchTerm.trim() === '' 
    ? [] 
    : allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 4);

  useEffect(() => {
    if (cartItems.length === 0) return;
    setIsBumping(true);
    const timer = setTimeout(() => setIsBumping(false), 300);
    return () => clearTimeout(timer);
  }, [cartItems]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${searchTerm}`);
      setIsSearchFocused(false);
    }
  };

  const handleResultClick = (productName) => {
    setSearchTerm('');
    navigate(`/shop?search=${productName}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar glass-nav">
      <div className="nav-container">
        
        <div className="nav-left">
          <Link to="/" className="brand-logo">
            <img src="/logo.png" alt="A&E Logo" className="logo-img" onError={(e) => e.target.style.display='none'} />
            <span>Aether & Earth</span>
          </Link>
          
          <div className="nav-links">
            <div className="dropdown-wrapper">
              <Link to="/collections" className={`nav-item ${isActive('/collections') ? 'active' : ''}`}>
                <span>Categories</span>
                <ChevronDown size={14} className="dropdown-icon" />
              </Link>
              
              <div className="dropdown-menu">
                <div className="dropdown-content">
                  <Link to="/category/Men" className="drop-item">
                    <div className="drop-text"><h4>Men</h4><p>Modern tailored essentials</p></div>
                    <ArrowRight size={16} className="drop-arrow" />
                  </Link>
                  <Link to="/category/Women" className="drop-item">
                    <div className="drop-text"><h4>Women</h4><p>Elevated everyday classics</p></div>
                    <ArrowRight size={16} className="drop-arrow" />
                  </Link>
                  <Link to="/category/Accessories" className="drop-item">
                    <div className="drop-text"><h4>Accessories</h4><p>The perfect finishing touches</p></div>
                    <ArrowRight size={16} className="drop-arrow" />
                  </Link>
                  <Link to="/category/Kids" className="drop-item">
                    <div className="drop-text"><h4>Kids</h4><p>Playful comfort for little ones</p></div>
                    <ArrowRight size={16} className="drop-arrow" />
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/shop" className={`nav-item ${isActive('/shop') ? 'active' : ''}`}><span>Shop All</span></Link>
            <Link to="/deals" className={`nav-item ${isActive('/deals') ? 'active' : ''}`}><span>Deals</span></Link>
          </div>
        </div>

        <div className="search-wrapper">
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search Product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            <button type="submit" className="search-btn"><Search size={18} /></button>
          </form>

          {isSearchFocused && searchTerm.trim() !== '' && (
            <div className="live-search-dropdown fade-in">
              {liveSearchResults.length > 0 ? (
                liveSearchResults.map(item => (
                  <div key={item._id} className="live-result-item" onClick={() => handleResultClick(item.name)}>
                    <img src={item.image} alt={item.name} />
                    <div className="result-info">
                      <h4>{item.name}</h4>
                      <p className="result-cat">{item.category}</p>
                    </div>
                    <p className="result-price">${item.price.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <div className="no-results"><p>No results found for "{searchTerm}"</p></div>
              )}
              {liveSearchResults.length > 0 && (
                <div className="view-all-link" onClick={handleSearchSubmit}>
                  View all results for "{searchTerm}" <ArrowRight size={14} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="nav-actions">
          
          <div className="dropdown-wrapper account-dropdown-wrapper">
            <Link to="/account" className={`action-btn ${isActive('/account') ? 'active' : ''}`}>
              <User size={20} strokeWidth={1.5} />
              <span>Account</span>
            </Link>
            
            <div className="dropdown-menu account-menu">
              <div className="dropdown-content mini-dashboard">
                <div className="mini-profile-header">
                  <div className="mini-avatar">Y</div>
                  <div className="mini-user-info">
                    <p className="mini-name">Yash</p>
                    <p className="mini-points">1,250 Aether Points</p>
                  </div>
                </div>
                
<div className="mini-dashboard-links">
  <Link to="/account?tab=orders" className="mini-link">
    <Package size={16}/> My Orders
  </Link>
  
  <Link to="/account?tab=settings" className="mini-link">
    <Settings size={16}/> Settings
  </Link>
</div>
                <div className="mini-dashboard-footer">
                  <Link to="/login" className="mini-link logout-link"><LogOut size={16}/> Sign Out</Link>
                </div>
              </div>
            </div>
          </div>
          
          <Link to="/checkout" className="action-btn cart-btn">
            <div className={`cart-icon-wrapper ${isBumping ? 'bump' : ''}`}>
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartItems.length > 0 && (
                <span className="cart-badge-pulse">{cartItems.length}</span>
              )}
            </div>
            <span>Cart</span>
          </Link>
        </div>
      </div>

      <style>{`
        .navbar { position: fixed; top: 0; width: 100%; height: 80px; z-index: 1000; display: flex; align-items: center; background: rgba(255, 255, 255, 0.90); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.05); transition: all 0.3s ease; }
        .nav-container { width: 95%; max-width: 1500px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .nav-left { display: flex; align-items: center; gap: 40px; }
        .brand-logo { display: flex; align-items: center; gap: 10px; font-size: 1.3rem; font-weight: 700; text-decoration: none; color: var(--text-dark); letter-spacing: -0.5px; text-transform: uppercase; }
        .logo-img { height: 30px; width: auto; object-fit: contain; }

        .nav-links { display: flex; align-items: center; gap: 30px; height: 80px; }
        .nav-item { display: flex; align-items: center; gap: 6px; text-decoration: none; color: #444; font-weight: 500; font-size: 0.95rem; transition: color 0.3s ease; height: 100%; cursor: pointer; }
        .dropdown-icon { margin-top: 2px; color: #888; transition: transform 0.3s ease; }
        .nav-item:hover, .nav-item.active { color: var(--accent-sand); }
        
        .dropdown-wrapper { position: relative; height: 100%; display: flex; align-items: center; }
        .dropdown-wrapper:hover .dropdown-icon { transform: rotate(180deg); color: var(--accent-sand); }
        .dropdown-menu { position: absolute; top: 80px; left: -20px; opacity: 0; visibility: hidden; transform: translateY(15px); transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1); padding-top: 10px; }
        .dropdown-wrapper:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-content { background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(20px); border: 1px solid rgba(0,0,0,0.06); border-radius: 16px; padding: 12px; width: 320px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); display: flex; flex-direction: column; gap: 5px; }

        .drop-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-radius: 12px; text-decoration: none; color: var(--text-dark); transition: all 0.2s ease; background: transparent; }
        .drop-item:hover { background: #f8f8f8; transform: translateX(5px); }
        .drop-text h4 { font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; }
        .drop-text p { font-size: 0.8rem; color: #888; }
        .drop-arrow { color: var(--accent-sand); opacity: 0; transform: translateX(-10px); transition: all 0.3s ease; }
        .drop-item:hover .drop-arrow { opacity: 1; transform: translateX(0); }

        .search-wrapper { flex: 1; max-width: 400px; margin-right: 20px; position: relative; }
        .search-bar { display: flex; align-items: center; background: #f5f5f5; padding: 8px 15px 8px 20px; border-radius: 50px; width: 100%; transition: all 0.3s ease; border: 1px solid transparent; }
        .search-bar:focus-within { background: white; border-color: var(--accent-sand); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .search-bar input { border: none; background: transparent; outline: none; width: 100%; font-size: 0.9rem; color: var(--text-dark); }
        .search-btn { background: transparent; border: none; cursor: pointer; color: #666; display: flex; align-items: center; padding: 5px; transition: 0.2s; }
        .search-btn:hover { color: var(--accent-sand); }
        .live-search-dropdown { position: absolute; top: calc(100% + 15px); left: 0; width: 100%; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(15px); border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); overflow: hidden; z-index: 2000; }
        .live-result-item { display: flex; align-items: center; gap: 15px; padding: 12px 20px; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #f0f0f0; }
        .live-result-item:hover { background: #f9f9f9; }
        .live-result-item img { width: 40px; height: 50px; object-fit: cover; border-radius: 6px; background: #eee; }
        .result-info { flex: 1; }
        .result-info h4 { font-size: 0.9rem; font-weight: 500; color: var(--text-dark); margin-bottom: 3px; }
        .result-cat { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
        .result-price { font-weight: 600; font-size: 0.9rem; color: var(--text-dark); }
        .no-results { padding: 20px; text-align: center; color: #888; font-size: 0.9rem; }
        .view-all-link { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #fafafa; font-size: 0.85rem; font-weight: 500; color: var(--text-dark); cursor: pointer; transition: 0.2s; }
        .view-all-link:hover { color: var(--accent-sand); background: white; }

        .nav-actions { display: flex; align-items: center; gap: 30px; height: 80px; }
        .action-btn { display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--text-dark); font-weight: 500; font-size: 0.95rem; transition: color 0.2s ease; height: 100%; }
        .action-btn:hover, .action-btn.active { color: var(--accent-sand); }
        .cart-icon-wrapper { position: relative; display: flex; align-items: center; transition: transform 0.2s; }
        .cart-icon-wrapper.bump { transform: scale(1.2); }
        .cart-badge-pulse { position: absolute; top: -8px; right: -10px; background: var(--text-dark); color: white; font-size: 0.65rem; min-width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; }

        .account-menu {
          left: auto; /* Align to the right side of the screen */
          right: -20px;
        }
        .mini-dashboard {
          width: 280px;
          padding: 0; /* Remove default padding for custom sections */
          overflow: hidden;
        }
        .mini-profile-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: #fdfdfd;
          border-bottom: 1px solid #f0f0f0;
        }
        .mini-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: var(--text-dark);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.2rem;
        }
        .mini-name {
          font-weight: 600;
          color: var(--text-dark);
          font-size: 1rem;
          margin-bottom: 2px;
        }
        .mini-points {
          font-size: 0.75rem;
          color: var(--accent-sand);
          font-weight: 500;
        }
        .mini-dashboard-links {
          padding: 10px;
          display: flex;
          flex-direction: column;
        }
        .mini-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          text-decoration: none;
          color: #555;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 8px;
          transition: 0.2s;
        }
        .mini-link:hover {
          background: #f5f5f5;
          color: var(--text-dark);
          transform: translateX(3px);
        }
        .mini-dashboard-footer {
          padding: 10px;
          border-top: 1px solid #f0f0f0;
          background: #fafafa;
        }
        .logout-link {
          color: #e74c3c;
        }
        .logout-link:hover {
          background: #fdf0ef;
          color: #c0392b;
        }

        .fade-in { animation: dropDown 0.2s ease-out forwards; opacity: 0; transform: translateY(-10px); }
        @keyframes dropDown { to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1000px) {
          .nav-links, .action-btn span { display: none; }
          .search-wrapper { max-width: 100%; justify-content: center; margin: 0 10px; }
          .account-dropdown-wrapper .dropdown-menu { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;