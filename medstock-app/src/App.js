import React from 'react';
import Header from './Components/Header';
import Notifications from "./Components/Notifications";
import FormPopup from './Components/FormPopup';
import Sidebar from './Components/Sidebar';
import Home from './Components/Home/Home';
import Inventory from './Components/Inventory';
import Billing from './Components/Billing';
import Orders from './Components/Orders';
import Supplier from './Components/Supplier';
import Reports from './Components/Reports';
import Users from './Components/Users';
import AuthForm from './Components/AuthForm';
import ContactUs from './Components/Home/ContactUs';
import './App.css';


import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";



const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = location.pathname === '/' || location.pathname === '/Signup'; // Hide for Login & Signup

  return (
    <>
      {!hideLayout && <Header />}
      <div className="AppContainer">
        {!hideLayout && <Sidebar />}
        <main>{children}</main>
      </div>
      {!hideLayout && <FormPopup />}
    </>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route path='/' element={<AuthForm />} />      {/* Login */}
            <Route path="/Signup" element={<AuthForm />} /> {/* Signup */}
            <Route path="/Home" element={<Home />} />
            <Route path="/Home/ContactUs" element={<ContactUs/>} />
            <Route path="/Notifications" element={<Notifications />} />
            <Route exact path="/Inventory" element={<Inventory />} />
            <Route path="/Billing" element={<Billing />} />
            <Route path="/Orders" element={<Orders />} />
            <Route path="/Supplier" element={<Supplier />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/Reports" element={<Reports />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;

