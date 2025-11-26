import express, { type NextFunction, type Request, type Response, type RequestHandler } from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import Task from "./models/task.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT ?? 5000);
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI environment variable");
  process.exit(1);
}

const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get(
  "/tasks",
  asyncHandler(async (_req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
  })
);

app.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";

    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    const newTask = new Task({ title });
    await newTask.save();

    res.status(201).json(newTask);
  })
);

app.patch(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body ?? {};

    if (typeof completed !== "boolean") {
      res.status(400).json({ message: "completed must be a boolean" });
      return;
    }

    const updated = await Task.findByIdAndUpdate(id, { completed }, { new: true });

    if (!updated) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(updated);
  })
);

app.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Deleted" });
  })
);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

void start();
