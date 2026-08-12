import React, { useState, useEffect } from "react";
import { FaEdit, FaEnvelope, FaUser, FaUserShield, FaIdBadge, FaLock, FaSignOutAlt } from "react-icons/fa";
import adminimg from '../Assets/adminimg.png';
import api from "../api/axiosConfig";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRole } from "./RoleContext";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    image: adminimg,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { setRole } = useRole();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setIsEditing(false);
    toast.success("Profile updated");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    api.post('/change-password', {
      email: user.email,
      currentPassword,
      newPassword
    }).then(() => {
      toast.success("Password updated securely!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }).catch(err => {
      toast.error(err.response?.data?.message || "Error updating password");
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    if (setRole) setRole('');
    navigate('/');
    toast.success("Logged out successfully");
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-10 px-5 md:px-8 font-sans mx-auto w-full transition-colors duration-300">
      {/* Page Header */}
      <div className="mb-10 mt-6 py-6 bg-gradient-to-r from-primary-800 to-primary-600 text-white rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-sm">User Profile</h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700 overflow-hidden relative">
          
          {/* Card Header Backdrop */}
          <div className="bg-gradient-to-r from-primary-100 to-primary-200 h-40 w-full relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
          
          {/* Profile Picture */}
          <div className="flex justify-center relative -mt-20">
            <div className="p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-lg">
              <img 
                src={user.image || adminimg} 
                alt="Profile" 
                className="w-36 h-36 rounded-full border-4 border-slate-50 object-cover object-center bg-white dark:bg-slate-800 shadow-inner"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-10 pt-6 text-center">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{user.name || "N/A"}</h2>
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-semibold text-sm mb-8 shadow-sm border border-primary-100">
              <FaUserShield /> {user.role || "N/A"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-xl mx-auto mb-10">
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="p-3 bg-white dark:bg-slate-800 text-primary-600 rounded-lg shadow-sm">
                  <FaUser className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{user.name || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="p-3 bg-white dark:bg-slate-800 text-primary-600 rounded-lg shadow-sm">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 break-all">{user.email || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={handleEdit}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl px-8 py-3 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <FaEdit className="text-lg" /> Edit Profile
              </button>
              
              <button 
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl px-8 py-3 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <FaSignOutAlt className="text-lg" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card p-6 md:p-8 border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
            <div className="p-2 bg-primary-100 dark:bg-slate-700 text-primary-600 rounded-lg">
              <FaLock />
            </div>
            Security & Authentication
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-5 max-w-xl mx-auto">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5 text-sm">Current Password</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required 
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5 text-sm">New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5 text-sm">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" 
              />
            </div>
            <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3 rounded-xl transition-all shadow-md mt-2">
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-slate-700 text-primary-600 rounded-lg">
                <FaEdit />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Edit Profile</h3>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="Enter Name"
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-sm hover:border-slate-400 dark:bg-slate-700/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="Enter Email"
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-sm hover:border-slate-400 dark:bg-slate-700/50"
                />
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex gap-2 items-start mt-2">
                <FaIdBadge className="mt-0.5 text-slate-400 shrink-0" />
                <p>Your role ({user.role}) is assigned by system administrators and cannot be changed here.</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3 mt-auto">
              <button 
                className="px-5 py-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-medium rounded-xl transition-colors shadow-sm text-sm" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm" 
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
