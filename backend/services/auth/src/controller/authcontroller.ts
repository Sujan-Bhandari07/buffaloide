import { err, publishMessage, redis, success, tryCatch } from "@buffalo/shared";
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import { Auth } from "../models/authmodel.js";

const login = tryCatch(async (req, res) => {
  const { tokens } = req.body;
  if (!tokens) {
    return err(res, "Pls provide token");
  }
  const decoded = await getAuth(app).verifyIdToken(tokens);
  let user = await Auth.findOne({ firebaseid: decoded.uid });
  if (!user) {
    user = await Auth.create({
      name: decoded.name,
      firebaseid: decoded.uid,
      email: decoded.email!,
      avatar: decoded.picture!,
    });
  }
  const token=crypto.randomUUID()

  await redis.set(`token-${token}`,JSON.stringify({
    _id:user._id,
    name:user.name,
    email:user.email,
    avatar:user.avatar
  }),"EX",7*24*60*60)

  await publishMessage("authex","exauth",{
    authid:user._id,
    name:user.name,
    email:user.email,
    avatar:user.avatar
  })

  res.cookie("token",token,{
    httpOnly:true,
    sameSite:"strict" ,
    secure:false,
    maxAge:7*24*60*60*1000
  })
  return success(res,"Login successfull !",{
    name:user.name,
    email:user.email,
    avatar:user.avatar
  })
  
});

const logout=tryCatch(async(req ,res)=>{
const token = req.headers.cookie
  ?.split(";")
  .map((part) => part.trim())
  .find((part) => part.startsWith("token="))
  ?.slice("token=".length)
  if (token) await redis.del(`token-${token}`)
  res.clearCookie("token")
  return success(res,"Logout successfull")
})

export{login,logout}