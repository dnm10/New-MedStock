import React, { useState } from 'react';
import Header from './Components/Header';
import Notifications from './Components/Notifications';
import FormPopup from './Components/FormPopup';
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';
import Inventory from './Components/Inventory';
import AdminBilling from './Components/AdminBilling';
import UserBilling from './Components/UserBilling';
import Orders from './Components/Orders';
import Supplier from './Components/Supplier';
import Reports from './Components/Reports';
import Users from './Components/Users';
import AuthForm from './Components/AuthForm';
import ContactUs from './Components/Home/ContactUs';
import Profile from './Components/Profile';
import Settings from './Components/Settings';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RoleProvider, useRole } from './Components/RoleContext';
import ForgotResetPassword from "./Components/ForgotResetPassword";


const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/Signup';

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {!isAuthPage && <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />}
      <div className="AppContainer">
        {!isAuthPage && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            closeSidebar={closeSidebar}
          />
        )}
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : ''}`}>
          <main>{children}</main>
        </div>
      </div>
      {!isAuthPage && <FormPopup />}
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const { role } = useRole();
  return role ? children : <Navigate to="/" />;
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

              <Route
                path="/Home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Home/ContactUs"
                element={
                  <ProtectedRoute>
                    <ContactUs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Inventory"
                element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              
              {/* Billing Route Based on Role */}
              <Route
                path="/Billing/Admin"
                element={
                  <ProtectedRoute>
                    <AdminBilling />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Billing/User"
                element={
                  <ProtectedRoute>
                    <UserBilling />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/Orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Supplier"
                element={
                  <ProtectedRoute>
                    <Supplier />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/Settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/Profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<AuthForm />} />
              <Route path="/forgot-password" element={<ForgotResetPassword />} />
              <Route path="/reset-password/:token" element={<ForgotResetPassword />} />
            </Routes>
          </Layout>
        </Router>
      </RoleProvider>
    </div>
  );
}

export default App;
