import "dotenv/config"
import express from "express"
import { connectdb } from "./config/db.js"
import { authrouter } from "./routes/authroutes.js"
import { connectRabbitMQ } from "@buffalo/shared"



async function bootstrap() {
    const app= express()
    const Port=process.env.PORT
    connectdb()
  await  connectRabbitMQ()
  app.use(express.json())


app.use("/",authrouter)


app.listen(Port,()=>{
    console.log("auth listened")
})
}
bootstrap()


