import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Layout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faUser,
  faUserPlus,
  faCrown,
  faRightFromBracket,
  faDeleteLeft,
  faX,
} from "@fortawesome/free-solid-svg-icons";

import appimg from "./img/app.png";

library.add(faUser, faUserPlus, faCrown, faRightFromBracket, faDeleteLeft, faX);

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  });

  function handleLogout() {
    setIsLoading(true);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(false);
    }, 1000);
  }

  return (
    <body>
      <header>
        <>
          <nav className="navbar">
            <ul>
              <li>
                <Link to="/">
                  <img src={appimg} width="30" heigh="30" alt="App" />
                  Typing App
                </Link>
              </li>
              <li>
                <Link to="/LeaderBoard">
                  <FontAwesomeIcon
                    icon="fa-solid fa-crown"
                    fixedWidth
                    size="lg"
                  />
                  LeaderBoard
                </Link>
              </li>
              {!isLoggedIn && (
                <>
                  <Link to="/Login">
                    <FontAwesomeIcon
                      icon="fa-solid fa-user"
                      fixedWidth
                      size="lg"
                    />
                    Login
                  </Link>
                  <Link to="/Register">
                    <FontAwesomeIcon
                      icon="fa-solid fa-user-plus"
                      fixedWidth
                      size="lg"
                    />
                    Register
                  </Link>
                </>
              )}
              {isLoggedIn && (
                <>
                  <li>
                    <div className="loggeduser">
                      <Link to="/DisplayStats">
                        <FontAwesomeIcon
                          icon="fa-solid fa-user"
                          fixedWidth
                          size="lg"
                        />
                        {localStorage.getItem("currentUser")}
                      </Link>
                    </div>
                  </li>
                  <li>
                    <Link to="/Logout" onClick={handleLogout}>
                      <FontAwesomeIcon
                        icon="fa-solid fa-right-from-bracket"
                        fixedWidth
                        size="lg"
                      />
                      {isLoading ? (
                        <span
                          class="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        ""
                      )}
                      {isLoading ? "Logging out..." : "Logout"}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <Outlet />
        </>
      </header>
    </body>
  );
};

export default Layout;
