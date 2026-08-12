import React, { useState } from 'react';
import mslogo from '../Assets/mslogo.png';
import { useNavigate } from 'react-router-dom';
import { useRole } from './RoleContext';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';

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
      toast.error('Invalid name! Name must contain only alphabets and spaces.');
      return;
    }

    if (!isLogin && !/^\d{10}$/.test(formData.contact.trim())) {
      toast.error('Contact number must be exactly 10 digits.');
      return;
    }

    if (!validateEmail(formData.email.trim())) {
      toast.error('Invalid email! Use a valid gmail.com or yahoo.com email.');
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!validatePassword()) {
      toast.error(
        formData.role === 'Admin'
          ? 'Admin password must be at least 8 characters long with uppercase, lowercase, number, and special character.'
          : 'User password must be at least 6 characters long with uppercase, lowercase, number, and special character.'
      );
      return;
    }

    const endpoint = isLogin ? '/login' : '/signup';

    try {
      const response = await api.post(endpoint, {
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      toast.success(`${isLogin ? 'Login' : 'Signup'} Successful`);
      setRole(response.data.user.role);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('username', response.data.user.email); 
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      navigate('/Home');
    } catch (error) {
      console.error(`Error during ${isLogin ? 'login' : 'signup'}:`, error);
      const message = error.response?.data?.message || `${isLogin ? 'Login' : 'Signup'} Failed`;
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm z-0"></div>
      
      <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md z-10 border border-slate-200 dark:border-slate-700 mx-4 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white dark:bg-slate-700 p-3 rounded-full mb-4 shadow-sm border border-slate-100 dark:border-slate-600">
            <img src={mslogo} alt="MedStock Logo" className="w-16 h-16 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
            {isLogin ? 'Sign in to access your inventory dashboard' : 'Join MedStock to manage your supplies efficiently'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  pattern="^[A-Za-z\s]+$"
                  title="Name must contain only alphabets and spaces."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Contact"
                  pattern="^\d{10}$"
                  title="Contact number must be exactly 10 digits."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              pattern="^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$"
              title="Enter a valid email (gmail.com or yahoo.com only)."
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
            />
          </div>

          {isLogin ? (
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-center space-x-6 py-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="role"
                value="Admin"
                checked={formData.role === 'Admin'}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300 cursor-pointer"
              />
              <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">Admin</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="role"
                value="User"
                checked={formData.role === 'User'}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300 cursor-pointer"
              />
              <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">User</span>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 mt-2"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline focus:outline-none"
                onClick={() => setIsLogin(false)}
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline focus:outline-none"
                onClick={() => setIsLogin(true)}
              >
                Log in here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
