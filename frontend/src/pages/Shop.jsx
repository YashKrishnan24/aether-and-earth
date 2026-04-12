import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Plus, SlidersHorizontal, Search, Loader2 } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  // Read URL Parameters (Syncs with Navbar and Categories)
  const urlCategory = searchParams.get('category') || 'All';
  const urlSearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetching from your updated MongoDB backend
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };
    
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  // Update URL when a category pill is clicked
  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  // Improved Filter Engine
  let displayedProducts = products.filter(product => {
    const matchesCategory = urlCategory === 'All' || product.category === urlCategory;
    
    // Checks name, category, and type for better search precision
    const searchTerm = urlSearch.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm) || 
      (product.type && product.type.toLowerCase().includes(searchTerm)) ||
      product.category.toLowerCase().includes(searchTerm);
      
    return matchesCategory && matchesSearch;
  });

  // Sorting Logic
  if (sortBy === 'price-asc') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    displayedProducts.sort((a, b) => b.price - a.price);
  }

  const categories = ['All', 'Men', 'Women', 'Accessories', 'Kids'];

  return (
    <div className="shop-all-wrapper">
      
      {/* Cinematic Hero Section */}
      <section className="shop-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="shop-tag">Aether & Earth</span>
            <h1>{urlSearch ? `Results for "${urlSearch}"` : urlCategory !== 'All' ? `${urlCategory} Collection` : 'The Archive'}</h1>
            <p>Meticulously crafted essentials for the modern wardrobe.</p>
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky-filter-bar">
        <div className="filter-container">
          
          <div className="category-pills">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`pill ${urlCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sort-controls">
            <SlidersHorizontal size={16} className="sort-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-dropdown"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Product Grid Section */}
      <section className="shop-products">
        {loading ? (
          <div className="loading-state">
            <Loader2 className="spinner" size={32} />
            <p>Curating collection...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="empty-state fade-in">
            <Search size={40} color="#ccc" style={{ marginBottom: '15px' }} />
            <h3>No items found</h3>
            <p>We couldn't find anything matching your search in the {urlCategory} collection.</p>
            <button className="clear-btn" onClick={() => navigate('/shop')}>Show All Products</button>
          </div>
        ) : (
          <div className="product-grid">
            {displayedProducts.map((product) => (
              <div key={product._id} className="product-card fade-in-up">
                <div className="product-image-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800";
                    }}
                  />
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
                    <p>{product.category} {product.type && `• ${product.type}`}</p>
                  </div>
                  <div className="meta-right">
                    <p className="price">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .shop-all-wrapper { min-height: 100vh; animation: fadeIn 0.5s ease; background: #fff; }

        .shop-hero {
          height: 45vh;
          min-height: 350px;
          background-image: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000');
          background-size: cover;
          background-position: center 60%;
          background-attachment: fixed;
          position: relative;
        }

        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%);
          display: flex; align-items: center; justify-content: center; text-align: center;
        }

        .hero-content { color: white; transform: translateY(20px); opacity: 0; animation: slideUp 0.8s ease forwards; }
        .shop-tag { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 4px; color: #c5a992; font-weight: 600; display: block; margin-bottom: 10px; }
        .hero-content h1 { font-size: 3.5rem; font-weight: 300; margin-bottom: 15px; letter-spacing: -1px; }

        .sticky-filter-bar {
          position: sticky; top: 80px; z-index: 900;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid #f0f0f0;
          padding: 15px 0;
        }

        .filter-container { width: 95%; max-width: 1500px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .category-pills { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; }
        .category-pills::-webkit-scrollbar { display: none; }

        .pill {
          padding: 8px 24px; border-radius: 50px; border: 1px solid #eee;
          background: transparent; font-size: 0.9rem; cursor: pointer;
          transition: 0.3s; font-weight: 500; color: #666; white-space: nowrap;
        }
        .pill.active { background: #1a1a1a; color: white; border-color: #1a1a1a; }

        .sort-controls { display: flex; align-items: center; gap: 10px; background: #f8f8f8; padding: 8px 18px; border-radius: 50px; }
        .sort-dropdown { border: none; background: transparent; font-size: 0.9rem; font-weight: 500; outline: none; cursor: pointer; }

        .shop-products { padding: 60px 5%; max-width: 1500px; margin: 0 auto; }
        .loading-state { text-align: center; padding: 100px 0; display: flex; flex-direction: column; align-items: center; gap: 15px; color: #888; }
        .spinner { animation: rotate 1s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 40px; }
        .product-image-wrapper { position: relative; overflow: hidden; border-radius: 16px; aspect-ratio: 3/4; background: #f9f9f9; }
        .product-image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s; }
        .product-card:hover img { transform: scale(1.08); }

        .quick-add {
          position: absolute; bottom: 20px; right: 20px;
          width: 50px; height: 50px; border-radius: 50%;
          background: white; border: none; display: flex;
          align-items: center; justify-content: center;
          transform: translateY(100px); opacity: 0;
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          cursor: pointer;
        }
        .product-card:hover .quick-add { transform: translateY(0); opacity: 1; }
        .quick-add:hover { background: #1a1a1a; color: white; }

        .product-meta { display: flex; justify-content: space-between; margin-top: 20px; }
        .meta-left h4 { font-size: 1.1rem; font-weight: 500; }
        .meta-left p { color: #888; font-size: 0.85rem; margin-top: 4px; }
        .price { font-weight: 600; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        .fade-in-up { animation: slideUp 0.6s ease forwards; opacity: 0; transform: translateY(20px); }

        @media (max-width: 768px) {
          .hero-content h1 { font-size: 2.5rem; }
          .filter-container { flex-direction: column; align-items: flex-start; gap: 15px; }
        }
      `}</style>
    </div>
  );
};

export default Shop;