import  { err, success, tryCatch } from "@buffalo/shared";
import { User } from "../model/usermodel.js";

const getprofile=tryCatch(async(req , res)=>{
    const id=req.headers["id"]
    if(!id){
        return err(res,"Not authenticated")
    }
    const user=await User.findOne({authid:id})
    if(!user){
        return err(res,"User not found")
    }
    return success(res,"User found",user)
})



export{getprofile}