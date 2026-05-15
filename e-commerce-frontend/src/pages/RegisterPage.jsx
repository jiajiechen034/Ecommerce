import { useState } from 'react';
import { API_BASE_URL } from '../config/api';

function RegisterPage({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    setMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.text();

      if (!res.ok) {
        setMessage(data);
        return;
      }

      setMessage('Account created successfully');

    } catch {
      setMessage('Failed to register');
    }
  };

  return (
    <div className="auth-card">
      <h2>Register</h2>

      {message && (
        <p className="loading-message">
          {message}
        </p>
      )}

      <div className="form-group">
        <input
          className="form-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button className="btn" onClick={handleRegister}>
          Register
        </button>

        <button
          className="btn"
          onClick={() => setPage('login')}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;