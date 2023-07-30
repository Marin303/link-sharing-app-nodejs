const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const helmet = require('helmet');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const cors = require("cors");

const MongoClient = require("mongodb").MongoClient;

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", 'data:'],
  },
}));

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

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

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const db = client.db("link-sharing");
    const profiles = db.collection("profiles");

    app.get("/preview/:id", async (req, res) => {
      const profileData = await profiles.findOne({ _id: req.params.id });

      if (!profileData) {
        return res
          .status(404)
          .json({ error: "No profile found with the given id" });
      }

      res.json(profileData);
    });

    app.post("/", upload.single("image"), async (req, res) => {
      if (!req.file) {
        console.log("No file received");
        return res.send({ success: false });
      } else {
        try {
          const profileData = JSON.parse(req.body.profileData);
          const parsedForms = JSON.parse(req.body.forms);
          const image = req.file.filename;

          const id = uuidv4(); // generate a unique ID

          const completeProfileData = {
            _id: id,
            ...profileData,
            image,
            forms: parsedForms,
          };

          await profiles.insertOne(completeProfileData);

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
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);
