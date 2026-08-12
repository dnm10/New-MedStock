import React, { useEffect } from 'react';
import { FaBox, FaTruck, FaHome, FaMoneyBill, FaBell, FaChartBar, FaArrowRight } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from './RoleContext';
import aboutImage from '../Assets/mslogo.png';
import toast from 'react-hot-toast';

const Home = () => {
  const { role } = useRole();
  const location = useLocation();

  // Scroll to hash on mount or when hash changes
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        // slight delay to ensure layout is complete, minus header offset
        setTimeout(() => {
          const y = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const allCardItems = [
    { id: 'inventory', label: 'Inventory', desc: 'Real-time stock levels, low-stock alerts, and effortless tracking.', icon: <FaBox />, path: '/Inventory', adminOnly: true },
    { id: 'orders', label: 'Orders', desc: 'Streamline procurement and monitor delivery status instantly.', icon: <FaTruck />, path: '/Orders', adminOnly: true },
    { id: 'suppliers', label: 'Suppliers', desc: 'Manage vendor relationships and track historical supply data.', icon: <FaHome />, path: '/Supplier', adminOnly: true },
    { id: 'reports', label: 'Reports', desc: 'Powerful analytics to drive smart, data-driven decisions.', icon: <FaChartBar />, path: '/Reports', adminOnly: true },
    { id: 'billing', label: 'Billing', desc: 'Generate invoices and automatically calculate tax compliance.', icon: <FaMoneyBill />, path: role === 'Admin' ? '/Billing/Admin' : '/Billing/User', adminOnly: false },
    { id: 'notifications', label: 'Notifications', desc: 'Stay updated on essential changes and system alerts.', icon: <FaBell />, path: '/Notifications', adminOnly: false },
  ];

  const cardItems = allCardItems.filter(item => role === 'Admin' || !item.adminOnly);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you! Your message has been sent.");
    e.target.reset();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">

      {/* Hero Section */}
      <section id="hero" className="relative pt-24 pb-32 px-6 lg:px-8 text-center border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight drop-shadow-sm">
            Intelligent Inventory for <span className="text-primary-600 dark:text-primary-400">Modern Healthcare</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Eliminate stockouts, streamline your supply chain, and ensure you always have the critical medical supplies you need to save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#features" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm hover:shadow-md transition-all">
              Explore Features
              <FaArrowRight className="w-4 h-4" />
            </a>
            <Link to="/Inventory" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl shadow-sm transition-all">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Quick Access Section */}
      <section id="features" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Everything You Need</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Seamlessly manage your entire operation from a single, unified dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-card border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.label}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-200 to-transparent dark:from-primary-900/40 rounded-3xl transform translate-x-4 translate-y-4"></div>
                <img
                  src={aboutImage}
                  alt="Medical Supplies Overview"
                  className="relative z-10 w-full rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-sm font-bold tracking-widest text-primary-600 dark:text-primary-400 uppercase mb-3">About Us</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Built to Support the Heartbeat of Healthcare.
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Smart Inventory Solutions was founded with a singular mission: to strip away the complexity of medical supply management. We believe that healthcare professionals should spend their time caring for patients, not fighting with spreadsheets.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Our secure, cloud-based platform provides complete visibility into your inventory, seamlessly bridging the gap between procurement, storage, and billing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">

          <div className="lg:w-5/12 p-10 md:p-16 bg-gradient-to-br from-primary-700 to-primary-900 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-primary-100 mb-10 text-lg">
                Have questions about enterprise deployment, API integration, or custom billing rules? Our team is here to help.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded">mail</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email Support</h4>
                    <p className="text-primary-100 text-sm">support@medstock.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded">call</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Direct Line</h4>
                    <p className="text-primary-100 text-sm">+91 9822345678</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-7/12 p-10 md:p-16 bg-white dark:bg-slate-900">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Send a Message</h3>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="john@hospital.org" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                <textarea required rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none" placeholder="How can we assist you?"></textarea>
              </div>
              <button type="submit" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white mb-4 block">MedStock</span>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Your trusted partner in managing medical inventories efficiently.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4 block">Quick Links</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
              <li><a href="#hero" className="hover:text-primary-600 dark:hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-primary-600 dark:hover:text-white transition-colors">Platform Features</a></li>
              <li><a href="#about" className="hover:text-primary-600 dark:hover:text-white transition-colors">Our Story</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4 block">Legal</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <li><a href="#!" className="hover:text-primary-600 dark:hover:text-white transition-colors">Privacy Policy</a></li>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <li><a href="#!" className="hover:text-primary-600 dark:hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center">
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Smart Inventory Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
