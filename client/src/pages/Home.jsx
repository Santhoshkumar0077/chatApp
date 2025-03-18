import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Conversation from "../components/Conversation";
import { useSelector } from "react-redux";

const Home = () => {
  const selectedUserName = useSelector((state) => state.users.selectedUserName);
  const [mobileView, setMobileView] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 600);
      
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container-fluid" style={{fontFamily:"Helvetica, Arial, sans-serif"}}>
      <div className="row">
        {mobileView ? (
          selectedUserName ? (
            <div className="col-12 vh-90 d-flex flex-column vh-100">
              <Conversation />
            </div>
          ) : (
            <div className="col-12  vh-90">
              <Sidebar />
            </div>
          )
        ) : (
          <>
            <div className="col-lg-3 col-md-3 vh-100">
              <Sidebar />
            </div>
            <div className="col-lg-9 col-md-9 vh-100 d-flex flex-column vh-100">
              <Conversation />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
