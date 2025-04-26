import express from "express";
import cors from "cors";
import { authRouter } from "./auth/auth-router.js";
import { primaryEmailsRouter } from "./fetch/primary-mails.js";
import { socialEmailsRouter } from "./fetch/social-mails.js";
import { promotionEmailsRouter } from "./fetch/promotion-mails.js";
import { updatesEmailsRouter } from "./fetch/updates-mails.js";
import { spamEmailsRouter } from "./fetch/spam-mails.js";
import { sentEmailsRouter } from "./fetch/sent-mails.js";
import { draftEmailsRouter } from "./fetch/draft-mails.js";
import { trashEmailsRouter } from "./fetch/trash-mails.js";
import { specificEmailRouter } from "./fetch/get-specific-mail.js";
import { analyzeRouter } from "./analyze/analyze.js";
const app = express();
const port = 8080;
app.set("trust proxy", true);

app.use(
  cors({
    origin: "*",
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use("/", authRouter);
app.use("/", primaryEmailsRouter);
app.use("/", socialEmailsRouter);
app.use("/", promotionEmailsRouter);
app.use("/", updatesEmailsRouter);
app.use("/", spamEmailsRouter);
app.use("/", trashEmailsRouter);
app.use("/", spamEmailsRouter);
app.use("/", sentEmailsRouter);
app.use("/", draftEmailsRouter);
app.use("/", specificEmailRouter);
app.use("/", analyzeRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
