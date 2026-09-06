import express from "express"
import { createproject, deleteproject, getallproject, togglestar } from "../controller/projectcontroller.js"
import { createfile, createfolder, deletefolder, gettree } from "../controller/foldercontroller.js"
const projectrouter=express.Router()

projectrouter.post("/createproject",createproject)
projectrouter.post("/createfolder",createfolder)
projectrouter.post("/createfile",createfile)
projectrouter.post("/deletefolder",deletefolder)
projectrouter.post("/togglestar",togglestar)
projectrouter.post("/deleteproject",deleteproject)
projectrouter.get("/gettree/:id",gettree)
projectrouter.get("/getallproject",getallproject)

export{projectrouter}