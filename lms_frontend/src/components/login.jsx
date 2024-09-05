import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { LoadingOutlined } from "@ant-design/icons";
import { Space, Spin } from "antd";

function Login() {
  useEffect(() => {
    const backgroundImage = `${process.env.PUBLIC_URL}/fondo6.jpg`;
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

    // Cleanup function to reset the background when the component unmounts
    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.filter = "";
    };
  }, []);

  let { loginUser, userFound } = useContext(AuthContext);
  const [userInfo, set] = useState([]);
  console.log(userFound);
  const Imprimir = () => {
    if (typeof userFound === "boolean") {
      console.log("hola");
    }
  };
  return (
    <div
      className=" mt-4 justify-content-sm-center pt-5"
      style={{ position: "absolute", top: "80px", width: "98%" }}
    >
      <div className="row justify-content-center">
        <div className="col-6 ">
          <div
            className="card"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.93)", // Fondo blanco semi-transparente
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra suave
            }}
          >
            <div className="card-body">
              <form onSubmit={loginUser}>
                <div className="mb-3">
                  <h3
                    style={{ fontWeight: "800" }}
                    className="d-flex justify-content-center"
                  >
                    User Login
                  </h3>
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Username
                  </label>
                  <input type="text" className="form-control"></input>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                  ></input>
                </div>

                <div className="d-flex justify-content-between ">
                  <div className="ps-3">
                    {userFound === null ? (
                      <Space className="ps-3">
                        <Spin
                          indicator={
                            <LoadingOutlined style={{ fontSize: 30 }} spin />
                          }
                        />
                      </Space>
                    ) : (
                      !userFound && (
                        <p style={{ color: "red" }}>Usuario no encontrado</p>
                      )
                    )}
                  </div>
                  <div className="pe-3">
                    <button
                      type="submit"
                      className="btn btn-primary "
                      onClick={() => Imprimir()}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
