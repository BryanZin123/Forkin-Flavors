import { useState } from "react";
import { useRouter } from "next/router"; // For navigation in Next.js


export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const router = useRouter(); // Initialize Next.js router

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !username || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/accounts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (res.ok) {
        setSuccess('Registration successful! You can now log in.');
        setError(null);

        // Reset form fields
        setEmail('');
        setUsername('');
        setPassword('');
      } else {
        const data = await res.json();
        
        // Handle specific errors
        if (data.email) {
          setError(`Email error: ${data.email}`);
        } else if (data.username) {
          setError(`Username error: ${data.username}`);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError('Something went wrong. Please try again.');
        }
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
    }
  }

  function goToLogin() {
    router.push('/login'); // Navigate to login page
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && (
        <div>
          <p style={{ color: 'green' }}>{success}</p>
          <button type="button" onClick={goToLogin}>
            Go to Login
          </button>
        </div>
      )}

      {!success && (
        <>
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
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <button type="submit">Sign Up</button>
        </>
      )}
    </form>
  );
}
