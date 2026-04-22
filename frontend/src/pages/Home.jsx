import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Plus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('All');
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);

  
  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070",
      tag: "Summer Collection 2026",
      title: "Elegance in \nEvery Thread",
      subtitle: "A curated collection of minimalist essentials designed for the modern architect of life."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
      tag: "New Arrivals",
      title: "The Archive \nCollection",
      subtitle: "Discover timeless pieces crafted with sustainable fabrics and uncompromising quality."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070",
      tag: "Accessories Focus",
      title: "Details \nThat Matter",
      subtitle: "Elevate your everyday aesthetic with our newly expanded line of premium leather goods."
    }
  ];

  
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1);
  };

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        
        const response = await axios.get('http://localhost:5000/api/products');
        console.log("Database Sync Successful. Items loaded:", response.data.length);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products from MongoDB:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="home-wrapper">
      
      {/* Dynamic Carousel Hero Section */}
      <section className="hero-section">
        <div className="carousel-container">
          {heroSlides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url(${slide.image})` }}
            >
              <div className="hero-content">
                <span className="hero-tag">{slide.tag}</span>
                <h1 style={{ whiteSpace: 'pre-line' }}>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Link to="/shop">
                  <button className="cta-button">View Collection <ArrowRight size={18} /></button>
                </Link>
              </div>
            </div>
          ))}

          <div className="carousel-controls">
            <button className="arrow-btn left" onClick={prevSlide}><ChevronLeft size={24} /></button>
            <button className="arrow-btn right" onClick={nextSlide}><ChevronRight size={24} /></button>
          </div>

          <div className="carousel-indicators">
            {heroSlides.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Filter & Shop Section */}
      <section className="shop-section">
        <header className="shop-header">
          <div className="title-area">
            <h2>Our Collection</h2>
            <p>{filteredProducts.length} items available from our studio</p>
          </div>
          <div className="filter-pills">
            {['All', 'Men', 'Women', 'Kids', 'Accessories'].map(cat => (
              <button 
                key={cat}
                className={`pill ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="product-grid">
          {filteredProducts.map((product) => (
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
                  <p>{product.category}</p>
                </div>
                <div className="meta-right">
                  <p className="price">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .home-wrapper { animation: fadeIn 0.8s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .hero-section { padding: 20px; height: 85vh; min-height: 500px; }
        .carousel-container { position: relative; width: 100%; height: 100%; border-radius: 24px; overflow: hidden; }

        .hero-slide {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background-size: cover; background-position: center;
          display: flex; align-items: center; padding: 0 8%;
          opacity: 0; transition: opacity 1s ease-in-out, transform 1s ease-in-out;
          transform: scale(1.05); z-index: 1;
        }

        .hero-slide.active { opacity: 1; transform: scale(1); z-index: 2; }
        .hero-content { color: white; max-width: 550px; transform: translateY(30px); opacity: 0; transition: all 0.8s ease-out 0.3s; }
        .hero-slide.active .hero-content { transform: translateY(0); opacity: 1; }

        .hero-tag { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 3px; color: #c5a992; font-weight: 600; }
        .hero-content h1 { font-size: 5rem; line-height: 1.1; margin: 20px 0; font-weight: 300; }
        .hero-content p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 35px; line-height: 1.6; }
        
        .cta-button { 
          display: flex; align-items: center; gap: 10px; padding: 18px 35px; 
          background: white; color: black; border: none; border-radius: 50px; 
          font-weight: 600; cursor: pointer; transition: 0.3s;
        }
        .cta-button:hover { gap: 15px; background: #c5a992; color: white; }

        .carousel-controls { position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); display: flex; justify-content: space-between; padding: 0 30px; z-index: 10; pointer-events: none; }
        .arrow-btn { pointer-events: auto; width: 50px; height: 50px; border-radius: 50%; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.3); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; }
        .arrow-btn:hover { background: white; color: #1a1a1a; transform: scale(1.1); }

        .carousel-indicators { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 10; }
        .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); border: none; cursor: pointer; transition: 0.3s; }
        .dot.active { background: white; width: 24px; border-radius: 10px; }

        .shop-section { padding: 80px 5%; max-width: 1500px; margin: 0 auto; }
        .shop-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; }
        .title-area h2 { font-size: 2.5rem; font-weight: 300; }
        .title-area p { color: #888; margin-top: 5px; }

        .filter-pills { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 5px; }
        .filter-pills::-webkit-scrollbar { display: none; }
        .pill { padding: 10px 25px; border-radius: 50px; border: 1px solid #ddd; background: transparent; cursor: pointer; transition: 0.3s; font-weight: 500; white-space: nowrap; }
        .pill.active { background: #1a1a1a; color: white; border-color: #1a1a1a; }

        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 40px; }
        .product-image-wrapper { position: relative; overflow: hidden; border-radius: 16px; aspect-ratio: 3/4; background: #f4f4f4; }
        .product-image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1); display: block; }
        .product-card:hover img { transform: scale(1.08); }

        .quick-add { position: absolute; bottom: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background: white; border: none; display: flex; align-items: center; justify-content: center; transform: translateY(100px); opacity: 0; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .product-card:hover .quick-add { transform: translateY(0); opacity: 1; }
        .quick-add:hover { background: #1a1a1a; color: white; }

        .product-meta { display: flex; justify-content: space-between; margin-top: 20px; }
        .meta-left h4 { font-size: 1.1rem; font-weight: 500; }
        .meta-left p { color: #888; font-size: 0.9rem; margin-top: 2px; }
        .price { font-weight: 600; font-size: 1.1rem; }

        .fade-in-up { animation: slideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) { .hero-content h1 { font-size: 3.5rem; } .shop-header { flex-direction: column; align-items: flex-start; gap: 20px; } }
      `}</style>
    </div>
  );
};

export default Home;