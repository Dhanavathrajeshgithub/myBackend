require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/login", (req, res) => {
  res.send("user loggein");
});
app.get("/signup", (req, res) => {
  res.send("<h1>You are signed in</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
