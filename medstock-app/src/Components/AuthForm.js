import React, { useState } from 'react';
import styles from './AuthForm.module.css';
import mslogo from '../Assets/mslogo.png';
import { useNavigate } from 'react-router-dom';
import { useRole } from './RoleContext';

const AuthForm = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Admin',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setFormData({
        ...formData,
        role: value,
        password: '',
        confirmPassword: '',
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = () => {
    const { password, role } = formData;
    const minLength = role === 'Admin' ? 8 : 6;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      alert('Invalid email format!');
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!validatePassword()) {
      alert(
        formData.role === 'Admin'
          ? 'Admin password must be at least 8 characters, with uppercase, lowercase, number, and special character.'
          : 'User password must be at least 6 characters, with uppercase, lowercase, number, and special character.'
      );
      return;
    }

    const endpoint = isLogin
      ? 'http://localhost:5000/api/login'
      : 'http://localhost:5000/api/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`${isLogin ? 'Login' : 'Signup'} Successful`);
        setRole(result.user.role);
        localStorage.setItem('role', result.user.role);
        navigate('/Home');
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
                />{' '}
                Admin
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="User"
                  checked={formData.role === 'User'}
                  onChange={handleChange}
                />{' '}
                User
              </label>
            </div>

            <button className={styles.lsbtn} type="submit">
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <div className={styles.bottomLink}>
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  className={styles.registerButton}
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)}>Login</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
