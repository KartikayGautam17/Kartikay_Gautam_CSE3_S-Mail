import { Router } from "express";
import { getSpecificEmail } from "../lib/google_auth.cjs";
import fs from "fs";
const router = Router();

router.post("/fetch/mail/:id", async (req, res) => {
  const { id } = req.params;
  const email = await getSpecificEmail(id);
  // return res.json(email);
  const data = email;
  let base64string = "";
  try {
    base64string = data.payload.body.data;
  } catch (error) {
    console.log(error);
    base64string = data.payload.parts[0].body.data;
  }
  let buff = "";
  try {
    buff = Buffer.from(base64string, "base64");
    //console.log(buff.toString("utf-8"));
    fs.writeFileSync("email.html", buff.toString("utf-8"));
  } catch (error) {
    console.log(error);
  }
  if (buff) return res.json(buff.toString("utf-8"));
  else return res.json("open in gmail");
});

export { router as specificEmailRouter };
