import React from 'react';
import Header from './Components/Header';
import Home from "./Components/Home";
import Notifications from "./Components/Notifications";
import FormPopup from './Components/FormPopup';
import Sidebar from './Components/Sidebar';
import HeroSection from './Components/HeroSection';
import OverviewSection from './Components/OverviewSection';
import BenefitsSection from './Components/BenefitsSection';
import Footer from './Components/Footer';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
      <FormPopup />
      <Sidebar />
      <HeroSection />
      <OverviewSection />
      <BenefitsSection />
      <Footer />
      </Router>
    </div>
  );
}

export default App;

