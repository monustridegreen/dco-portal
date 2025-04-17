/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

import api from '../../utils/restApi/apis/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const access_token = localStorage.getItem('access_token');
  const BASE_URL = 'https://odyssey.stridegreen.in/spacedock/';
  const AUTH_BASE_URL = 'https://odyssey.stridegreen.in/observatory/';

  useEffect(() => {
    if (access_token) {
      window.location.href = '/engage/dashboard';
    }
  }, [access_token]);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginClick = async () => {
    if (!username || !password) {
      toast.error('Please enter both username and password.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await api.handleLogin(username, password);
      if (response?.data?.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        toast.success('Login successful!');
        setTimeout(() => {
          window.location.href = '/engage/dashboard';
        }, 1000);
      } else {
        toast.error('Invalid username or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="login_bg">
      <div className="login_body">
        <div className="card">
          <div className="top-block1"></div>
          <div className="top-block2"></div>
          <div className="logo_se text-center">{/* <img src={Logo} width={150} alt="Logo" /> */}</div>
          <div className="title mt-5">
            <h1>
              DCO Lead Generation
              <br /> Portal
            </h1>
          </div>
          <div className="input-block">
            <div className="block">
              <i className="fas fa-user-alt"></i>
              <input className="username" placeholder="Username" onChange={handleUsername} required />
            </div>
            <div className="block">
              <i className="fas fa-lock"></i>
              <input type="password" className="password" placeholder="Password" onChange={handlePassword} required />
            </div>
            <button className="button_login" onClick={handleLoginClick} disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging...' : 'LOGIN'}
            </button>
          </div>
          <div className="link-block mt-4">
            <div className="block forget">
              <h5>Forget Username Password?</h5>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
};

export default Login;
