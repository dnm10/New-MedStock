import React, { useState, useEffect } from "react";
import { FaEdit, FaEnvelope, FaUser, FaUserShield } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    image: "https://via.placeholder.com/200",
  });

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
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header"></div>
        <img src={user.image} alt="Profile" className="profile-image" />
        <h2 className="profile-name">{user.name || "Profile"}</h2>
        <div className="profile-info">
          <p><FaUser className="profile-icon" /> <strong>Name:</strong> {user.name || "N/A"}</p>
          <p><FaEnvelope className="profile-icon" /> <strong>Email:</strong> {user.email || "N/A"}</p>
          <p><FaUserShield className="profile-icon" /> <strong>Role:</strong> {user.role || "N/A"}</p>
        </div>
        <button className="profile-button" onClick={handleEdit}>
          <FaEdit /> Edit Profile
        </button>
      </div>

      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Enter Name"
            />
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter Email"
            />
            <button className="save-button" onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
