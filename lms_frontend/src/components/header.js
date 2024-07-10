import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext';

function Header() { // Esto es un componente, es un pedazo de UI , es como un div
    let { user } = useContext(AuthContext)
    let { logoutUser } = useContext(AuthContext)


    return (
        <nav className="navbar navbar-expand-lg navbar-light  " style={{ "backgroundColor": "#4525d2", 'color': 'white' }}>

            <div className="container collapse navbar-collapse " id="navbarSupportedContent">
                <span className="nav-link navHeaderFont"  >LMS

                </span>
                <ul className="navbar-nav mx-auto navHeaderFont ">
                    <li className="nav-item active">
                        <Link className="nav-link " to="/">
                        <span className='navHeaderFont' >Home</span>
                        </Link>
                    </li>
                    <li className="nav-item active navHeaderFont">
                        <Link className="nav-link " to="/profile/">
                            <span className='navHeaderFont' >Profile</span>
                        </Link>
                    </li>

                    <li className="nav-item active">
                        {user ? (
                            <Link className="nav-link navHeaderFont" onClick={logoutUser}>
                                <span className='navHeaderFont' >Log out</span>
                            </Link>
                        ) : (
                            <Link className="nav-link navHeaderFont" to="/login">
                                <span className='navHeaderFont' >Log in</span>
                            </Link >
                        )}

                    </li>
                </ul>
                <div className='d-flex align-items-center'>
                    <div >
                        <span className='pe-2 ' style={{ 'fontSize': '1.30rem', 'userSelect': 'none' }}>Hola {user.username} </span>
                    </div>
                    <div>
                        <img className='img_message ' src={process.env.PUBLIC_URL + '/hand.png'} alt="Hand Icon"></img>
                    </div>


                </div>
            </div>
        </nav>

    );
}

export default Header;