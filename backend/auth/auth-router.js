import { Router } from "express";
import { GoogleAuthorize, logout } from "../lib/google_auth.cjs";

const router = Router();
router.post("/auth/login", async (request, response) => {
  const user = await GoogleAuthorize();

  response.json(user);
});

router.post("/auth/logout", async (request, response) => {
  try {
    await logout();
    response.json({ message: "Logged out", success: true });
  } catch (error) {
    response.json({ message: error, success: false });
  }
});

export { router as authRouter };
