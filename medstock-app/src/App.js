import React from 'react';
import Header from './Components/Header';
import Notifications from "./Components/Notifications";
import FormPopup from './Components/FormPopup';
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';
import Inventory from './Components/Inventory';
import Billing from './Components/Billing';
import Orders from './Components/Orders';
import Supplier from './Components/Supplier';
import Reports from './Components/Reports';
import Users from './Components/Users';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <Route path="/Signup" element={<signup/>} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route exact path="/Inventory" element={<Inventory/>}/>
        <Route path="/Billing" element={<Billing/>}/>
        <Route path="/Orders" element={<Orders/>}/>
        <Route path="/Supplier" element={<Supplier/>}/>
        <Route path="/Users" element={<Users/>}/>
        <Route path="/Reports" element={<Reports/>}/>
      </Routes>
  
      <FormPopup />
      <Sidebar />
      </Router>
    </div>
  );
}

export default App;

