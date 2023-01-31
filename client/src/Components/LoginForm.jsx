import React, { useState } from "react";
import "./FormStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [Error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function handleSubmit(event) {
    setIsLoading(true);

    event.preventDefault();

    axios
      .post("http://localhost:5000/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.data === "Login successful") {
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("currentUser", username);
          console.log("Logged in as: " + localStorage.getItem("currentUser"));
          setTimeout(() => {
            navigate("/");
            window.location.reload(false);

            document.getElementById("login-button").innerHTML = "Login";
            document.getElementById("login-button").disabled = false;
          }, 1000);
        } else {
          setError("Invalid Credentials");
          setIsLoading(false);

          document.getElementById("login-button").innerHTML = "Login";
          document.getElementById("login-button").disabled = false;
        }
      })

      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div class="login">
          <FontAwesomeIcon
            icon="fa-solid fa-user"
            fixedWidth
            size="5x"
            style={{ padding: "0 0 0 75px" }}
          />
        </div>
        <br></br>
        <label
          htmlFor="username"
          style={{
            backgroundColor: "#323437",
            color: "#d1d0c5",
          }}
        >
          Username:
        </label>
        <br />
        <input
          type="text"
          id="username"
          value={username}
          style={{
            color: "#d1d0c5",
            backgroundColor: "#2c2e31",
          }}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          style={{
            backgroundColor: "#323437",
            color: "#d1d0c5",
          }}
        >
          Password:
        </label>
        <br />
        <input
          type="password"
          id="password"
          value={password}
          style={{
            color: "#d1d0c5",
            backgroundColor: "#2c2e31",
          }}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <div className="error">{Error}</div>
      </div>
      <div>
        <button type="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            ""
          )}
          {isLoading ? "Logging in" : "Login"}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
