import { Request, Response } from "express";
import { Webhook } from "svix";
import User from "../models/User";

export const clerkWebhook = async (req: Request, res: Response) => {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

    const payload = req.body;
    const headers = req.headers;

    const wh = new Webhook(webhookSecret);

    const evt = wh.verify(payload, {
      "svix-id": headers["svix-id"] as string,
      "svix-timestamp": headers["svix-timestamp"] as string,
      "svix-signature": headers["svix-signature"] as string,
    }) as any;

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const userData = {
        clerkId: evt.data.id,
        email: evt.data?.email_addresses?.[0]?.email_address,
        name: `${evt.data?.first_name || ""} ${evt.data?.last_name || ""}`.trim(),
        image: evt.data?.image_url,
      };

      const user = await User.findOne({ clerkId: evt.data.id });

      if (user) {
        await User.findOneAndUpdate(
          { clerkId: evt.data.id },
          userData,
          { new: true }
        );
      } else {
        await User.create(userData);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return res.status(400).send("Error verifying webhook");
  }
};