import React, { useState } from "react";
import api from "../api/axiosConfig";
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    if (!email || !newPassword) {
      toast.error("Please enter both email and new password");
      return;
    }
  
    try {
      const response = await api.post("/reset-password", { email, newPassword });
      
      toast.success("Password reset successful!");
      setEmail("");
      setNewPassword("");
    } catch (error) {
      console.error("Fetch Error:", error);
      const msg = error.response?.data?.message || "Something went wrong!";
      toast.error(msg);
    }
  };
  
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>RESET PASSWORD</h2>
      <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Reset Password</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ResetPassword;
