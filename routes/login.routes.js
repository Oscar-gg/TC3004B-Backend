import { Router } from "express";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  login,
} from "../controllers/login.controllers.js";
import { validateJWT } from "../utils/jwt.js";

const router = Router();

router.post("/login/create", createUser);
router.get("/login/get", validateJWT, getUsers);
router.get("/login/get/:id", validateJWT, getUser);

router.post("/login/", login);

router.put("/login/update", validateJWT, updateUser);
router.delete("/login/delete", validateJWT, deleteUser);

export default router;
