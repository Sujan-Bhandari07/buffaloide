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
    if(!folderid){
        return err(res,"Pls provide folder id")
    }
    const deleted=await Folder.findByIdAndDelete(folderid)
    if(!deleted){
return err(res,"something went wrong")
    }

    const del=await Project.findById(projectid)
    if(del){
        del.folders=del.folders.filter(i=>i !== folderid)
        await del.save()

    }
    return success(res,"Deleted folder successfully")
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
