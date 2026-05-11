import { useState } from 'react';

function LoginPage({ onLogin, setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data);
        return;
      }

      onLogin(data);

    } catch {
      setError('Failed to login');
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>

      {error && (
        <p className="form-error">
          {error}
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
        <button className="btn" onClick={handleLogin}>
          Login
        </button>

        <button
          className="btn"
          onClick={() => setPage('register')}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default LoginPage;