import { getSqlPool } from "../utils/sql.js";
import sql from "mssql";
import Item from "../utils/item.model.js";

export const getItems = async (req, res) => {
  const items = await Item.find();

  res.json(items);
};

export const getItem = async (req, res) => {
  const item = await Item.findById(req.params.id);

  res.json(item);
};

export const createItems = async (req, res) => {
  const item = Item(req.body);
  await item.save();
  res.json(item);
};

export const deleteItems = async (req, res) => {
  await Item.findByIdAndDelete(req.body.id);

  res.status(200).json({ msg: "Item deleted" });
};

export const updateItems = async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.body.id, req.body, {
    new: true,
  });
  await item.save();
  res.json(item);
};
