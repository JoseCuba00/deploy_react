import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

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
                {userFound !== null && !userFound && (
                  <p style={{ color: "red" }}>Usuario no encontrado</p>
                )}
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
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
