import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAllUserQuery } from "../redux/api/userApi";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { setSelectedUserName, reset, setAllusers } from "../redux/slices/userSlice";

const Sidebar = () => {
  const loggedUserName = useSelector((state) => state.users.loggedUserName);
  const allUsers = useSelector((state) => state.users.allUsers);
  const { data, isLoading, error } = useAllUserQuery();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(reset());
    navigate("/auth");
    window.location.reload("/");
  };

  const handleUserClick = (username) => {
    dispatch(setSelectedUserName(username));
  };

  const handleChange = (e) => {
    const input = e.target.value.toLowerCase();
    if (input) {
      setFilteredUsers(allUsers.filter((u) => u.username.toLowerCase().includes(input)));
    } else {
      setFilteredUsers(allUsers);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="vh-100 d-flex flex-column">
      <div className="row p-3 border-bottom border-3 rounded-3 border-dark">
        <h5 className="col-8">Welcome, {loggedUserName}</h5>
        <BiLogOut
          size={24}
          onClick={handleLogout}
          role="button"
          className="col-4 fs-3"
        />
        <input
          type="text"
          className="form-control p-2 mt-3"
          onChange={handleChange}
          placeholder="Search users..."
        />
      </div>
      <div className="mt-3 row row-gap-2 fs-5 overflow-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div
              key={index}
              onClick={() => handleUserClick(user.username)}
              className="col-12 row p-2 border shadow"
              style={{ cursor: "pointer" }}
            >
              <div
                className="col-2 d-flex align-items-center justify-content-center bg-black text-white rounded-circle"
                style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
              >
                {user.username[0].toUpperCase()}
              </div>
              <div className="col-9 d-flex align-items-center">
                {user.username}
              </div>
            </div>
          ))
        ) : (
          <div>No users found</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
