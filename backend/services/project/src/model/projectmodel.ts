import mongoose, { Types } from "mongoose";



interface IProject{
    name:string
    description:string
    isstar:boolean,
    owner:string
    folders:Types.ObjectId[]
    

}

const projectScxhema= new mongoose.Schema<IProject>({

    name:{
        type:String,
        required:true,
        
    },
description:{
        type:String,

    },
    owner:{
type:String,
required:true
    },

    isstar:{
        type:Boolean,
        required:true,
        default:false
    },
    folders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Folder"
    }]
   
},{timestamps:true})

const Project=mongoose.model<IProject>("Project",projectScxhema)
export{Project}