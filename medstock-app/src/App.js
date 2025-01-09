import React from 'react';
import Header from './Components/Header';
import Notifications from "./Components/Notifications";
import FormPopup from './Components/FormPopup';
import SideBar from './Components/SideBar';
import Home from './Components/Home';
import Inventory from './Components/Inventory';
import Billing from './Components/Billing';
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
        <Route path="/" element={<Home/>} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route exact path="/Inventory" element={<Inventory/>}/>
        <Route path="/Billing" element={<Billing/>}/>
      </Routes>
  
      <FormPopup />
      <SideBar />
      </Router>
    </div>
  );
}

export default App;

