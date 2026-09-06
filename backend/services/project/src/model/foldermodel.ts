import mongoose, { Types } from "mongoose";



 interface IFolder{
    name:string
    type:"folder" | "file"
content:string
parentid:Types.ObjectId,
projectid:Types.ObjectId,
isroot:boolean

}

const folderschema= new mongoose.Schema<IFolder>({

    name:{
        type:String,
        required:true
    },
type:{
        type:String,
        enum:["file","folder"],
        required:true

    },

    content:{
        type:String,
    },

    isroot:{
        type:Boolean,
        default:false
    },
    parentid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Folder"
    },
    projectid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    }
   
},{timestamps:true})

const Folder=mongoose.model<IFolder>("Folder",folderschema)
export{Folder}