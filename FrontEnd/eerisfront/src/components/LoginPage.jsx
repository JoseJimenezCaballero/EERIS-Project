import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import NavBar from './NavBar';
import '../styles.css';

const LoginPage = () => {
  const { setUserId } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Replace this with your backend call
      // Example: const response = await fetch('http://localhost:5000/login', { ... })
      // Mock user ID for now:
      const mockUserId = 'demoUser123';
      setUserId(mockUserId);
      navigate('/home');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="login-container">
        <form className="login-box" onSubmit={handleLogin}>
          <h2>LOG IN</h2>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">LOG IN</button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;