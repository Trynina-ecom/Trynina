import { Request, Response } from "express";
import { Webhook } from "svix";
import User from "../models/User";

export const clerkWebhook = async (req: Request, res: Response) => {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

    const payload = req.body.toString();

    const headers = {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    };

    const wh = new Webhook(webhookSecret);

    const evt = wh.verify(payload, headers) as any;

    console.log(evt);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return res.status(400).send("Error verifying webhook");
  }
};
