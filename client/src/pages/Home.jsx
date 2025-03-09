import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Sidebar from "../components/Sidebar";
import Conversation from "../components/Conversation";
import NotificationManager from "../components/NotificationManager";

const Home = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const { id } = useSelector((state) => state.conversation);
  
  const getScreenSize = () => window.innerWidth <= 600;
  const [isSmallScreen, setIsSmallScreen] = useState(getScreenSize());

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [navigate, token]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(getScreenSize());
    };

    const interval = setInterval(checkScreenSize, 500); // Check every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NotificationManager />
      <div className="container-fluid vh-100">
        <div className="row h-100">
          {isSmallScreen ? (
            !id ? (
              <div className="col-12 p-0">
                <Sidebar />
              </div>
            ) : (
              <div className="col-12 p-0">
                <Conversation key={id} />
              </div>
            )
          ) : (
            <div className="d-flex w-100 h-100">
              <div className="col-md-3">
                <Sidebar />
              </div>
              <div className="col-md-9">
                <Conversation />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
