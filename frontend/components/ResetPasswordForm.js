import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const { uid, token } = router.query; // Extract from URL

  async function handleSubmit(e) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/accounts/password-reset-confirm/${uid}/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (res.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setMessage('Failed to reset password. Please try again.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again later.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set New Password</h2>
      {message && <p>{message}</p>}
      <div>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Reset Password</button>
    </form>
  );
}
