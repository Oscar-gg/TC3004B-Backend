import "dotenv/config";
import express from "express";
import indexRoutes from "./routes/index.routes.js";
import itemRoutes from "./routes/items.routes.js";
import loginRoutes from "./routes/login.routes.js";

const app = express();
app.use(express.json());
app.use(indexRoutes);
app.use(itemRoutes);

app.use(loginRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

console.log("Hola Mundo!");
