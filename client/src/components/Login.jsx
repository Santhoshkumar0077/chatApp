import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../redux/api/userApi";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { setLoggedUserName } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = ({ setlogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginuser, { data, isError, isLoading }] = useLoginUserMutation();
  const handleLogin = async (e) => {
    e.preventDefault();

    const lowerCase = username.toLowerCase()
    if (!lowerCase || !password) {
      toast.error("All fields required");
      return;
    }
    try {
      const res = await loginuser({ lowerCase, password }).unwrap();
      setUsername("");
      setPassword("");
      toast.success("Login succesful!");
      Cookies.set("token", res.token);
      dispatch(setLoggedUserName(res.username));
      setTimeout(() => {
        Navigate("/");
      }, 500);
    } catch (error) { }
  };
  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to right, #667eea, #764ba2)" }}
    >
      <form
        className="col-12 col-md-6 col-lg-4 p-4 border rounded shadow bg-white"
        onSubmit={handleLogin}
      >
        <h1 className="text-center text-primary">Login</h1>
        <div className="mt-3">
          <label htmlFor="" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="mt-3">
          <label htmlFor="" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="mt-3 text-center">
          <Link
            className="text-decoration-none"
            onClick={() => setlogin(false)}
          >
            Don't have an account?
          </Link>
        </div>
        <button
          disabled={isLoading}
          type="submit"
          className="btn btn-primary w-100 mt-3"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {isError && (
          <div className="mt-3 text-danger">Login failed. Try again</div>
        )}
        {data && <div className="mt-3 text-success">{data.message}</div>}
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

export default Login;
