import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

// Otros componentes importados aquí
import Header from "./header";
import DrapDropQuiz from "./quiz/DrapDropQuiz";
import SelectQuiz from "./quiz/selectQuiz";
import Quiz from "./quiz/quiz";
import DropDownQuiz from "./quiz/dropDownQuiz";
import CheckBoxQuiz from "./quiz/checkBoxQuiz";

import Home from "./home";
import Module from "./module";
import Login from "./login";
import Profile from "./profile";
import Assignments from "./assignments";
import PrivateRoute from "../utils/PrivateRoute";
import { AuthProvider } from "../context/AuthContext";
import ChangePassword from "./changePassword";

function Main() {
  const location = useLocation();
  console.log(location.pathname);

  const isLoginPage = location.pathname === "/login";
  return (
    <div className="App">
      <AuthProvider>
        {!isLoginPage && <Header />}

        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/module/:module_id/assignments/:assignments_id"
            element={
              <PrivateRoute>
                <Assignments />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="profile/change_password"
            element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default Main;
