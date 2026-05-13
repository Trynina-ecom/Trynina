"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_js_1 = __importDefault(require("./config/db.js"));
const express_2 = require("@clerk/express");
const app = (0, express_1.default)();
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, db_js_1.default)();
        // Middleware
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use((0, express_2.clerkMiddleware)());
        const port = process.env.PORT || 3000;
        app.get("/", (req, res) => {
            res.send("Server is live!");
        });
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
    }
};
startServer();
