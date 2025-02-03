import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../components/LoginForm';

test('displays an error message for incorrect login', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ detail: "Invalid credentials" }),
    })
  );

  render(<LoginForm />);
  const loginButton = screen.getByRole('button', { name: /login/i });

  await act(async () => {
    fireEvent.click(loginButton);
  });

  // ✅ Ensure the test waits for React to update properly
  await waitFor(() => {
    const errorMessage = screen.getByTestId("error-message");
    console.log("📢 Error message before assertion:", errorMessage.innerHTML);
    expect(errorMessage).not.toBeEmptyDOMElement();
    expect(errorMessage).toHaveTextContent(/Invalid credentials/i);
  }, { timeout: 5000 });
  
});
