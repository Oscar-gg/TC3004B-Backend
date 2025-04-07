import { Router } from "express";
import {
  createItems,
  getItems,
  deleteItems,
  updateItems,
  getItem,
} from "../controllers/items.controllers.js";

import { validateJWT } from "../utils/jwt.js";
const router = Router();

router.post("/items/create", validateJWT, createItems);
router.get("/items/get", validateJWT, getItems);
router.get("/items/get/:id", validateJWT, getItem);
router.put("/items/update", validateJWT, updateItems);
router.delete("/items/delete/:id", validateJWT, deleteItems);

export default router;
