import React, { useContext } from "react";
import { useState, useEffect } from "react"; // Se activa la funcion solo cuando el componente es cargado
import AuthContext from "../context/AuthContext";
import { Progress } from "antd";
import { useNavigate } from "react-router-dom";

function Home() {
  // Esto es un componente, es un pedazo de UI , es como un div
  const [moduleData, setModuleData] = useState([]);
  let { user } = useContext(AuthContext);

  const baseUrl = `https://web-production-0a07.up.railway.app/home?student_id=${user.id}`;
  // Hacer la llamada al backend y guardar los resultados en una variable
  const makeCall = async () => {
    let response = await fetch(baseUrl, {
      credentials: "include",
    });
    if (response.ok) {
      let json = await response.json();
      console.log(json);
      setModuleData(json);
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  };
  // Hacer el llamado cuando se carge el componente
  useEffect(() => {
    makeCall();
  }, []);
  const navigate = useNavigate();
  //<a href={`/module/${module.id}/assignments/${module.first_id}`} className="btn btn-primary ">Button</a>
  //<p className="card-text "><em>{module.description}</em></p>

  return (
    <div className="container ">
      {moduleData.map((module, index) => {
        let assignmentsCompleted = 0;
        let totalAssignments = 0;

        module.topics.forEach((assignments, index) => {
          totalAssignments++;
          assignments.total <= assignments.completed && assignmentsCompleted++;
        });

        return (
          <div
            className=" container  card mt-4 d-flex flex-row home-card "
            key={index}
            style={{ padding: "10px", top: "60px" }}
            onClick={() => {
              navigate(`/module/${module.id}/assignments/${module.first_id}`);
            }}
          >
            <div className="pt-2">
              <div className="d-flex  iconStyle ">
                <img
                  className="img_modul "
                  src={process.env.PUBLIC_URL + `/iconsModuls/${index}.png`}
                  alt="Hand Icon"
                ></img>
              </div>
            </div>

            <div className=" card-body mb-3">
              <h4 className="card-title">{module.title}</h4>

              <div>
                <Progress
                  percent={Math.round(
                    (assignmentsCompleted * 100) / totalAssignments
                  )}
                  size="small"
                />
              </div>

              <span className="text-muted">
                <small>
                  {assignmentsCompleted} assignments completados de{" "}
                  {totalAssignments}
                </small>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
