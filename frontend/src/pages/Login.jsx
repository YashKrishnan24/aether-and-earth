import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  
  const destination = location.state?.from || '/account';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    
    setTimeout(() => {
      setIsAuthenticating(false);
      
      localStorage.setItem('isAuthenticated', 'true');
      
      navigate(destination);
    }, 1500);
  };

  return (
    <div className="auth-page-wrapper fade-in">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-form-content">
            <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="auth-subtitle">Get started for a seamless shopping experience.</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="yash@gmail.com" required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input type={showPassword ? "text" : "password"} placeholder="At least 8 characters" required />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={isAuthenticating}>
                {isAuthenticating ? 'Authenticating...' : (isLogin ? 'Login' : 'Register')}
              </button>
            </form>

            <div className="auth-switch">
              <p>{isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" className="switch-btn" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Register' : 'Login'}</button>
              </p>
            </div>
          </div>
        </div>

        <div className="auth-showcase-section">
           <div className="browser-mockup">
              <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800" alt="Product" className="mockup-img" />
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>"Exquisite quality and design."</p>
           </div>
        </div>
      </div>

      <style>{`
        .auth-page-wrapper { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .auth-container { display: grid; grid-template-columns: 1fr 1fr; max-width: 1000px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; width: 100%; }
        .auth-form-section { padding: 60px; }
        .auth-title { font-size: 2rem; margin-bottom: 10px; }
        .auth-subtitle { color: #888; margin-bottom: 30px; }
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group input { padding: 14px; border: 1px solid #ddd; border-radius: 8px; outline: none; }
        .password-input-wrapper { position: relative; display: flex; align-items: center; }
        .password-input-wrapper input { width: 100%; }
        .toggle-password { position: absolute; right: 10px; background: none; border: none; cursor: pointer; color: #999; }
        .auth-submit-btn { padding: 16px; background: #1a1a1a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .auth-submit-btn:hover { background: #c5a992; }
        .auth-showcase-section { background: #fcfcfc; padding: 60px; display: flex; align-items: center; justify-content: center; border-left: 1px solid #eee; }
        .browser-mockup { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .mockup-img { width: 100%; max-width: 300px; border-radius: 8px; }
        .switch-btn { background: none; border: none; color: #c5a992; font-weight: 600; cursor: pointer; }
        @media (max-width: 800px) { .auth-container { grid-template-columns: 1fr; } .auth-showcase-section { display: none; } }
      `}</style>
    </div>
  );
};

export default Login;