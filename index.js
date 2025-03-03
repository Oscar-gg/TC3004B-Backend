import "dotenv/config";
import express from "express";
import indexRoutes from "./routes/index.routes.js";
import itemRoutes from "./routes/items.routes.js";
import loginRoutes from "./routes/login.routes.js";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(cors());

app.use(morgan("dev"));
app.use(indexRoutes);
app.use(itemRoutes);
app.use(loginRoutes);

const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
