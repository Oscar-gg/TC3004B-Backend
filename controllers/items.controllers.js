import { getSqlPool } from "../utils/sql.js";
import sql from "mssql";

export const getItems = async (req, res) => {
  const pool = await getSqlPool();

  const result = await pool.query`select * from items`;
  res.json(result.recordset);
};

export const getItem = async (req, res) => {
  const pool = await getSqlPool();

  const result = await pool
    .request()
    .input("id", sql.Int, req.params.id)
    .query("select * from items where id = @id");

  res.json(result.recordset);
};

export const createItems = async (req, res) => {
  try {
    const pool = await getSqlPool();

    const { name, price } = req.body;

    const result = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("price", sql.Decimal, price)
      .query("INSERT INTO items (name, price) Values (@name, @price)");

    res.json(result);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteItems = async (req, res) => {
  const pool = await getSqlPool();

  const result = await pool
    .request()
    .input("id", sql.Int, req.params.id)
    .query("DELETE FROM items where id = @id");

  res.json(result);
};

export const updateItems = async (req, res) => {
  const pool = await getSqlPool();

  const result = await pool
    .request()
    .input("id", sql.Int, req.body.id)
    .input("name", sql.VarChar, req.body.name)
    .input("price", sql.Decimal, req.body.price)
    .query("UPDATE items SET name = @name, price = @price where id = @id");

  res.json(result);
};
