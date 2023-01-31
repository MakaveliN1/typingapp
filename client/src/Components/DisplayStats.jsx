import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./DisplayStats.css";
function DisplayStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [sortKey, setSortKey] = useState("wpm");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };
  useEffect(() => {
    axios
      .get(`http://localhost:5000/stats/${localStorage.getItem("currentUser")}`)
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);
  const handleGoBack = () => {
    navigate("/");
  };
  const handleDeleteStat = (id) => {
    axios
      .delete(`http://localhost:5000/stats/${id}`)
      .then((res) => {
        console.log(res);

        setStats(stats.filter((stat) => stat._id !== id));
      })
      .catch((err) => console.log(err));
  };
  const statsList = stats
    .map((stat) => {
      stat.dateAdded = new Date(stat.dateAdded);
      return stat;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      }
      return b[sortKey] > a[sortKey] ? 1 : -1;
    })
    .slice(0, 10)
    .map((stat, index) => {
      let dateAdded = "N/A";
      if (stat.dateAdded) {
        dateAdded = stat.dateAdded.toDateString();
      }
      return (
        <tr key={stat._id}>
          <td>{index + 1}</td>
          <td>{dateAdded}</td>
          <td>{stat.accuracy?.toFixed(2)}%</td>
          <td>{stat.wpm?.toFixed(0)}</td>
          <td>{stat.awpm?.toFixed(0)}</td>
          <td>{stat.gwpm?.toFixed(0)}</td>
          <td>
            <button
              className="delete-button"
              onClick={() => handleDeleteStat(stat._id)}
            >
              <FontAwesomeIcon icon="fa-solid fa-delete-left" size="lg" />
            </button>
          </td>
        </tr>
      );
    });
  return localStorage.getItem("isLoggedIn") === "true" ? (
    <div className="root">
      <h1 className="username">
        Stats for user: {localStorage.getItem("currentUser")}
      </h1>
      {statsList.length > 0 ? (
        <table className="stats-table">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort("dateAdded")}>Date Added</th>
              <th onClick={() => handleSort("accuracy")}>Accuracy</th>
              <th onClick={() => handleSort("wpm")}>WPM</th>
              <th onClick={() => handleSort("awpm")}>AWPM</th>
              <th onClick={() => handleSort("gwpm")}>GWPM</th>

              <th>
                <FontAwesomeIcon icon="fa-solid fa-x" />
              </th>
            </tr>
          </thead>
          <tbody>{statsList}</tbody>
        </table>
      ) : (
        <div>Database Error, or backend Server not running..</div>
      )}
      <div>
        <div className="sort-order">
          <br />
          Sort by: {sortKey.toLocaleUpperCase()}{" "}
          {sortOrder.toLocaleUpperCase() + "ENDING"}
        </div>
        <button className="go-back-button" onClick={handleGoBack}>
          Go back
        </button>
      </div>
    </div>
  ) : (
    <div className="error">
      <p>Error Login first</p>
    </div>
  );
}

export default DisplayStats;
