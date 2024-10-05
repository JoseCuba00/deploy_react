import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Button, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

function Header() {
  // Esto es un componente, es un pedazo de UI , es como un div
  let { user } = useContext(AuthContext);
  let { logoutUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { confirm } = Modal;

  const showPromiseConfirm = () => {
    confirm({
      title: "Estas seguro que te quieres deslogear ?",
      icon: <ExclamationCircleFilled />,
      style: {
        top: 200,
      },
      async onOk(e) {
        await logoutUser(e); // Llama a la función de manera asíncrona si es necesario
      },
      onCancel() {},
    });
  };

  return (
    <nav
      className="navbar navbar-expand-sm navbar-light fixed-top"
      style={{
        backgroundColor: "white",
        boxShadow: "0px 0px 8px -5px rgb(1, 1, 1, 0.5)",
      }}
    >
      <div className="container">
        {/* Logo */}
        <div>
          <img
            className="img_logo"
            src={process.env.PUBLIC_URL + "/logo.png"}
          ></img>
        </div>
        {/* Botón de colapso */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido colapsable */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto navHeaderFont">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                <span className="navHeaderFont buttom-link h5">Home</span>
              </Link>
            </li>
            <li className="nav-item active navHeaderFont">
              <Link className="nav-link" to="/profile/">
                <span className="navHeaderFont  buttom-link h5">Profile</span>
              </Link>
            </li>
            <li className="nav-item active">
              {user ? (
                <Link
                  className="nav-link navHeaderFont"
                  onClick={showPromiseConfirm}
                >
                  <span className="navHeaderFont buttom-link h5">Log out</span>
                </Link>
              ) : (
                <Link className="nav-link navHeaderFont" to="/login">
                  <span className="navHeaderFont buttom-link h5">Log in</span>
                </Link>
              )}
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <div>
              <span className="pe-2 navHeaderFont h5">Hola </span>
            </div>
            <div>
              <img
                className="img_message"
                src={process.env.PUBLIC_URL + "/hand.png"}
                alt="Hand Icon"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
