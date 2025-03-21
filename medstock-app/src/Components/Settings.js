import React, { useState, useEffect } from "react";
import styles from "./Settings.modules.css";


const Settings = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [textSize, setTextSize] = useState("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [username, setUsername] = useState("JohnDoe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("English");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.settingsContainer}>
      <h2>Settings</h2>
      <div className={styles.settingGroup}>
        <h3>Display Settings</h3>
        <div className={styles.settingOption}>
          <label>Dark Mode</label>
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>
        <div className={styles.settingOption}>
          <label>Text Size</label>
          <select value={textSize} onChange={(e) => setTextSize(e.target.value)}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div className={styles.settingOption}>
          <label>High Contrast Mode</label>
          <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} />
        </div>
      </div>
      
      <div className={styles.settingGroup}>
        <h3>Notifications</h3>
        <div className={styles.settingOption}>
          <label>Email Notifications</label>
          <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
        </div>
        <div className={styles.settingOption}>
          <label>SMS Notifications</label>
          <input type="checkbox" checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />
        </div>
        <div className={styles.settingOption}>
          <label>Push Notifications</label>
          <input type="checkbox" checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
        </div>
      </div>
      
      <div className={styles.settingGroup}>
        <h3>Account</h3>
        <div className={styles.settingOption}>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className={styles.settingOption}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className={styles.settingOption}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      
      <div className={styles.settingGroup}>
        <h3>Language</h3>
        <div className={styles.settingOption}>
          <label>Select Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>
      </div>
      
      <div className={styles.settingGroup}>
        <h3>Security</h3>
        <div className={styles.settingOption}>
          <label>Two-Factor Authentication</label>
          <input type="checkbox" checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />
        </div>
      </div>
      
      <button className={styles.saveBtn} onClick={handleSave}>Save Settings</button>
      {saved && <p className={styles.savedMessage}> Settings Saved!</p>}
    </div>
  );
};

export default Settings;