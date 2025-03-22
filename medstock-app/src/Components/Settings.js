import React, { useState, useEffect } from "react";
import "./Settings.modules.css";

const Settings = () => {
  // State variables
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState("Medium");
  const [language, setLanguage] = useState("English");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [username, setUsername] = useState("JohnDoe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [password, setPassword] = useState("");

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("userSettings"));
    if (savedSettings) {
      setDarkMode(savedSettings.darkMode);
      setHighContrast(savedSettings.highContrast);
      setTextSize(savedSettings.textSize);
      setLanguage(savedSettings.language);
      setEmailNotifications(savedSettings.emailNotifications);
      setSmsNotifications(savedSettings.smsNotifications);
      setPushNotifications(savedSettings.pushNotifications);
      setUsername(savedSettings.username);
      setEmail(savedSettings.email);
      setPassword(savedSettings.password);
    }
  }, []);

  // Save settings to localStorage
  const handleSaveSettings = () => {
    const settings = {
      darkMode,
      highContrast,
      textSize,
      language,
      emailNotifications,
      smsNotifications,
      pushNotifications,
      username,
      email,
      password,
    };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  return (
    <div className={`settings-page ${darkMode ? "dark-mode" : ""} ${highContrast ? "high-contrast" : ""}`}>
      <h1>Settings</h1>

      {/* Display Settings */}
      <div className="section">
        <h2>Display Settings</h2>
        <label>
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          Dark Mode
        </label>
        <label>
          Text Size:
          <select value={textSize} onChange={(e) => setTextSize(e.target.value)}>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} />
          High Contrast Mode
        </label>
      </div>

      {/* Notifications */}
      <div className="section">
        <h2>Notifications</h2>
        <label>
          <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
          Email Notifications
        </label>
        <label>
          <input type="checkbox" checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />
          SMS Notifications
        </label>
        <label>
          <input type="checkbox" checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
          Push Notifications
        </label>
      </div>

      {/* Account */}
      <div className="section">
        <h2>Account</h2>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
      </div>

      {/* Language Selection */}
      <div className="section">
        <h2>Language</h2>
        <label>
          Select Language:
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Hindi</option>
          </select>
        </label>
      </div>

      {/* Save Button */}
      <button className="save-button" onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default Settings;