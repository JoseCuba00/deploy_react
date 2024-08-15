import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [userFound, setUserFound] = useState(null);

  const navigate = useNavigate();

  let loginUser = async (e) => {
    setUserFound(null);
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target[0].value,
        password: e.target[1].value,
      }),
    });

    if (response.status === 401) {
      navigate("/login");
      setUserFound(false);
    } else {
      let data = await response.json();

      if (data) {
        localStorage.setItem("authTokens", JSON.stringify(data));

        setAuthTokens(data);

        setUser(jwtDecode(data.access));
        setUserFound(true);
        navigate("/");
      } else {
        alert("Something went wrong while loggin in the user!");
      }
    }
  };

  let logoutUser = () => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    navigate("/login");
  };

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    userFound: userFound,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
