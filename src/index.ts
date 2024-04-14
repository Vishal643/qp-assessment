import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { userRouter } from "./routes/user";
import { groceryRouter } from "./routes/grocery";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import { DataSource } from "typeorm";

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
  app.get("/health-check", (req, res) => {
    res.status(200).send(`Service is running on port ${port}, hostname: ${req.hostname}`);
  });

  // all routes
  app.use(`${baseRoute}/users`, userRouter);
  app.use(`${baseRoute}/groceries`, groceryRouter);

  app.listen(port, () => {
    console.log(`The application is listening on port ${port}`);
  });
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === "true", // This will create database schema automatically
  //   ssl: {
  //     rejectUnauthorized: false // Bypass SSL certificate validation
  //   },
  entities: ["src/entity/**/*.ts"],
  logging: process.env.DB_LOGGING === "true"
});

AppDataSource.initialize()
  .then(() => {
    startServer(); // Start your Express server after TypeORM connection is established
  })
  .catch(error => {
    console.error("Error connecting to database:", error);
  });
