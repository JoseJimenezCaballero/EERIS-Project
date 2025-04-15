// UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserIdState] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserIdState(storedUserId);
    }
  }, []);

  const setUserId = (id) => {
    setUserIdState(id);
    localStorage.setItem("userId", id); // ✅ store in localStorage
  };

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children} {/*We are saying all the components wrapped by UserContext will have access to the userId and the setter */}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);//now all children components can use the context by 
                                                    //calling the custom hook useUser()
