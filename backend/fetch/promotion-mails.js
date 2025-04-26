import { getPromotionEmails } from "../lib/google_auth.cjs";
import { Router } from "express";
import "dotenv/config";
import redis from "../redis/main.js";
import { uuid } from "../lib/google_auth.cjs";

const router = Router();
const expiry = 3600;
router.post("/fetch/promotion", async (req, res) => {
  const redisKey = uuid.email + ".promotionEmails";
  try {
    const cache = await redis.json.get(redisKey);

    if (cache) {
      return res.json(cache);
    } else {
      const emails = await getPromotionEmails();
      redis.json.set(redisKey, "$", emails);
      redis.expire(redisKey, expiry);
      res.json(emails);
    }
  } catch (error) {
    console.log(error);
    const emails = await getPromotionEmails();
    redis.json.set(redisKey, "$", emails);
    redis.expire(redisKey, expiry);
    res.json(emails);
  }
});

export { router as promotionEmailsRouter };
