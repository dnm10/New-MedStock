import React from 'react'
import '../App.css';
import './BenefitsSection.css';
import hp3 from '../Assets/hp3.jpg';

export default function BenefitsSection() {
  return (
    <section className="third">
    <div className="third-content">
      <div className="benefits">
          <h2>User Benefits:</h2>
      </div>
      <h3>
          <ul className="points1" type="disk">
            <li>Simplified Stock Management: Automate inventory tracking.</li>
            <li>Stay Informed: Real-time notifications for expiring or low stock.</li>
            <li>Save Time: Reduce manual effort with automated updates and reports.</li>
          </ul>
      </h3>
      </div>
    <div className="image3-box">
      <img src={hp3} alt="img1" className="third-image"/>
    </div>
  </section>
  )
}
