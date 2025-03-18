import React, { useEffect, useState, useRef } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  useConversationMutation,
  useMessageUpdationMutation,
} from "../redux/api/userApi";
import {
  resetBack,
  setConversation,
  setMessage,
} from "../redux/slices/userSlice";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import notificationSound from "../assets/notification.mp3";

const Conversation = () => {
  const selectedUserName = useSelector((state) => state.users.selectedUserName);
  const loggedUserName = useSelector((state) => state.users.loggedUserName);
  const id = useSelector((state) => state.users.conversation._id);
  const currentConversation = useSelector((state) => state.users.conversation);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const [conversation, { isError, isLoading }] = useConversationMutation();
  const chatEndRef = useRef(null);
  const [messageUpdate] = useMessageUpdationMutation();
  const socket = io("https://chatapp-bf0r.onrender.com");

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
  }, [currentConversation]);

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

  return (
    <div className="d-flex flex-column vh-100">
      <div className="row p-3 border-bottom border-3 rounded-3 border-dark d-flex align-itmes-center">
        <IoMdArrowBack
          className="col-1 fs-2 ps-0"
          style={{ cursor: "pointer" }}
          onClick={handleBack}
        />
        <h5 className="col-10 fs-3">Chat to {selectedUserName}</h5>
      </div>
      <div className="flex-grow-1 overflow-auto px-3 py-2 d-flex flex-column gap-2">
        {isLoading && (
          <div className="d-flex justify-content-center align-items-center vh-100 justify-content-end">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {isError && (
          <p className="alert alert-secondary" role="alert">
            Error loading conversation.
          </p>
        )}

        {currentConversation ? (
          currentConversation?.messages?.length > 0 ? (
            currentConversation.messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded bg-light shadow d-inline-flex flex-column ${
                  msg.senderName === loggedUserName
                    ? "align-self-end bg-dark bg-opacity-75 text-white"
                    : "align-self-start bg-light text-black"
                }`}
                ref={chatEndRef}
              >
                <div>{msg.content}</div>
                <span
                  className={`text-end small ${
                    msg.senderName === loggedUserName
                      ? "text-white"
                      : "bg-light text-black"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
            ))
          ) : (
            <p className="alert alert-secondary" role="alert">
              No conversation yet
            </p>
          )
        ) : (
          <p className="alert alert-secondary" role="alert">
            Select a user to start conversation...
          </p>
        )}
      </div>
      <div className="col">
        <div className="row align-items-center">
          <div className="col-10">
            <input
              type="text"
              placeholder="Send message..."
              onChange={(e) => setContent(e.target.value)}
              value={content}
              className="form-control"
            />
          </div>
          <div className="col-1">
            <button
              onClick={handleMessageSend}
              className="btn btn-secondary w-auto"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
        pauseOnHover
        closeOnClick
      />
    </div>
  );
};

export default Conversation;
