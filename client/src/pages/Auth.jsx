import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Auth = () => {
  const [authState, setAuthState] = useState("login");

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        {authState === "login" ? (
          <Login setAuthState={setAuthState} />
        ) : (
          <Signup setAuthState={setAuthState} />
        )}
      </div>
    </div>
  );
};

export default Auth;
