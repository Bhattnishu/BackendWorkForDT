const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://newDbUser:tnMzpuuSA4PrSesl@newcluster.ofii1.mongodb.net/?retryWrites=true&w=majority&appName=NewCluster";
const client = new MongoClient(uri);
const { ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const dir = path.resolve(__dirname, "./uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
async function main() {
  await client.connect();
  console.log("connected.....");
  app.locals.db = client.db("events");
}
main();
app.listen(3000, () => {
  console.log("connected to server..");
});
app.get("/api/v3/app/event", (req, res) => {
  const db = req.app.locals.db;
  try {
    if (req.query.id) {
      let event = db.collection("events").findOne({
        _id: new ObjectId(req.query.id),
      });
      console.log("I am h here");
      res.status(201).json(event);
    } else if (req.query.type && req.query.limit && req.query.page) {
      const { type, limit, page } = req.query;
      let event = db
        .collection("events")
        .find(type ? { type } : {})
        .limit(parseInt(limit))
        .skip((page - 1) * limit);
      res.status(201).json(event);
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/v3/app/events", upload.single("image"), (req, res) => {
  const db = req.app.locals.db;
  try {
    let eventData = {
      name: req.body,
      files: { image: req.file ? req.file.path : null },
      tagline: req.body,
      schedule: req.body,
      description: req.body,
      category: req.body,
      sub_category: req.body,
      rigor_rank: parseInt(req.body.rigor_rank),
    };
    let event = db.collection("events").insertOne(eventData);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});
app.put("/api/v3/app/events/:id", (req, res) => {
  let { id } = req.params;
  const db = req.app.locals.db;
  const data = req.body;
  try {
    let event = db
      .collection("events")
      .updateOne({ _id: new ObjectId(req.query.id) });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});
app.delete("/api/v3/app/events/:id", async (req, res) => {
  let { id } = req.params;
  let deleted = await events.findByIdAndDelete(id);
  console.log(deleted);
});
