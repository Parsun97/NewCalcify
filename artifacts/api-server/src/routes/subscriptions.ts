import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Get or create user + check Pro status
router.get("/subscriptions/status", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.json({ isPro: false });

  let user = await db.query.usersTable.findFirst({
    where: eq(usersTable.userId, userId),
  });

  if (!user) {
    const [newUser] = await db.insert(usersTable).values({ userId }).returning();
    user = newUser;
  }

  const isPro = user.isPro && (!user.proExpiresAt || user.proExpiresAt > new Date());
  res.json({ isPro, proExpiresAt: user.proExpiresAt });
});

// Create Razorpay order
router.post("/subscriptions/create-order", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const order = await razorpay.orders.create({
    amount: 9900, // ₹99 in paise
    currency: "INR",
    receipt: `order_${userId}_${Date.now()}`,
  });

  res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
});

// Verify payment and activate Pro
router.post("/subscriptions/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const userId = req.headers["x-user-id"] as string;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const proExpiresAt = new Date();
  proExpiresAt.setMonth(proExpiresAt.getMonth() + 1);

  await db
    .insert(usersTable)
    .values({ userId, isPro: true, razorpaySubscriptionId: razorpay_payment_id, proExpiresAt })
    .onConflictDoUpdate({
      target: usersTable.userId,
      set: { isPro: true, razorpaySubscriptionId: razorpay_payment_id, proExpiresAt },
    });

  res.json({ success: true, proExpiresAt });
});

export default router;
