import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import NavBar from './NavBar';
import '../styles.css';

const LoginPage = () => {
  const { setUserId, setRole } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();

      // ✅ Assume backend responds with: { userId: 'abc123', role: 'manager' }
      console.log(data.userId, data.role)
      setUserId(data.userId);
      setRole(data.role);
      navigate('/home');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Invalid credentials. Please try again.');
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