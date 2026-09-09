import { err, success, tryCatch } from "@buffalo/shared";
import { Project } from "../model/projectmodel.js";
import { Folder } from "../model/foldermodel.js";

const createproject=tryCatch(async(req , res)=>{
const {name,description }=req.body
const owner=req.headers["id"]
if(!owner)return err(res,"Not authenticated")
if(!name){
    return err(res,"Pls provide name")
}
const project=await Project.create({
    name,
    description,
    owner:owner as string
})
if(project){
    return success(res,"Project created successfully",project)
}
})

const togglestar=tryCatch(async(req , res)=>{
    const{isstar,id}=req.body
    if(!id || typeof isstar !== "boolean"){
        return err(res,"Pls provide id")
    }
    const project=await Project.findByIdAndUpdate(id,{
        isstar
    },{new:true})
    if(!project){
        return err(res,"Something went wrong")
    }
    return success(res,"Toggles star",project)

})

const getallproject=tryCatch(async(req , res)=>{

    const authid=req.headers["id"]
    if(!authid)return err(res,"Not authenticated")
        const projects=await Project.find({owner:authid})
    if(!projects){
        return err(res,"some thing went wrong")
    }
    return success(res,"Projects found",projects)
})

const deleteproject=tryCatch(async(req , res)=>{

    const {projectid}=req.body
    const owner=req.headers["id"]
    if(!projectid)return err(res,"Pls provide projectid")
    if(!owner)return err(res,"Not authenticated")
        const projects=await Project.findOneAndDelete({_id:projectid,owner:owner.toString()})
    if(!projects){
        return err(res,"Project not found")
    }

    await Folder.deleteMany({projectid:projects._id})
    return success(res,"Project delete successfully")
})



export{togglestar,createproject,getallproject,deleteproject}
