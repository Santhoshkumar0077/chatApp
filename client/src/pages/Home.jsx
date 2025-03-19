import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAllUserQuery } from "../redux/api/userApi";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../index.css";
import {
  setSelectedUserName,
  reset,
  setAllusers,
  resetBack,
  setConversation,
  setMessage,
} from "../redux/slices/userSlice";
import { IoMdArrowBack } from "react-icons/io";
import {
  useConversationMutation,
  useMessageUpdationMutation,
} from "../redux/api/userApi";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import notificationSound from "../assets/notification.mp3";
import "../index.css";

const Home = () => {
  const [mobileView, setMobileView] = useState(window.innerWidth < 600);
  const loggedUserName = useSelector((state) => state.users.loggedUserName);
  const allUsers = useSelector((state) => state.users.allUsers);
  const selectedUserName = useSelector((state) => state.users.selectedUserName);
  const id = useSelector((state) => state.users.conversation._id);
  const currentConversation = useSelector((state) => state.users.conversation);
  const [content, setContent] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useAllUserQuery();
  const [
    conversation,
    { isError: isConversationError, isLoading: isConversationLoading },
  ] = useConversationMutation();
  const [messageUpdate] = useMessageUpdationMutation();
  const socket = io("https://chatapp-bf0r.onrender.com");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loggedUserName) {
      navigate("/auth");
      window.location.reload("/auth");
      return;
    }
    if (data?.users) {
      dispatch(setAllusers(data.users));
      setFilteredUsers(data.users);
    }
  }, [data]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (id) {
      socket.emit("joinRoom", id);
    }

    const handleReceiveMessage = ({ message }) => {
      dispatch(setMessage(message));
      if (
        message.senderName !== loggedUserName &&
        message.senderName !== selectedUserName
      ) {
        if (Notification.permission === "granted")
          new Notification("From chatApp", {
            body: `${message.senderName}: ${message.content}`,
          });

        const sound = new Audio(notificationSound);
        sound.play();
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [id, loggedUserName]);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await conversation({
          loggedUserName,
          selectedUserName,
        }).unwrap();
        if (res.existingConversation) {
          dispatch(setConversation(res.existingConversation));
        } else if (res.newConversation) {
          dispatch(setConversation(res.newConversation));
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    if (selectedUserName) {
      fetchConversation();
    }
  }, [selectedUserName, dispatch, loggedUserName]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation.messages]);

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(reset());
    navigate("/auth");
    window.location.reload("/");
  };

  const handleUserClick = (username) => {
    dispatch(resetBack());
    dispatch(setSelectedUserName(username));
  };

  const handleChange = (e) => {
    const input = e.target.value.toLowerCase();
    if (input) {
      setFilteredUsers(
        allUsers.filter((u) => u.username.toLowerCase().includes(input))
      );
    } else {
      setFilteredUsers(allUsers);
    }
  };

  const handleMessageSend = async () => {
    try {
      if (content.trim() === "") {
        toast.error("Message is empty");
        return;
      }

      await messageUpdate({ id, loggedUserName, content }).unwrap();

      socket.emit("sendMessage", {
        id,
        message: {
          content,
          senderName: loggedUserName,
          createdAt: Date.now(),
        },
      });

      setContent("");
    } catch (error) {
      console.error("Error occurred while sending message");
    }
  };

  const handleBack = () => {
    dispatch(resetBack());
  };

  if (isLoading || isConversationLoading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error || isConversationError)
    return (
      <div className="alert alert-danger" role="alert">
        Error loading users
      </div>
    );

  return (
    <div>
      {mobileView ? (
        <div>
          {selectedUserName ? (
            <div className="conversation-container">
              <div className="conversation-top">
                <IoMdArrowBack
                  className="conversation-top-arrow"
                  style={{ cursor: "pointer" }}
                  onClick={handleBack}
                />
                <h3 className="conversation-top-heading">
                  Chat to {selectedUserName}
                </h3>
              </div>
              <div className="conversation-middle">
                {currentConversation?.messages?.map((msg, index) => (
                  <div
                    key={index}
                    className={`conversation-middle-list ${
                      msg.senderName === loggedUserName ? "send" : "receive"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
              <div className="conversation-bottom">
                <input
                  type="text"
                  placeholder="Send message..."
                  className="conversation-bottom-input"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button
                  className="conversation-bottom-button"
                  onClick={handleMessageSend}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="sidebar-container">
              <div className="sidebar-top">
                <h5 className="sidebar-top-heading">
                  Welcome, {loggedUserName}
                </h5>
                <input
                  type="text"
                  className="sidebar-top-input"
                  onChange={handleChange}
                  placeholder="Search users..."
                />
              </div>
              <div className="sidebar-bottom">
                {filteredUsers.map((user, index) => (
                  <div
                    key={index}
                    onClick={() => handleUserClick(user.username)}
                    className="sidebar-bottom-list"
                  >
                    {user.username}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="home-container">
          <div className="sidebar-container">
            <div className="sidebar-top">
              <h5 className="sidebar-top-heading">Welcome, {loggedUserName}</h5>
              <input
                type="text"
                className="sidebar-top-input"
                onChange={handleChange}
                placeholder="Search users..."
              />
            </div>
            <div className="sidebar-bottom">
              {filteredUsers.map((user, index) => (
                <div
                  key={index}
                  onClick={() => handleUserClick(user.username)}
                  className="sidebar-bottom-list"
                >
                  {user.username}
                </div>
              ))}
            </div>
          </div>
          <div className="conversation-container">
            <div className="conversation-top">
              <IoMdArrowBack
                className="conversation-top-arrow"
                style={{ cursor: "pointer" }}
                onClick={handleBack}
              />
              <h3 className="conversation-top-heading">
                Chat to {selectedUserName}
              </h3>
            </div>
            <div className="conversation-middle">
              {currentConversation?.messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`conversation-middle-list ${
                    msg.senderName === loggedUserName ? "send" : "receive"
                  }`}
                  ref={chatEndRef}
                >
                  {msg.content}
                  <span className={`conversation-middle-list-time`}>
                    {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
            <div className="conversation-bottom">
              <input
                type="text"
                placeholder="Send message..."
                className="conversation-bottom-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                className="conversation-bottom-button"
                onClick={handleMessageSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster
        position="top-right"
        reverseOrder={false}
        pauseOnHover
        closeOnClick
      />
    </div>
  );
};

export default Home;
// import React, { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Conversation from "../components/Conversation";
// import { useSelector } from "react-redux";

// const Home = () => {
//   const selectedUserName = useSelector((state) => state.users.selectedUserName);
//   const [mobileView, setMobileView] = useState(window.innerWidth < 600);

//   useEffect(() => {
//     const handleResize = () => {
//       setMobileView(window.innerWidth < 600);

//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <div className="container-fluid" style={{fontFamily:"Helvetica, Arial, sans-serif"}}>
//       <div className="row">
//         {mobileView ? (
//           selectedUserName ? (
//             <div className="col-12 vh-90 d-flex flex-column vh-100">
//               <Conversation />
//             </div>
//           ) : (
//             <div className="col-12  vh-90">
//               <Sidebar />
//             </div>
//           )
//         ) : (
//           <>
//             <div className="col-lg-3 col-md-3 vh-100">
//               <Sidebar />
//             </div>
//             <div className="col-lg-9 col-md-9 vh-100 d-flex flex-column vh-100">
//               <Conversation />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;
