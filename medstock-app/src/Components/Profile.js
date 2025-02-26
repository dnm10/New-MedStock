import React from "react";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          className="profile-image"
          src="https://via.placeholder.com/120"
          alt="Profile"
        />
        <h2 className="profile-name">John Doe</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Gmail:</strong> john.doe@example.com</p>
          <p><strong>Role:</strong> Web Developer</p>
        </div>
        <button className="profile-button">Edit Profile</button>
      </div>
    </div>
  );
};

export default Profile;
