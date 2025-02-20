import React from 'react';
import Header from './Components/Header';
import Notifications from './Components/Notifications';
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
} from 'react-router-dom';
import { RoleProvider } from './Components/RoleContext';


const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/Signup';

  return (
    <>
      {!isAuthPage && <Header />}
      <div className="AppContainer">
        {!isAuthPage && <Sidebar />}
        <main>{children}</main>
      </div>
      {!isAuthPage && <FormPopup />}
    </>
  );
};

function App() {
  return (
    <div className="App">
      <RoleProvider>
        <Router>
          <Layout>
            <Routes>
              
              <Route path="/" element={<AuthForm />} />
              <Route path="/Signup" element={<AuthForm />} />

              
              <Route path="/Home" element={<Home />} />
              <Route path="/Home/ContactUs" element={<ContactUs />} />
              <Route path="/Notifications" element={<Notifications />} />
              <Route path="/Inventory" element={<Inventory />} />
              <Route path="/Billing" element={<Billing />} />
              <Route path="/Orders" element={<Orders />} />
              <Route path="/Supplier" element={<Supplier />} />
              <Route path="/Users" element={<Users />} />
              <Route path="/Reports" element={<Reports />} />
              
            </Routes>
          </Layout>
        </Router>
      </RoleProvider>
    </div>
  );
}

export default App;
