import { getSqlPool } from "../utils/sql.js";
import sql from "mssql";
import crypto from "crypto";

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

  const salt = crypto.randomBytes(24).toString("base64url").slice(0, 24);

  const pepper = process.env.PEPPER;

  const saltedPassword = crypto
    .createHash("sha512")
    .update(password + salt + pepper)
    .digest("hex");

  const result = await pool
    .request()
    .input("name", sql.VarChar, name)
    .input("username", sql.VarChar, username)
    .input("password", sql.VarChar, salt + saltedPassword)
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

  const salt = crypto.randomBytes(24).toString("base64url").slice(0, 24);
  const pepper = process.env.PEPPER;

  const saltedPassword = crypto
    .createHash("sha512")
    .update(req.body.password + salt + pepper)
    .digest("hex");

  const result = await pool
    .request()
    .input("id", sql.Int, req.body.id)
    .input("name", sql.VarChar, req.body.name)
    .input("username", sql.VarChar, req.body.username)
    .input("password", sql.VarChar, salt + saltedPassword)
    .query(
      "UPDATE users SET name = @name, username = @username, password = @password where id = @id"
    );

  res.json(result);
};

export const login = async (req, res) => {
  let isLogin = false;
  try {
    const pool = await getSqlPool();
    const result = await pool
      .request()
      .input("username", sql.VarChar, req.body.username)
      .query("select * from users where username = @username");

    const salt = result.recordset[0].password.slice(0, 24);
    const pepper = process.env.PEPPER;
    const saltedPassword = crypto
      .createHash("sha512")
      .update(req.body.password + salt + pepper)
      .digest("hex");
    isLogin = salt + saltedPassword === result.recordset[0].password;
  } catch (error) {
    res.status(400).json(false);
    return;
  }
  res.status(200).json(isLogin);
};
