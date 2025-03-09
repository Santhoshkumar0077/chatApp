

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, addMessage, setConversationId, resetCurrentConversation } from "../features/conversationSlice";
import axios from "axios";
import socket from "../utils/socket";
import { IoMdArrowBack } from "react-icons/io";

const Conversation = ({ isSmallScreen }) => {
  const dispatch = useDispatch();
  const { loggedUser, selectedUser, messages, id } = useSelector((state) => state.conversation);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchConversation = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/get-conversation", {
          loggedUser,
          selectedUser,
        });

        dispatch(setMessages(response.data.messages));
        dispatch(setConversationId(response.data._id));
        socket.emit("joinRoom", response.data._id);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();
  }, [selectedUser, dispatch, loggedUser]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (message.senderName === selectedUser) {
        dispatch(addMessage(message));
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [dispatch, selectedUser]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { senderName: loggedUser, content: input, createdAt: Date.now() };

    if (id) {
      socket.emit("sendMessage", { id, newMessage });
      dispatch(addMessage(newMessage));
    }

    try {
      await axios.post("http://localhost:5000/api/auth/send-message", {
        loggedUser,
        selectedUser,
        content: input,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
  };

  const handleClearChat = () => {
    dispatch(resetCurrentConversation());
  };

  return (
    <div className={`p-3 ${isSmallScreen ? "w-100" : "col-md-9 bg-light vh-100"}`}>
      <div className="d-flex align-items-center mb-3">
        <button onClick={handleClearChat} className="btn btn-link p-0 me-2">
          <IoMdArrowBack size={30} className="text-danger" />
        </button>
        {selectedUser ? <h3 className="mb-0">Chat with {selectedUser}</h3> : <h3 className="mb-0">Select a user</h3>}
      </div>
      <div className="messages bg-white p-3 rounded shadow-sm" style={{ height: "70vh", overflowY: "auto" }}>
        {messages.length > 0 ? (
          <ul className="list-unstyled">
            {messages.map(({ content, senderName }, index) => (
              <li key={index} className={`mb-2 ${senderName === loggedUser ? "text-end" : "text-start"}`}>
                <div className={`d-inline-block p-2 rounded ${senderName === loggedUser ? "bg-primary text-white" : "bg-light"}`}>
                  {content}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No conversation yet</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      {selectedUser && (
        <div className="mt-3 d-flex">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="form-control me-2" placeholder="Type a message..." />
          <button onClick={sendMessage} className="btn btn-primary">Send</button>
        </div>
      )}
    </div>
  );
};

export default Conversation;
