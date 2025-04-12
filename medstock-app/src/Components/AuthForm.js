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
    name: '',
    contact: '',
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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/i;
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

    if (!isLogin && !/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      alert('Invalid name! Name must contain only alphabets and spaces.');
      return;
    }

    if (!isLogin && !/^\d{10}$/.test(formData.contact.trim())) {
      alert('Contact number must be exactly 10 digits.');
      return;
    }

    if (!validateEmail(formData.email.trim())) {
      alert('Invalid email! Use a valid gmail.com or yahoo.com email.');
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!validatePassword()) {
      alert(
        formData.role === 'Admin'
          ? 'Admin password must be at least 8 characters long with uppercase, lowercase, number, and special character.'
          : 'User password must be at least 6 characters long with uppercase, lowercase, number, and special character.'
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
          name: formData.name.trim(),
          contact: formData.contact.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`${isLogin ? 'Login' : 'Signup'} Successful`);
        setRole(result.user.role);
        localStorage.setItem('user', JSON.stringify(result.user));
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
            {!isLogin && (
              <>
                <div className={styles.inputField}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    pattern="^[A-Za-z\s]+$"
                    title="Name must contain only alphabets and spaces."
                    required
                  />
                  <label>Name</label>
                </div>
                <div className={styles.inputField}>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Enter Contact Number"
                    pattern="^\d{10}$"
                    title="Contact number must be exactly 10 digits."
                    required
                  />
                  <label>Contact Number</label>
                </div>
              </>
            )}

            <div className={styles.inputField}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                pattern="^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$"
                title="Enter a valid email (gmail.com or yahoo.com only)."
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

           {/* <div className={styles.forgotPassword}>
              <button
                type="button"
                className={styles.forgotPasswordBtn}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>*/}

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
