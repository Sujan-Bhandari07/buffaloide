import cookieParser from "cookie-parser"
import "dotenv/config"
import express from "express"
import proxy from "express-http-proxy"
import { proxywithheader } from "./utils/proxy.js"
import cors from "cors"
import { authmid } from "./middleware/authmid.js"

const Port=process.env.PORT

const app= express()
app.use(cors({
    credentials:true,
    origin:process.env.FRONTEND_URL as string
}))

app.use(cookieParser())


app.use("/api/v1/auth",proxy(process.env.AUTH_SERVICE_URL as string))
app.use("/api/v1/user",authmid,proxywithheader(process.env.USER_SERVICE_URL as string))
app.use("/api/v1/project",authmid,proxywithheader(process.env.PROJECT_SERVICE_URL as string))
app.use("/api/v1/ai",authmid,proxywithheader(process.env.AI_SERVICE_URL as string))

app.listen(Port,()=>{
    console.log("gateway listened")
})

