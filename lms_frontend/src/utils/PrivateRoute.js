import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode"; // Import correctly without destructuring

import axios from "axios";

const PrivateRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState([]); // Use correct camelCase for setState function
  //const { authTokens, setAuthTokens } = useContext(AuthContext); // Destructure from AuthContext
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  useEffect(() => {
    const authenticate = async () => {
      try {
        await auth();
      } catch {
        setIsAuthorized(false);
      }
    };
    authenticate();
  }, []);

  const refreshToken = async () => {
    try {
      const api = axios.create({
        baseURL: "http://127.0.0.1:8000",
      });

      api.interceptors.request.use(
        (config) => {
          if (authTokens) {
            config.headers.Authorization = `Bearer ${authTokens.access}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      const res = await api.post("/token/refresh/", {
        refresh: authTokens.refresh,
      });
      if (res.status === 200) {
        setAuthTokens(res.data); // Update context
        console.log(res.data);
        localStorage.setItem("authTokens", JSON.stringify(res.data)); // Store as a string
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log("Failed to refresh token", error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    if (!authTokens) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(authTokens.access);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
