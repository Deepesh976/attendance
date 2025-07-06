import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.warn('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;
      const expiryTime = Date.now() + 60 * 60 * 1000;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('email', user.email);
      localStorage.setItem('expiry', expiryTime.toString());

      toast.success('Login successful');
      setTimeout(() => navigate('/dashboard'), 1000);

      setTimeout(() => {
        localStorage.clear();
        alert('Session expired. Please log in again.');
        navigate('/');
      }, 60 * 60 * 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '1.5rem',
      animation: 'fadeIn 0.8s ease-in-out',
    },
    card: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '3rem 2rem',
      maxWidth: '420px',
      width: '100%',
      color: '#333',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
      animation: 'slideUp 0.6s ease-out',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    logo: {
      width: '300px',
      height: '100px',
      objectFit: 'contain',
      marginBottom: '1rem',
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
    },
    inputWrapper: {
      position: 'relative',
      marginBottom: '1.2rem',
    },
    input: {
      padding: '0.9rem 1rem',
      borderRadius: '12px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      backgroundColor: '#f9f9f9',
      color: '#333',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)',
    },
    toggleBtn: {
      position: 'absolute',
      top: '50%',
      right: '1rem',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#4e54c8',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
    },
    button: {
      backgroundColor: '#4e54c8',
      color: '#fff',
      padding: '0.9rem',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
      width: '100%',
      marginTop: '0.5rem',
    },
    buttonHover: {
      backgroundColor: '#8f94fb',
    },
    styleTag: `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @media (max-width: 480px) {
        .login-card {
          padding: 2rem 1.5rem !important;
          border-radius: 16px !important;
        }
        .login-logo {
          width: 80px !important;
          height: 80px !important;
        }
      }
    `,
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{styles.styleTag}</style>
      <div style={styles.page}>
        <div style={styles.card} className="login-card">
          <div style={styles.header}>
            <img src="/logo.png" alt="Logo" style={styles.logo} className="login-logo" />
          </div>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={styles.toggleBtn}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="button"
              style={{
                ...styles.button,
                ...(btnHover ? styles.buttonHover : {}),
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
