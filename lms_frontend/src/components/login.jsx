import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Login() {
  // Esto es un componente, es un pedazo de UI , es como un div

  let { loginUser, userFound } = useContext(AuthContext);
  return (
    <div
      className="container mt-4 justify-content-sm-center pt-5"
      style={{ position: "absolute", top: "80px" }}
    >
      <div className="row justify-content-center">
        <div className="col-6 offset-3">
          <div className="card">
            <div className="card-body">
              <form onSubmit={loginUser}>
                <div className="mb-3">
                  <h3 className="d-flex justify-content-center">User Login</h3>
                  <label for="exampleInputEmail1" className="form-label">
                    Username
                  </label>

                  <input type="text" className="form-control"></input>
                </div>
                <div className="mb-3">
                  <label for="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                  ></input>
                </div>
                {userFound !== null && !userFound && (
                  <p style={{ color: "red" }}>
                    Usuario no encontrado encontrado
                  </p>
                )}
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
