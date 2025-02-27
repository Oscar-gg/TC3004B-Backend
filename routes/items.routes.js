import { Router } from "express";
import {
  createItems,
  getItems,
  deleteItems,
  updateItems,
  getItem,
} from "../controllers/items.controllers.js";

const router = Router();

router.post("/items/create", createItems);
router.get("/items/get", getItems);
router.get("/items/get/:id", getItem);
router.put("/items/update", updateItems);
router.delete("/items/delete", deleteItems);

export default router;
