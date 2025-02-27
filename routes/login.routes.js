import { Router } from "express";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  login,
} from "../controllers/login.controllers.js";

const router = Router();

router.post("/login/create", createUser);
router.get("/login/get", getUsers);
router.get("/login/get/:id", getUser);

router.post("/login/", login);

router.put("/login/update", updateUser);
router.delete("/login/delete", deleteUser);

export default router;
