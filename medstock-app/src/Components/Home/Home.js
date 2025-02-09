import React from 'react';
import HeroSection from './HeroSection';
import OverviewSection from './OverviewSection';
import BenefitsSection from './BenefitsSection';
import Footer from './Footer';
import '../Home/Home.module.css';

function Home() {
  return (
    <>
      <HeroSection />
      <OverviewSection />
      <BenefitsSection />
      <Footer />
    </>
  );
}

export default Home;