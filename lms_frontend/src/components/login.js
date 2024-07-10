import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'


function Login() { // Esto es un componente, es un pedazo de UI , es como un div

    let {loginUser,userFound} = useContext(AuthContext)
        return (
        <div className="container mt-4 justify-content-sm-center pt-5">
            <div className="row">
                <div className="col-6 offset-3">
                    <div className="card">
                        <h5 className="card-header">User Login</h5>
                        <div className="card-body">
                            <form onSubmit={loginUser} >
                                <div className="mb-3">
                                    <label for='exampleInputEmail1' className="form-label">Username</label>
                                    {userFound !== null && !userFound && <p>No encontrado</p>}
                                    <input type="text" className="form-control"></input>
                                </div>
                                <div className="mb-3">
                                    <label for='exampleInputPassword1' className="form-label">Password</label>
                                    <input type='password' className="form-control" id='exampleInputPassword1'></input>
                                </div>

                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;