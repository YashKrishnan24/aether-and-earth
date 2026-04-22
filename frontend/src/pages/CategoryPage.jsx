import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Plus } from 'lucide-react';

const CategoryPage = () => {
  const { categoryName } = useParams(); 
  const dispatch = useDispatch();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const categoryData = {
    Men: {
      title: "Men's Collection",
      subtitle: "Modern tailored essentials for the modern architect.",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2000"
    },
    Women: {
      title: "Women's Collection",
      subtitle: "Elevated everyday classics with an architectural edge.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000"
    },
    Kids: {
      title: "Kids' Collection",
      subtitle: "Playful, durable comfort for little ones.",
      image: "https://static.vecteezy.com/system/resources/previews/026/911/393/non_2x/fashion-model-kids-free-photo.jpg"
    },
    Accessories: {
      title: "Accessories",
      subtitle: "The perfect finishing touches to elevate any look.",
      image: "https://effortlessgent.com/wp-content/uploads/2023/03/feat-cool-mens-accessories.jpg"
    }
  };

  
  const currentCategory = categoryData[categoryName] || {
    title: categoryName,
    subtitle: "Explore our curated selection.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000"
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        
        const filtered = data.filter(p => p.category === categoryName);
        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };
    
    fetchProducts();
    
    window.scrollTo(0, 0); 
  }, [categoryName]);

  return (
    <div className="category-page-wrapper">
      
      {/* Cinematic Hero Section */}
      <section 
        className="category-hero" 
        style={{ backgroundImage: `url(${currentCategory.image})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{currentCategory.title}</h1>
            <p>{currentCategory.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="category-products">
        <header className="section-header">
          <h2>Latest Arrivals</h2>
          <p>{products.length} Items</p>
        </header>

        {loading ? (
          <div className="loading-state">Curating collection...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">New items arriving soon.</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card fade-in-up">
                <div className="product-image-wrapper">
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
                    <p>{product.type}</p>
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
        .category-page-wrapper {
          min-height: 100vh;
          animation: fadeIn 0.5s ease;
        }

        /* Hero Parallax Styling */
        .category-hero {
          height: 60vh;
          min-height: 400px;
          background-size: cover;
          background-position: center;
          background-attachment: fixed; /* Creates the premium parallax effect */
          position: relative;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 20px;
        }

        .hero-content {
          color: white;
          max-width: 800px;
          animation: slideUp 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .hero-content h1 {
          font-size: 4rem;
          font-weight: 300;
          margin-bottom: 15px;
          letter-spacing: -1px;
        }

        .hero-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          font-weight: 300;
        }

        /* Products Layout */
        .category-products {
          padding: 80px 5%;
          max-width: 1500px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 50px;
          border-bottom: 1px solid #eee;
          padding-bottom: 20px;
        }

        .section-header h2 {
          font-size: 2rem;
          font-weight: 400;
        }

        .section-header p {
          color: #888;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 100px 0;
          color: #888;
          font-size: 1.2rem;
        }

        /* Product Card Grid (Preserving existing luxury style) */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 40px;
        }

        .product-card { cursor: pointer; }
        
        .product-image-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-md);
          aspect-ratio: 3/4;
          background: #eee;
        }

        .product-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .product-card:hover img { transform: scale(1.08); }

        .quick-add {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(100px);
          opacity: 0;
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          cursor: pointer;
          color: var(--text-dark);
        }

        .product-card:hover .quick-add {
          transform: translateY(0);
          opacity: 1;
        }

        .quick-add:hover {
          background: var(--text-dark);
          color: white;
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .meta-left h4 { font-size: 1.1rem; font-weight: 500; }
        .meta-left p { color: #888; font-size: 0.9rem; margin-top: 4px; }
        .price { font-weight: 600; font-size: 1.1rem; }

        /* Animations */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        
        .fade-in-up {
          animation: slideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        /* Stagger the grid animations slightly */
        .product-card:nth-child(1) { animation-delay: 0.1s; }
        .product-card:nth-child(2) { animation-delay: 0.2s; }
        .product-card:nth-child(3) { animation-delay: 0.3s; }
        .product-card:nth-child(4) { animation-delay: 0.4s; }

        @media (max-width: 768px) {
          .hero-content h1 { font-size: 2.5rem; }
          .category-hero { background-attachment: scroll; /* Disable parallax on mobile for performance */ }
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;