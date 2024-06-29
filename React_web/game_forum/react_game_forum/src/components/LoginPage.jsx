import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    // Logic for Google OAuth login
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
