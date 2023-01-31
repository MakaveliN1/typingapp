import React, { useState } from "react";
import "./FormStyle.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function validateForm() {
    let isValid = true;

    if (username.length < 4) {
      setUsernameError("Username must be at least 4 characters long");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    } else if (!password.match(/\d+/)) {
      setPasswordError("Password must contain at least 1 number");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      axios
        .post("http://localhost:5000/register", {
          username: username,
          password: password,
          confirmPassword: confirmPassword,
        })
        .then((res) => {
          setTimeout(() => {
            setIsLoading(false);
            navigate("/login");
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setUsernameError("Error: username already exists");
        });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div class="login">
          <FontAwesomeIcon
            icon="fa-solid fa-user-plus"
            fixedWidth
            size="5x"
            style={{ padding: "0 0 0 90px" }}
          />
        </div>
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
        <div className="error">{usernameError}</div>
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
        <div className="error">{passwordError}</div>
      </div>
      <div>
        <label
          htmlFor="confirm-password"
          style={{
            backgroundColor: "#323437",
            color: "#d1d0c5",
          }}
        >
          Confirm Password:
        </label>
        <br />
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          style={{
            color: "#d1d0c5",
            backgroundColor: "#2c2e31",
          }}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
        <div className="error">{confirmPasswordError}</div>
      </div>
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
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}

export default RegistrationForm;
