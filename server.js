const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/preview", (req, res) => {
  res.send("Hello preview");
});

const password = process.env.URI_PASSWORD;
const uri = `mongodb+srv://Marin03:${password}@cluster0.ujwxme5.mongodb.net/Node-API?retryWrites=true&w=majority`;

mongoose.connect(uri)
  .then(() => {
    console.log("Connected to Mongo");

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
      
  })
  .catch((error) => {
      console.log(error);
  });
