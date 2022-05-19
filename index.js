const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//moddleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7vtnj5w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("to_do_user").collection("task");

    //get all data of tasks
    app.get("/home", async (req, res) => {
      const query = {};
      const cursor = taskCollection.find(query);
      const task = await cursor.toArray();
      res.send(task);
    });
    //get all data of tasks email wise
    app.get("/home", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = taskCollection.find(query);
      const task = await cursor.toArray();
      res.send(task);
    });

    //POST
    app.post("/home", async (req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    });

    // delete
    app.delete("/home/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("warehouse server is runnuning");
});
app.listen(port, () => {
  console.log("server is running on port", port);
});
