import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import AuthContext from "../context/AuthContext";

import axios from "axios";
import LoadingIndicator from "./LoadingIndicator";

function Profile() {
  // Esto es un componente, es un pedazo de UI , es como un div

  const { user } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState([]);
  const [userVisits, setUserVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Para que cuando los datos no estes listos salga una pantalla de carga

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/get_profile_image?student_id=${user.id}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        let json = await response.json();
        console.log(json);
        setUserVisits(
          json[0].user_visits.map((visit) => {
            let dateObject = new Date(visit.timestamp);
            let dateFormatted = dateObject.toISOString().split("T")[0];
            return dateFormatted;
          })
        );
        setUserInfo(json);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const onFileChange = async (event) => {
    const formData = new FormData();
    formData.append(
      "profile_image",
      event.target.files[0],
      event.target.files[0].name
    );

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/profile_image/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    window.location.reload(); // Recargar la pagina para que se actualice la foto
  };

  return isLoading ? (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <LoadingIndicator />
    </div>
  ) : (
    <div
      className="container pt-5 d-flex justify-content-evenly pt-5"
      style={{
        border: "1px solid transparent",
        background: "white",
        position: "relative",
        top: "85px",
      }}
    >
      <div className="d-flex flex-column">
        <img className="img_profile " src={userInfo[0].profile_image}></img>
        <h5 style={{ fontWeight: 600, paddingTop: "23px" }}>
          Personal information{" "}
        </h5>
        <div className="d-flex flex-column pt-3">
          <span className="pe-2">Name:</span>
          <span className="text-muted">{userInfo[0].username}</span>
        </div>
        <div className="d-flex flex-column pt-3">
          <span className="pe-2">Email:</span>
          <span className="text-muted">{userInfo[0].email}</span>
        </div>
        <div className="d-flex flex-column pt-3 pb-3">
          <span className="pe-2">Phone number:</span>
          <span className="text-muted">{userInfo[0].phone_number}</span>
        </div>

        <div className="d-flex pb-4">
          <div className="pe-3">
            <label
              htmlFor="file-upload"
              className="btn btn-primary my-2 "
              style={{ background: "#341ca6", border: "1px solid transparent" }}
            >
              Change profile photo
              <input
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                onChange={(event) => onFileChange(event)}
              />
            </label>
          </div>
          <div>
            <Link
              to="change_password"
              className="btn btn-primary my-2  "
              type="submit"
              style={{ background: "#341ca6", border: "1px solid transparent" }}
            >
              Change password
            </Link>
          </div>
        </div>
      </div>
      <div className="ps-5">
        <div>
          <Calendar
            value={new Date()}
            tileClassName={({ date, view }) => {
              const dateString = new Date(
                date.getTime() - date.getTimezoneOffset() * 60000
              )
                .toISOString()
                .slice(0, 10);

              if (userVisits.includes(dateString)) {
                return "enabled";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
