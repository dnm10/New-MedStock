import React from 'react';
import Header from './Components/Header';
import Notifications from "./Components/Notifications";
import FormPopup from './Components/FormPopup';
import SideBar from './Components/Sidebar';
import Home from './Components/Home';
import Inventory from './Components/Inventory';
import Billing from './Components/Billing';
import Orders from './Components/Orders';
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
        <Route path="/Orders" element={<Orders/>}/>
      </Routes>
  
      <FormPopup />
      <SideBar />
      </Router>
    </div>
  );
}

export default App;

