import { getTrashEmails } from "../lib/google_auth.cjs";
import { Router } from "express";
import redis from "../redis/main.js";
import "dotenv/config";
import { uuid } from "../lib/google_auth.cjs";

const router = Router();
const expiry = 3600;
router.post("/fetch/trash", async (req, res) => {
  const redisKey = uuid.email + ".trashEmails";
  try {
    const cache = await redis.json.get(redisKey);

    if (cache) {
      return res.json(cache);
    } else {
      const emails = await getTrashEmails();
      redis.json.set(redisKey, "$", emails);
      redis.expire(redisKey, expiry);
      res.json(emails);
    }
  } catch (error) {
    console.log(error);
    const emails = await getTrashEmails();
    redis.json.set(redisKey, "$", primaryEmails);
    redis.expire(redisKey, expiry);
    res.json(emails);
  }
});

export { router as trashEmailsRouter };
