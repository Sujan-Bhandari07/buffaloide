import mongoose from "mongoose";
interface IUser{
avatar:string,
    name:string,
    authid:string,
    credits:number,
    email:string,
}

const userschema = new mongoose.Schema<IUser>({



    name:{
        type:String,
        required:true,
    
    },
    avatar:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true
    },
    
   
    authid:{
        type:String,
        unique:true,

    },
    credits:{
        type:Number,
        default:100
    }
    


},{timestamps:true})

const User= mongoose.model("User",userschema)
export{User}