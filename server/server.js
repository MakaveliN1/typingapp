const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

mongodb.MongoClient.connect(
  "mongodb://127.0.0.1:27017",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to MongoDB");
      const db = client.db("usersdb");

      app.post("/register", (req, res) => {
        console.log("Received form submission:", req.body);
        const formData = req.body;
        db.collection("usersdata").createIndex(
          { username: 1 },
          { unique: true },
          (err, result) => {
            if (err) {
              console.log(err);
              res
                .status(500)
                .send("Error creating unique index on username field");
            } else {
              console.log(
                "Successfully created unique index on username field"
              );
              db.collection("usersdata").insertOne(formData, (err, result) => {
                if (err) {
                  if (err.code === 11000) {
                    console.log("Username already exists");
                    res.status(400).send("Error: username already exists");
                  } else {
                    console.log(err);
                    res
                      .status(500)
                      .send("Error inserting form data into MongoDB");
                  }
                } else {
                  console.log("Inserted form data into MongoDB");
                  res.send("Form data inserted into MongoDB");
                }
              });
            }
          }
        );
      });

      app.post("/login", (req, res) => {
        const { username, password } = req.body;
        db.collection("usersdata").findOne(
          { username: username, password: password },
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error checking login credentials");
            } else if (result) {
              res.send("Login successful");
            } else {
              res.send("Invalid Credentials");
            }
          }
        );
      });
      app.post("/save-stats", (req, res) => {
        const { dateAdded, username, accuracy, wpm, awpm, gwpm } = req.body;
        db.collection("userstats").insertOne(
          {
            dateAdded: new Date(),
            username: username,
            accuracy: accuracy,
            wpm: wpm,
            awpm: awpm,
            gwpm: gwpm,
          },
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error inserting stats into MongoDB");
            } else {
              console.log("Inserted stats into MongoDB");
              res.send("Stats inserted into MongoDB");
            }
          }
        );
      });
      app.delete("/stats/:id", (req, res) => {
        const id = req.params.id;
        db.collection("userstats").deleteOne(
          {
            _id: mongodb.ObjectId(id),
          },
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error deleting stats from MongoDB");
            } else {
              console.log("Stats deleted from MongoDB");
              res.send("Stats deleted from MongoDB");
            }
          }
        );
      });
      app.get("/leaderboard", (req, res) => {
        db.collection("userstats")
          .find()
          .toArray((err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error fetching stats from MongoDB");
            } else if (result) {
              res.send(result);
            } else {
              res.status(404).send("Stats not found");
            }
          });
      });
      app.get("/stats/:username", (req, res) => {
        const username = req.params.username;
        db.collection("userstats")
          .find({ username: username })
          .toArray((err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error fetching stats from MongoDB");
            } else if (result) {
              res.send(result);
            } else {
              res.status(404).send("Stats not found");
            }
          });
      });
    }
  }
);

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
