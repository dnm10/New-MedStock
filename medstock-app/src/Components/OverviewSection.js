import React from 'react'
import '../App.css';

export default function OverviewSection() {
  return (
    
    <section className="first">
        <div className="first-content animated text-animated">
            <div className="capabilities">
                <h2>Overview of System Capabilities:</h2>
            </div>
            <h3>
            <ul className="points" type="disk">
                <li>Inventory Management: Track stock levels, manage expiries, and keep medicines up to date.</li>
                <li>Order Tracking: Simplified system to reorder supplies and check their status.</li>
                <li>Notifications & Alerts: Get alerts for low stock or expiring items to take timely action.</li>
                <li>Reporting Tools: View detailed reports on your inventory and sales trends.</li>
            </ul>
            </h3>
        </div>
        <div className="image1-box animated image-animated">
            <img src="hp2.jpg" alt="img1" className="first-image"/>
        </div>
    </section>

  )
}
