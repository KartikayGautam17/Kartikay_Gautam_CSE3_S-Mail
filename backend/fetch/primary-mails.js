import { getPrimaryEmails } from "../lib/google_auth.cjs";
import { Router } from "express";
import "dotenv/config";
import redis from "../redis/main.js";
import { uuid } from "../lib/google_auth.cjs";
import fs from "fs";
const router = Router();
const expiry = 3600;
const fileName = "email-cache.json";
const writeJSONtoFile = (fileName, data) => {
  const jsonArray = data.map((item, index) => ({
    id: index,
    snippet: item.snippet,
  }));
  const jsonString = JSON.stringify(jsonArray);
  fs.writeFileSync(fileName, jsonString, "utf8");
};

router.post("/fetch/primary", async (req, res) => {
  const redisKey = uuid.email + ".primaryEmails";

  try {
    const cache = await redis.json.get(redisKey);

    if (cache) {
      writeJSONtoFile(fileName, cache);
      return res.json(cache);
    } else {
      const emails = await getPrimaryEmails();
      redis.json.set(redisKey, "$", emails);
      redis.expire(redisKey, expiry);
      res.json(emails);
      writeJSONtoFile(fileName, emails);
    }
  } catch (error) {
    console.log(error);
    const emails = await getPrimaryEmails();
    redis.json.set(redisKey, "$", emails);
    redis.expire(redisKey, expiry);
    res.json(emails);
    writeJSONtoFile(fileName, emails);
  }
});

export { router as primaryEmailsRouter };
