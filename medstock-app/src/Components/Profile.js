import React from "react";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-name">John Doe</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Gmail:</strong> john.doe@gamil.com</p>
          <p><strong>Role:</strong>Admin</p>
        </div>
        <button className="profile-button">Edit Profile</button>
      </div>
    </div>
  );
};

export default Profile;
