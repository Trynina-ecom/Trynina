"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clerkWebhook = void 0;
const svix_1 = require("svix");
const User_1 = __importDefault(require("../models/User"));
const clerkWebhook = async (req, res) => {
    try {
        const secret = process.env.CLERK_WEBHOOK_SECRET;
        if (!secret) {
            throw new Error("Missing CLERK_WEBHOOK_SECRET");
        }
        const webhook = new svix_1.Webhook(secret);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };
        const payload = JSON.stringify(req.body);
        const evt = webhook.verify(payload, headers);
        if (evt.type === "user.created" ||
            evt.type === "user.updated" ||
            evt.type === "user.deleted") {
            const userData = {
                clerkId: evt.data.id,
                email: evt.data?.email_addresses?.[0]?.email_address,
                name: `${evt.data?.first_name ?? ""} ${evt.data?.last_name ?? ""}`,
                image: evt.data?.profile_image_url,
            };
            const user = await User_1.default.findOne({ clerkId: evt.data.id });
            if (evt.type === "user.deleted") {
                await User_1.default.findOneAndDelete({ clerkId: evt.data.id });
            }
            else if (user) {
                await User_1.default.findOneAndUpdate({ clerkId: evt.data.id }, userData);
            }
            else {
                await User_1.default.create(userData);
            }
        }
        return res.json({ success: true, message: "Webhook received" });
    }
    catch (err) {
        console.error("Error verifying webhook:", err);
        return res.status(400).send("Error verifying webhook");
    }
};
exports.clerkWebhook = clerkWebhook;
