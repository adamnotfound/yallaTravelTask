const path = require("path");
const express = require("express");
const cors = require("cors");
const http = require("http");
var multer = require("multer");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
require("dotenv").config({ path: require("find-config")(".env") });

/* using Middlewares */
app.use("/static", express.static("public/static"));
app.use(express.static("frontend/build"));
app.use(cors());
app.use(express.json({ limit: "500MB", extended: false }));
app.use(express.urlencoded({ extended: false }));

var session = require("express-session");
app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: false,
  })
);

// Importing Routes
app.use("/auth", require("./backend/routes/auth"));
app.use("/users", require("./backend/routes/users"));

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
//Connecting To databases and Starting the server
mongoose
  .connect(
    "mongodb+srv://travelyalla:" +
      process.env.ATLAS_PW +
      "@project-bb531.mongodb.net/test?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Connection failed");
    console.log(err);
  });
server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server started on port ${PORT}`);
});
