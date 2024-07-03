import React, { useContext } from 'react';
import { useState, useEffect } from 'react'; // Se activa la funcion solo cuando el componente es cargado
import AuthContext from '../context/AuthContext'
import { Flex, Progress } from 'antd';

const baseUrl = "http://127.0.0.1:8000"

function Home() { // Esto es un componente, es un pedazo de UI , es como un div
    const [moduleData, setModuleData] = useState([])
    let { user, logoutUser } = useContext(AuthContext)

    // Hacer la llamada al backend y guardar los resultados en una variable 
    const makeCall = async () => {

        let response = await fetch(baseUrl);
        if (response.ok) {
            let json = await response.json();
            setModuleData(json)
            console.log(json)
        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    }
    // Hacer el llamado cuando se carge el componente 
    useEffect(() => {
        makeCall()
    }, [])
    //<a href={`/module/${module.id}/assignments/${module.first_id}`} className="btn btn-primary ">Button</a>
    //<p className="card-text "><em>{module.description}</em></p>
    return (
        <div className="container" >
            {moduleData.map((module, index) =>
                <div className=" container card mt-3 d-flex flex-row " key={index} >
                    <div className='pt-2'>
                        <div className='d-flex  iconStyle ' >
                            <img className='img_modul ' src={process.env.PUBLIC_URL + `/iconsModuls/${index}.png`} alt="Hand Icon"></img>
                        </div>
                    </div>

                    <div className=" card-body">
                        <h4 className="card-title">{module.title}</h4>
                        <div>
                            <Progress percent={30} size="small" strokeColor='#4525d2'  />

                        </div>


                        <span className='text-muted'><small>8 assignments completados de 20</small></span>
                        <div className='pt-3'>
                            <a href={`/module/${module.id}/assignments/${module.first_id}`} className="btn btn-primary "
                                style={{ background: '#341ca6', border: '1px solid transparent' }}
                            >Button</a>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;