import { Webhook } from "svix";
import { Request, Response } from "express";
import User from "../models/User";

export const clerkWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.CLERK_WEBHOOK_SECRET;

    if (!secret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    const webhook = new Webhook(secret);

    const headers = {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    };

    const payload = JSON.stringify(req.body);

    const evt: any = webhook.verify(payload, headers);

    if (
      evt.type === "user.created" ||
      evt.type === "user.updated" ||
      evt.type === "user.deleted"
    ) {
      const userData = {
        clerkId: evt.data.id,
        email: evt.data?.email_addresses?.[0]?.email_address,
        name: `${evt.data?.first_name ?? ""} ${evt.data?.last_name ?? ""}`,
        image: evt.data?.profile_image_url,
      };

      const user = await User.findOne({ clerkId: evt.data.id });

      if (evt.type === "user.deleted") {
        await User.findOneAndDelete({ clerkId: evt.data.id });
      } else if (user) {
        await User.findOneAndUpdate({ clerkId: evt.data.id }, userData);
      } else {
        await User.create(userData);
      }
    }

    return res.json({ success: true, message: "Webhook received" });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).send("Error verifying webhook");
  }
};