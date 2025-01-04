import React from 'react';
import '../App.css';
import './HeroSection.css';
import hp1 from '../Assets/hp1.jpg';

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="content">
        <h2>Manage Your Medical Inventory with Ease</h2>
        <h3>"Monitor stock levels, manage orders, and stay updated with notifications"</h3>
      </div>
      <div className="hero-box">
        <img src={hp1}alt="heroimg" className="hero-image" />
      </div>
    </section>
  );
}

export default HeroSection;
