import React  from 'react';
import { Link } from 'react-router-dom';

function Profile() { // Esto es un componente, es un pedazo de UI , es como un div
    

    return (
        <Link  to = 'change_password'  className="btn btn-outline-success my-2 " type="submit">Change password</Link>
);
}

export default Profile;