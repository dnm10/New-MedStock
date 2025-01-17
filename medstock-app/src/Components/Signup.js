import React, { useState } from 'react';
import './Signup.css';

const Signup = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
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
    <div className="form-box signup">
      <div className="form-content">
        <h2>SIGN UP</h2>
        <form id="signupForm" onSubmit={handleSubmit}>
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
          <div className="input-field">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <div className="bottom-link">
            Already have an account?{' '}
            <a href="#" onClick={toggleForm}>Log In</a>
    </div>
      </div>
    </div>
  );
};

export default Signup;
