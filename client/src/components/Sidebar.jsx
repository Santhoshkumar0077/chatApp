import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, setError, logoutUser } from "../features/userSlice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setLoggedUser, setSelectedUser, resetConversation } from "../features/conversationSlice";

const Sidebar = ({ isSmallScreen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.users);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const loggedUser = useSelector((state) => state.conversation.loggedUser);
  const loggedUsername = Cookies.get("loggedusername");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/all", {
          withCredentials: true,
        });
        dispatch(setLoggedUser(loggedUsername));
        dispatch(setUsers(response.data));
        setFilteredUsers(response.data);
      } catch (error) {
        dispatch(setError(error.response?.data || "Unauthorized"));
        Cookies.remove("token");
        Cookies.remove("loggedusername");
        dispatch(logoutUser());
        navigate("/auth");
      }
    };

    fetchUsers();
  }, [dispatch, navigate, loggedUsername]);

  const handleUserClick = (username) => {
    dispatch(setSelectedUser(username));
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchValue)
    );
    setFilteredUsers(filtered);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("loggedusername");
    dispatch(resetConversation());
    navigate("/auth");
  };

  return (
    <div className={`p-3 ${isSmallScreen ? "w-100" : "col-md-3 bg-dark text-white vh-100"}`}>
      <h3 className="mb-4">Welcome, {loggedUser}</h3>
      <input
        type="text"
        placeholder="Search users..."
        onChange={handleSearch}
        className="form-control mb-4"
      />
      <ul className="list-unstyled">
        {filteredUsers.map((user) => (
          <li
            key={user._id}
            onClick={() => handleUserClick(user.username)}
            className="mb-2 p-2 bg-secondary rounded cursor-pointer"
          >
            {user.username}
          </li>
        ))}
      </ul>
      <button onClick={handleLogout} className="btn btn-danger w-100">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
