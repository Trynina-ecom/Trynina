import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhook } from "./controllers/webhooks.js";

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());

// IMPORTANT:
// webhook route BEFORE express.json()
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook
);

app.use(express.json());

app.use(clerkMiddleware());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Server is live!");
});

// Export app for Vercel
export default app;