import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import routesAdmin from "./routes/admin/index.route.js";

import routesClient from "./routes/client/index.js";

import dotenv from "dotenv";
import database from "./config/database.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// MiddleWare
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

// Dotenv
dotenv.config();
// End dotenv

// Database
database();
// End database

// Routes
routesAdmin(app);
routesClient(app);

// Start Server
app.listen(port, () => {
  console.log("Server is running at port: " + port);
});
