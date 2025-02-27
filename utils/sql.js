import sql from "mssql";

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT, 10), // specify the port here
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool = undefined;

const getSqlPool = async () => {
  if (!pool) {
    pool = await sql.connect(sqlConfig);
  }

  return pool;
};

export { getSqlPool };
