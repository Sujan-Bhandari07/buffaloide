import "dotenv/config"
import express from "express"
import { connectdb } from "./config/db.js"
import { connectRabbitMQ } from "@buffalo/shared"
import { addfolder, delfolder } from "./utils/consumer.js"
import { projectrouter } from "./routes/projectroutes.js"




async function bootstrap() {
    const app= express()
    const Port=process.env.PORT

  app.use(express.json())
  connectdb()
  await connectRabbitMQ()
  await addfolder()
  await delfolder()

  app.use("/",projectrouter)





app.listen(Port,()=>{
    console.log("project listened")
})
}
bootstrap()


