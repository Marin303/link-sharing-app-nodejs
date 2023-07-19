const express = require("express");
const multer = require("multer");
require("dotenv").config();
const app = express();
const port = 5000;

app.use("/uploads", express.static("uploads"));

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
  res.status(200).json(profile);
});

app.post("/", upload.single("image"), async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const image = req.file.filename;

    const profile = {
      firstName,
      lastName,
      email,
      image,
    };

    console.log(profile);
    res.status(200).json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});