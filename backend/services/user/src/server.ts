import "dotenv/config";
import express from "express";
import { connectdb } from "./config/db.js";
import { userrouter } from "./routes/userroute.js";
import { createuser } from "./utils/consumer.js";
import { connectRabbitMQ } from "@buffalo/shared";

async function bootstrap() {
  const Port = process.env.PORT;

  const app = express();
  app.use(express.json())
  connectdb();
  await connectRabbitMQ()
  await createuser();

  app.use("/", userrouter);

  app.listen(Port, () => {
    console.log("auth listened");
  });
}

bootstrap()
