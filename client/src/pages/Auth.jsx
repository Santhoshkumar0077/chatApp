import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Auth = () => {
  const [login, setLogin] = useState(true);
  return (
    <div>
      {login ? (
        <Login setlogin={setLogin} />
      ) : (
        <Signup setlogin={setLogin} />
      )}
    </div>
  );
};

export default Auth;
