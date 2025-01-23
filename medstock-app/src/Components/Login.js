import React, { useState } from 'react';
import './Login.css';
import mslogo from './Assets/mslogo.png';

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
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className="form-box login">
      <div className="form-details">
        <img src={mslogo} alt="Logo" />
      </div>
      <div className="form-content">
        <h2>LOGIN</h2>
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="login-type">
            <input
              type="radio"
              id="loginAdmin"
              name="loginType"
              value="Admin"
              checked={formData.loginType === 'Admin'}
              onChange={handleChange}
            />
            <label htmlFor="loginAdmin">Login as Admin</label>
            <input
              type="radio"
              id="loginUser"
              name="loginType"
              value="User"
              checked={formData.loginType === 'User'}
              onChange={handleChange}
            />
            <label htmlFor="loginUser">Login as User</label>
          </div>
          <button type="submit">Log In</button>
        </form>
        <div className="bottom-link">
          Don't have an account?{' '}
          <a href="#" onClick={toggleForm}>Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
