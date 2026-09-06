import express from "express"
import { getprofile } from "../controller/usercontroller.js"

const userrouter=express()

userrouter.get("/getprofile",getprofile)
export{userrouter}