import { Router } from "express";
import jwt from "jsonwebtoken";

const authRouter = Router();
const secretKey = process.env.JWT_SECRET || "your-secret-key";

authRouter.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
  res.json({ token });
});

export default authRouter;
