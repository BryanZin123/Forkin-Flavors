import { useState } from 'react';

export default function PasswordResetForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/accounts/password-reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage('Password reset link sent to your email.');
      } else {
        setMessage('Failed to send reset link. Please try again.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again later.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Send Reset Link</button>
    </form>
  );
}
