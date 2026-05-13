import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";

const app = express();

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Middleware
    app.use(cors());
    app.use(express.json());

    const port = process.env.PORT || 3000;

    app.get("/", (req: Request, res: Response) => {
      res.send("Server is live!");
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();