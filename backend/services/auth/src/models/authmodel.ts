import mongoose from "mongoose";

interface IAuth{
    name:string,
    email:string,
    firebaseid:string,
    avatar:string,
}

const authschema= new mongoose.Schema<IAuth>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    firebaseid:{
        type:String,
        required:true,
        unique:true
    },
    avatar:{
        type:String,
        required:true,
    },
},{timestamps:true})

const Auth= mongoose.model<IAuth>("Auth",authschema)

export{Auth}