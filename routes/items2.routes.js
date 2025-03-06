import { Router } from "express";
import {
  createItems,
  getItems,
  deleteItems,
  updateItems,
  getItem,
} from "../controllers/items2.controllers.js";

const router = Router();

router.post("/items2/create", createItems);
router.get("/items2/get", getItems);
router.get("/items2/get/:id", getItem);
router.put("/items2/update", updateItems);
router.delete("/items2/delete", deleteItems);

export default router;
