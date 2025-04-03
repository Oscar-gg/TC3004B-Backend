import jwt from "jsonwebtoken";

import { Router } from "express";
export const validateJWT = Router();

validateJWT.use((req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "Se requiere un token" });
    return;
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid token: " + err.message });
    }
    req.userId = decoded.id;
    next();
  });
});
