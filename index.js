import express from "express";
const app = express();

import router from "./routes/index.routes.js";
app.use("/", router);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

console.log("Hola Mundo!");
