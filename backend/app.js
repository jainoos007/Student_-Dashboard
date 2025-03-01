import express from "express";
import mongoose from "mongoose";
import sudentRouter from "./routes/student-route.js";

const app = express();

const PORT = 3000;

//middleware to parse json request bodies
app.use(express.json());

//student route
app.use("/api/student/", sudentRouter);

//mongodb connection
//admin007-admin321
mongoose
  .connect(
    "mongodb+srv://admin007:admin321@cluster0.dph3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((e) => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("Error connecting to MongoDB" + err));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
