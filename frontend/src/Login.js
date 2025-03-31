import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onLogin(username, password)) {
      navigate("/profile"); // Only go to Profile if login es successful
    } else {
      alert("User or Password, incorrect!"); // Show error message
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Accept</button>
      </form>
    </div>
  );
}

export default Login;
