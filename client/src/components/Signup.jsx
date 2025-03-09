import { useState } from "react";
import axios from "axios";

const Signup = ({ setAuthState }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        password,
      });

      alert("Signup successful. Please login!");
      setAuthState("login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div>
      <h2 className="text-center">Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Signup</button>
      </form>
      <p className="text-center mt-3">
        Already have an account? 
        <button className="btn btn-link" onClick={() => setAuthState("login")}>
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;
