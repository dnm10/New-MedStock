import React, { useState } from 'react';
import styles from './AuthForm.module.css';
import mslogo from '../Assets/mslogo.png';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const navigate = useNavigate(); // ✅ React Router navigation
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: 'medstock@gmail.com',
    password: 'medstock',
    confirmPassword: 'medstock',
    role: 'Admin',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Response:', result);

      if (response.ok) {
        alert(`${isLogin ? 'Login' : 'Signup'} Successful`);
        navigate('/Home'); // ✅ Redirect using React Router
      } else {
        alert(result.message || `${isLogin ? 'Login' : 'Signup'} Failed`);
      }
    } catch (error) {
      console.error(`Error during ${isLogin ? 'login' : 'signup'}:`, error);
      alert(`An error occurred during ${isLogin ? 'login' : 'signup'}.`);
    }
  };

  return (
    <div className={styles.Login}>
      <div className={styles.formBox}>
        <div className={styles.formDetails}>
          <img src={mslogo} alt="MedStock Logo" className={styles.logoImage} />
        </div>

        <div className={styles.formContent}>
          <h2>{isLogin ? 'LOGIN' : 'SIGN UP'}</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputField}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
              />
              <label>Email</label>
            </div>

            <div className={styles.inputField}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                required
              />
              <label>Password</label>
            </div>

            {!isLogin && (
              <div className={styles.inputField}>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
                <label>Confirm Password</label>
              </div>
            )}

            <div className={styles.loginType}>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Admin"
                  checked={formData.role === 'Admin'}
                  onChange={handleChange}
                /> Admin
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="User"
                  checked={formData.role === 'User'}
                  onChange={handleChange}
                /> User
              </label>
            </div>

            <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
          </form>

          <div className={styles.bottomLink}>
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)} style={{ background: 'none', border: 'none', color: '#3056ff', cursor: 'pointer' }}>Register</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} style={{ background: 'none', border: 'none', color: '#3056ff', cursor: 'pointer' }}>Login</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
