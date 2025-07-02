import React from 'react';
import {
  FaBox, FaTruck, FaHome, FaMoneyBill, FaBell, FaChartBar,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import aboutImage from '../Assets/mslogo.png';

const Home = () => {
  const cardItems = [
    { id: 'inventory', label: 'Inventory', icon: <FaBox />, path: '/Inventory' },
    { id: 'orders', label: 'Orders', icon: <FaTruck />, path: '/Orders' },
    { id: 'suppliers', label: 'Suppliers', icon: <FaHome />, path: '/Supplier' },
    { id: 'reports', label: 'Reports', icon: <FaChartBar />, path: '/Reports' },
    { id: 'billing', label: 'Billing', icon: <FaMoneyBill />, path: '/Billing/User' }, // or Admin based on role
    { id: 'notifications', label: 'Notifications', icon: <FaBell />, path: '/Notifications' },
  ];

  const Card = ({ title, description, icon, path }) => (
    <Link
      to={path}
      className="w-full sm:w-64 bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition"
    >
      <div className="text-4xl text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome to Smart Inventory Solutions
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Optimizing Your Medical Inventory, Every Step of the Way.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {cardItems.map((item) => (
            <Card
              key={item.id}
              title={item.label}
              description={`Manage all aspects of ${item.label.toLowerCase()} seamlessly.`}
              icon={item.icon}
              path={item.path}
            />
          ))}
        </div>

        {/* About Section */}
        <section className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow p-8 mb-16">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img
              src={aboutImage}
              alt="About Us"
              className="w-full rounded-lg"
            />
          </div>
          <div className="md:w-1/2 md:pl-10">
            <h2 className="text-2xl font-bold mb-4">About Us</h2>
            <p className="text-gray-700">
              Smart Inventory Solutions is dedicated to helping medical
              facilities optimize their inventory management. Our platform
              ensures that you always have the right supplies when you need
              them.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow p-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="mb-2">Email: support@medstock.com</p>
            <p className="mb-2">Phone: +1 234 567 890</p>
            <p>
              Website:{' '}
              <a
                href="https://www.medstock.com"
                className="text-blue-600 hover:underline"
              >
                www.medstock.com
              </a>
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600">
        <p>
          &copy; {new Date().getFullYear()} Smart Inventory Solutions. All rights
          reserved.
        </p>
        <p>Your trusted partner in managing medical inventories efficiently.</p>
      </footer>
    </div>
  );
};

export default Home;
