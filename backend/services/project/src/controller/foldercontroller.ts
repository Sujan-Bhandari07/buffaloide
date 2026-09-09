import  { err, publishMessage, success, tryCatch } from "@buffalo/shared";
import { Folder } from "../model/foldermodel.js";
import { Project } from "../model/projectmodel.js";

const createfolder=tryCatch(async(req ,res)=>{
    const{name,parentid,projectid}=req.body

    if(!name || !projectid){
        return err(res,"Pls provide folder name")
    }
    let exist=await Folder.findOne({
        name,
        projectid,
        type:"folder"

    })
    if(exist){
        return err(res,"Folder already exist with same name.")
    }
    exist=await Folder.create({
        name,
        parentid:parentid && parentid,
        projectid,
        type:"folder",
        isroot:!parentid?true:false


    })
    if(!exist){
return err(res,"Something went wrong")
    }
    await publishMessage("folderex","exfolder",{fid:exist._id,pid:projectid})
    
    return success(res,"Folder created successfully")
    
})

const createfile=tryCatch(async(req , res)=>{
    const{name,parentid,projectid}=req.body

    
    if(!name || !projectid){
        return err(res,"Pls provide folder name")
    }
    let exist=await Folder.findOne({
        name,
        projectid,
        type:"file",


    })
    if(exist){
        return err(res,"File already exist with same name.")
    }
    exist=await Folder.create({
        name,
        parentid:parentid && parentid,
        projectid,
        type:"file",
        isroot:parentid?false:true


    })
    if(!exist){
return err(res,"Something went wrong")
    }
     await publishMessage("folderex","exfolder",{fid:exist._id,pid:projectid})
    return success(res,"File created successfully")
    
})

const deletefolder=tryCatch(async(req , res)=>{

    const{folderid,projectid}=req.body
    const owner=req.headers["id"]
    if(!folderid || !projectid){
        return err(res,"Please provide folder and project id")
    }
    if(!owner){
        return err(res,"Not authenticated")
    }
    const project=await Project.findOne({_id:projectid,owner:owner.toString()})
    if(!project){
        return err(res,"Project not found")
    }
    const deleted=await Folder.findOne({_id:folderid,projectid})
    if(!deleted){
        return err(res,"File or folder not found")
    }

    const descendants = deleted.type === "folder"
        ? await Folder.find({projectid}).select("_id parentid").lean()
        : []
    const ids = new Set<string>([deleted._id.toString()])
    if (deleted.type === "folder") {
        let found = true
        while (found) {
            found = false
            for (const item of descendants) {
                if (item.parentid && ids.has(item.parentid.toString()) && !ids.has(item._id.toString())) {
                    ids.add(item._id.toString())
                    found = true
                }
            }
        }
    }
    await Folder.deleteMany({_id:{$in:Array.from(ids)},projectid})

    project.folders=project.folders.filter(i => !ids.has(i.toString()))
    await project.save()
    return success(res,deleted.type === "folder" ? "Folder deleted successfully" : "File deleted successfully")
})


const gettree = tryCatch(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return err(res, "Pls provide project id");
    }

    const project = await Project.findById(id);
    if (!project) {
        return err(res, "No project found");
    }

    // fetch everything belonging to this project in one shot
    const items = await Folder.find({ projectid: id }).lean();

    // map each item by its id, and add a children array
    const map = new Map<string, any>();
    items.forEach(item => {
        map.set(item._id.toString(), { ...item, children: [] });
    });

    const tree: any[] = [];

    items.forEach(item => {
        const node = map.get(item._id.toString());
        if (item.parentid) {
            const parent = map.get(item.parentid.toString());
            if (parent) {
                parent.children.push(node);
            } else {
                // parent not found (orphaned) - treat as root
                tree.push(node);
            }
        } else {
            // no parent -> root level
            tree.push(node);
        }
    });

    return res.status(200).json({
        success: true,
        project: {
            _id: project._id,
            name: project.name,
        },
        tree,
    });
});

export{createfile,createfolder,deletefolder,gettree}
