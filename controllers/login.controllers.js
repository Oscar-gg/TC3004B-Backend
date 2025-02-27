import { getSqlPool } from "../utils/sql.js";
import sql from "mssql";

export const getUsers = async (req, res) => {
  const pool = await getSqlPool();

  const result = await pool.query`select * from users`;
  res.json(result.recordset);
};

export const getUser = async (req, res) => {
  const pool = await getSqlPool();

  const result = await pool
    .request()
    .input("id", sql.Int, req.params.id)
    .query("select * from users where id = @id");

  res.json(result.recordset);
};

export const createUser = async (req, res) => {
  const pool = await getSqlPool();

  const { name, username, password } = req.body;

  const result = await pool
    .request()
    .input("name", sql.VarChar, name)
    .input("username", sql.VarChar, username)
    .input("password", sql.VarChar, password)
    .query(
      "INSERT INTO users (name, username, password) Values (@name, @username, @password)"
    );

  res.json(result);
};

export const deleteUser = async (req, res) => {
  const pool = await getSqlPool();

  const result = await pool
    .request()
    .input("id", sql.Int, req.body.id)
    .query("DELETE FROM users where id = @id");

  res.json(result);
};

export const updateUser = async (req, res) => {
  const pool = await getSqlPool();

  const result = await pool
    .request()
    .input("id", sql.Int, req.body.id)
    .input("name", sql.VarChar, req.body.name)
    .input("username", sql.VarChar, req.body.username)
    .input("password", sql.VarChar, req.body.password)
    .query(
      "UPDATE users SET name = @name, username = @username, password = @password where id = @id"
    );

  res.json(result);
};

export const login = async (req, res) => {
  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input("username", sql.VarChar, req.body.username)
    .query("select * from users where username = @username");

  let isLogin = false;
  try {
    isLogin = req.body.password === result.recordset[0].password;
  } catch (error) {
    res.json(false);
    return;
  }
  res.json(isLogin);
};
