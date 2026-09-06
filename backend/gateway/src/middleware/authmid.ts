import { err, redis, tryCatch } from "@buffalo/shared";

const authmid=tryCatch(async (req ,res ,next)=>{

    const token = req.cookies.token
    if(!token){
        return err(res,"Not authenticated")
    }
    const user=await redis.get(`token-${token}`)
   
    if(!user){
        return err(res,"Something went wrong")
    }
     const data=JSON.parse(user)
    req.user=data._id
    next()
})

export{authmid}