const express = require("express");
const mongoose = require("mongoose");
const Profile = require('./models/ProfileModel')
require("dotenv").config();
const app = express();
const port = 5000;

app.use(express.json())
const cors = require('cors');

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/preview", (req, res) => {
  res.send("Hello preview");
});


app.post('/', async (req, res) => {
    try {
      const preview = await Profile.create(req.body)
      console.log(req.body);
      res.status(200).json(preview);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
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
