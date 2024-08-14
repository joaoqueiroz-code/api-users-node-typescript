import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const secretKey =
  process.env.JWT_SECRET || "hvB_0>gEgFj33X+q&0/(5mK`R5ht5}@z6KDPt+8o_)$m.[+sg";

interface CustomRequest extends Request {
  user?: JwtPayload | string;
}

export const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token not provided" });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
};
