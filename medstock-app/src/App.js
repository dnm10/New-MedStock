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
import Profile from './Components/Profile';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RoleProvider, useRole } from './Components/RoleContext';

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
              <Route
                path="/Billing"
                element={
                  <ProtectedRoute>
                    <Billing />
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
                path="/Profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </RoleProvider>
    </div>
  );
}

export default App;
