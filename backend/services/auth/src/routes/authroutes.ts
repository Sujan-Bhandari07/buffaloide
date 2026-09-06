import express from "express"
import { login, logout } from "../controller/authcontroller.js"

const authrouter= express.Router()
authrouter.post("/login",login)
authrouter.post("/logout",logout)

export{authrouter}
