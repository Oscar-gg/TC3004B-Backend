import { sqlConnect, sql } from "../utils/sql.js";

export const getItems = async (req, res) => {
  await sqlConnect();

  const result = await sql.query`select * from items`;
  res.json(result.recordset);
};
