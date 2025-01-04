import React from 'react';
import '../App.css';
import './FormPopup.css';

function FormPopup() {
  return (
    <div>
      <div className="blur-bg"></div>
      <div className="form-popup">
        <span className="close-btn material-symbols-rounded">close</span>

        {/* Login Form */}
        <div className="form-box login">
          <div className="form-details">
            <div>
              <img src="mslogoed.png" alt="logo" />
            </div>
          </div>
          <div className="form-content">
            <h2>LOGIN</h2>
            <form id="loginForm">
              <div className="input-field">
                <input type="email" id="loginEmail" required placeholder=" " />
                <label>Email</label>
              </div>
              <div className="input-field">
                <input type="password" id="loginPassword" required placeholder=" " />
                <label>Password</label>
              </div>
              <div className="login-type">
                <input type="radio" id="loginAdmin" name="loginType" value="Admin" required />
                <label htmlFor="loginAdmin">Login as Admin</label>
                <input type="radio" id="loginUser" name="loginType" value="User" required />
                <label htmlFor="loginUser">Login as User</label>
              </div>
              <a href="#" className="forgot-pass-link">Forgot password?</a>
              <button type="submit">Log In</button>
            </form>
            <div className="bottom-link">
              Don't have an account? <a href="#" id="signup-link">Register</a>
            </div>
          </div>
        </div>

         {/* Signup Form */}
        <div class="form-box signup">
              <div class="form-details">
                  <div>
                      <img src="mslogoed.png" alt="logo"/>
                  </div>
              </div>
              <div class="form-content">
                  <h2>SIGNUP</h2>
                  <div id="signupForm">
                      <div class="input-field">
                          <input type="text" id="fullName" required placeholder=" "/>
                          <label>Enter your Full Name</label>
                      </div>
                      <div class="input-field">
                          <input type="email" id="signupEmail" required placeholder=" "/>
                          <label>Enter your email</label>
                      </div>
                      <div class="input-field">
                          <input type="password" id="signupPassword" required placeholder=" "/>
                          <label>Create password</label>
                      </div>
                      <div class="signup-type">
                        <input type="radio" id="signupAdmin" name="signup-type" value="Admin" required/>
                        <label for="signupAdmin">Register as Admin</label>
                    
                        <input type="radio" id="signupUser" name="signup-type" value="User" required/>
                        <label for="signupUser">Register as User</label>
                    </div>
                  
                    
                      <div class="policy-text">
                          <input type="checkbox" id="policy" required/>
                          <label for="policy">
                              I agree to the
                              <a href="#" class="option">Terms & Conditions</a>
                          </label>
                      </div>
                      <button type="submit">Sign Up</button>
                  </div>

                  <div class="bottom-link">
                      Already have an account? 
                      <a href="#" id="login-link">Login</a>
                  </div>
              </div>
          </div>
        </div>
    </div>
    
  );
}

export default FormPopup;
