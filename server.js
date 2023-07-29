const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 5000;

// Using an object as an in-memory "database"
let profileDataStore = {};

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Math.round(Math.random() * 1e5);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({ storage: storage });

app.get("/preview/:id", (req, res) => {
  const profileData = profileDataStore[req.params.id];
  
  if (!profileData) {
    return res.status(404).json({ error: 'No profile found with the given id'});
  }

  res.json(profileData);
});

app.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({ success: false });
  } else {
    try {
      const profileData = JSON.parse(req.body.profileData);
      const parsedForms = JSON.parse(req.body.forms);
      const image = req.file.filename;

      const id = uuidv4();  // generate a unique ID

      const completeProfileData = {
        id,
        ...profileData,
        image,
        forms: parsedForms
      };

      profileDataStore[id] = completeProfileData;

      res.status(200).json({ id, ...completeProfileData });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
