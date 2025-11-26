import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import Task from "./models/task.ts";

const app = express();
app.use(cors());
app.use(express.json());

// --- CONNECT TO MONGO ---
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// --- ROUTES ---
app.get("/tasks", async (_req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const newTask = new Task({ title: req.body.title });
  await newTask.save();
  res.json(newTask);
});

app.patch("/tasks/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(updated);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// --- START SERVER ---
app.listen(5000, () => console.log("Server running on port 5000"));
