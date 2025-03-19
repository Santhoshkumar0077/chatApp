import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSignupUserMutation } from "../redux/api/userApi";
import toast, { Toaster } from "react-hot-toast";

const Signup = ({ setlogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signup, { data, isError, isLoading }] = useSignupUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lowerCase = username.toLowerCase();
    const containSpecialCharacter = (password) => {
      const specialChars = /[!@#$%^&*(),.:{}|<>]/;
      return specialChars.test(password);
    };
    if (lowerCase.length <= 4) {
      setError("Enter at least 5 characters for username");
      toast.error("Enter at least 5 characters for username");
      return;
    }
    if (password.length <= 7) {
      setError("Enter at least 8 characters for password");
      toast.error("Enter at least 8 characters for password");
      return;
    }
    if (!containSpecialCharacter(password)) {
      setError("Enter at least one special character");
      toast.error("Enter at least one special character");
      return;
    }
    try {
      await signup({ username: lowerCase, password }).unwrap();
      setUsername("");
      setPassword("");
      setError("");
      toast.success("User registered successfully!");
      setTimeout(() => {
        setlogin(true);
      }, 2000);
    } catch (err) {
      toast.error("Signup Failed");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to right, #ff7eb3, #ff758c)" }}
    >
      <form
        className="col-12 col-md-6 col-lg-4 p-4 border rounded shadow bg-white"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-danger">Signup</h1>
        <div className="mt-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="mt-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="mt-3 text-center">
          <Link className="text-decoration-none" onClick={() => setlogin(true)}>
            Already have an account? Login
          </Link>
        </div>
        {error && <div className="mt-3 text-danger">{error}</div>}
        <button
          type="submit"
          className="btn btn-danger w-100 mt-3"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
        {data && <div className="mt-3 text-success">{data.message}</div>}
        {isError && <div className="mt-3 text-danger">Signup failed</div>}
      </form>
      <Toaster
        position="top-right"
        reverseOrder={false}
        pauseOnHover
        closeOnClick
      />
    </div>
  );
};

export default Signup;
