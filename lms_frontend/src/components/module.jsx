import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";
import { Progress } from "antd";

function Module({ TopicData }) {
  let { module_id } = useParams();
  const currentPath = `/module/${module_id}`;
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <button
        className="btn-toggle  d-md-none" // Añade la clase navbar-toggler
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "70px",
          left: "10px",
          zIndex: 1000,
        }}
      ></button>

      <div
        className={`scrollable-menu ${
          isCollapsed ? "" : "active"
        } d-flex flex-column align-items-stretch flex-shrink-0 fixed`}
        style={{
          background: "rgb(245,245,245)",
          position: "fixed",
          top: "109px",
          height: "calc(100vh - 110px)", // Ajusta la altura según sea necesario
          zIndex: 1000,
        }}
        id="navbarSupportedContent"
      >
        <div className="list-group list-group-flush fixed">
          <ul className="list-unstyled ps-0">
            {TopicData.map((topic, indexTopic) => {
              const collapseId = `collapse-${indexTopic}`;
              return (
                <li className="mb-1 border-bottom" key={indexTopic}>
                  <button
                    className="btn btn-toggle align-items-center rounded collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded="true"
                  >
                    {indexTopic + 1}- {topic.title}
                  </button>
                  <div className="collapse show" id={collapseId}>
                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small ">
                      {topic.assignments.map((quiz, index) => (
                        <li key={quiz.assignments.id}>
                          <Link
                            to={`${currentPath}/assignments/${quiz.assignments.id}`}
                            className="link-dark rounded assignments"
                          >
                            <div>
                              <Progress
                                type="circle"
                                percent={(quiz.completed * 100) / quiz.total}
                                size={12}
                              />
                            </div>
                            <div className="ps-2" key={index}>
                              {String(indexTopic + 1) +
                                "." +
                                String(index) +
                                "-" +
                                quiz.assignments.title}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Module;
