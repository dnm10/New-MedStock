import React, { useState } from 'react';
import styles from './Login.module.css';
import mslogo from '../Assets/mslogo.png';
import { Link } from 'react-router-dom';

const Login = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    loginType: 'User',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Login Successful');
      } else {
        alert(result.message || 'Login Failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className={styles.Login}>
      <div className={styles.formBox}>
        <div className={styles.formDetails}>
          <img src={mslogo} alt="MedStock Logo" className={styles.logoImage} />
        </div>
        <div className={styles.formContent}>
          <h2>LOGIN</h2>
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
            <div className={styles.loginType}>
              <label>
                <input
                  type="radio"
                  name="loginType"
                  value="Admin"
                  checked={formData.loginType === 'Admin'}
                  onChange={handleChange}
                />
                Admin
              </label>
              <label>
                <input
                  type="radio"
                  name="loginType"
                  value="User"
                  checked={formData.loginType === 'User'}
                  onChange={handleChange}
                />
                User
              </label>
            </div>
            <button type="submit">Log In</button>
          </form>
          <div className={styles.bottomLink}>
            Don't have an account? <Link to="/Signup" onClick={toggleForm}>Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
