import mongoose from "mongoose";

const connectdb=async()=>{

    try {
        mongoose.connect(process.env.MONGO_URI as string)
        console.log("mongodb connected for auth")
    } catch (error:any) {
        console.log(error.message)
        
    }
}
export{connectdb}