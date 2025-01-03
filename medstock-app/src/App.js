import React from 'react';
import Header from './Components/Header';
import FormPopup from './Components/FormPopup';
import Sidebar from './Components/Sidebar';
import HeroSection from './Components/HeroSection';
import OverviewSection from './Components/OverviewSection';
import BenefitsSection from './Components/BenefitsSection';
import Footer from './Components/Footer';
import './App.css'; // Add your CSS file

function App() {
  return (
    <div className="App">
      <Header />
      <FormPopup />
      <Sidebar />
      <HeroSection />
      <OverviewSection />
      <BenefitsSection />
      <Footer />
    </div>
  );
}

export default App;

