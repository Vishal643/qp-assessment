import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { userRouter } from "./routes/user";
import { groceryRouter } from "./routes/grocery";
import cookieParser from "cookie-parser";
import { DataSource, DataSourceOptions } from "typeorm";

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(
  cors({
    origin: ["http://localhost:4040"],
    credentials: true
  })
);
app.options("*", cors());
app.use(cookieParser());

const port = process.env.SERVER_PORT || 4040;
const baseRoute = "/api/v1";

async function startServer() {
  app.get(`${baseRoute}/health-check`, (req, res) => {
    res.status(200).send(`Service is running on port ${port}, hostname: ${req.hostname}`);
  });

  // all routes
  app.use(`${baseRoute}/users`, userRouter);
  app.use(`${baseRoute}/groceries`, groceryRouter);

  app.listen(port, () => {
    console.log(`The application is listening on port ${port}`);
  });
}

const dataSourceParams: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === "true", // This will create database schema automatically
  entities: ["src/entity/**/*.ts"],
  logging: process.env.DB_LOGGING === "true"
};

if (process.env.DB_HOST !== "localhost") {
  (dataSourceParams as any).ssl = {
    rejectUnauthorized: false // Bypass SSL certificate validation
  };
}

export const AppDataSource = new DataSource(dataSourceParams);

AppDataSource.initialize()
  .then(() => {
    startServer(); // Start your Express server after TypeORM connection is established
  })
  .catch(error => {
    console.error("Error connecting to database:", error);
  });
