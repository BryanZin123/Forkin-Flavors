import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem('access'); // Retrieve access token

        if (!token) {
          throw new Error('No access token found. Please log in again.');
        }

        const res = await fetch('http://127.0.0.1:8000/api/accounts/user-data/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include Bearer token in the header
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        } else if (res.status === 401) {
          // Token expired or invalid
          await handleTokenRefresh(); // Attempt to refresh token
          return fetchUserData(); // Retry after refreshing token
        } else {
          throw new Error(`Failed to fetch data: ${res.status}`);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user data:', err);
      }
    }

    fetchUserData();
  }, []);

  async function handleTokenRefresh() {
    try {
      const refresh = localStorage.getItem('refresh'); // Retrieve refresh token

      if (!refresh) {
        throw new Error('No refresh token found. Please log in again.');
      }

      const res = await fetch('http://127.0.0.1:8000/api/accounts/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      if (res.ok) {
        const { access } = await res.json();
        localStorage.setItem('access', access); // Update access token
      } else {
        throw new Error('Failed to refresh token. Please log in again.');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error refreshing token:', err);
      window.location.href = '/login'; // Redirect to login if refresh fails
    }
  }

  async function handleLogout() {
    const refreshToken = localStorage.getItem('refresh');
    const accessToken = localStorage.getItem('access'); // Get access token

    if (!refreshToken || !accessToken) {
        console.error('No tokens found.');
        return;
    }

    console.log('Sending logout request with refresh token:', refreshToken); // Debugging

    const res = await fetch('http://127.0.0.1:8000/api/accounts/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}` // ✅ Send the access token
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (res.ok) {
        console.log('Logout successful');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login'; // Redirect to login page
    } else {
        const errorData = await res.json();
        console.error('Logout failed:', errorData.detail || errorData);
    }
}


  async function handlePasswordReset() {
    try {
      const email = userData?.email; // Assuming userData contains the email
      if (!email) {
        throw new Error('User email not found.');
      }

      const res = await fetch('http://127.0.0.1:8000/api/accounts/password-reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccessMessage('Password reset email sent successfully.');
      } else {
        throw new Error('Failed to send reset email.');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error resetting password:', err.message);
    }
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handlePasswordReset}>Reset Password</button>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Your Recipes</h2>
      <ul>
        {userData.recipes.map((recipe) => (
          <li key={recipe.id}>{recipe.title}</li>
        ))}
      </ul>
    </div>
  );
}
