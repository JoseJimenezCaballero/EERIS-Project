import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserIdState] = useState(null);
  const [role, setRoleState] = useState(null); // ✅ new state for role

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");

    if (storedUserId) {
      setUserIdState(storedUserId);
    }

    if (storedRole) {
      setRoleState(storedRole);
    }
  }, []);

  const setUserId = (id) => {
    setUserIdState(id);
    localStorage.setItem("userId", id);
  };

  const setRole = (newRole) => {
    setRoleState(newRole);
    localStorage.setItem("role", newRole);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
