import React from 'react';
import Header from './Components/Header';
import Notifications from "./Components/Notifications";
import FormPopup from './Components/FormPopup';
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';
import Inventory from './Components/Inventory';
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
      </Routes>
      <Routes>
        <Route path="/Notifications" element={<Notifications />} />
      </Routes>
      <FormPopup />
      <Sidebar />
      <Routes> 
        <Route exact path="/Inventory" element={<Inventory/>}/>
      </Routes>
      </Router>
    </div>
  );
}

export default App;

