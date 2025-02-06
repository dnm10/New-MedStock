import React, { useState } from 'react';
import styles from './Signup.module.css';
import mslogo from '../Assets/mslogo.png';
import { Link } from 'react-router-dom';

const Signup = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'User',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Signup Successful');
      } else {
        alert(result.message || 'Signup Failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred during signup.');
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.formBox}>
        <div className={styles.formDetails}>
          <img src={mslogo} alt="Logo" className={styles.logoImage} />
        </div>
        <div className={styles.formContent}>
          <h2>SIGN UP</h2>
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
            <div className={styles.signupType}>
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
            <button type="submit">Sign Up</button>
          </form>
          <div className={styles.bottomLink}>
            Already have an account?{' '}
            <Link to="/Login" onClick={toggleForm}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;