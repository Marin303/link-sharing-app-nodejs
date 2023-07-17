const express = require("express");
const mongoose = require("mongoose");
const Profile = require("./models/ProfileModel");
require("dotenv").config();
const app = express();
const port = 5000;
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Math.round(Math.random() * 1e5);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
    );
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/preview", (req, res) => {
  res.send("Hello preview");
});

app.post("/", upload.single("image"), async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const image = req.file.filename;

    const profile = await Profile.create({
      firstName,
      lastName,
      email,
      image,
    });

    console.log(req.body);
    res.status(200).json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

const password = process.env.URI_PASSWORD;
const uri = `mongodb+srv://Marin03:${password}@cluster0.ujwxme5.mongodb.net/Node-API?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to Mongo");

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
