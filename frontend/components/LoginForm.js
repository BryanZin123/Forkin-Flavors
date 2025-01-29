import { useState } from 'react';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
        credentials: 'include', // Important for cookies (if using httpOnly cookies)
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access', data.access); // Store access token
        localStorage.setItem('refresh', data.refresh); // Store refresh token
        setMessage('Login successful! Redirecting...');
        setTimeout(() => window.location.href = '/dashboard', 2000);
      } else {
        setMessage('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <div>
        <label htmlFor="identifier">Username or Email:</label>
        <input
          type="text"
          id="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
