import { consumeMessages } from "@buffalo/shared"
import type { Types } from "mongoose"
import { Project } from "../model/projectmodel.js"
import { Folder } from "../model/foldermodel.js"



const addfolder=async()=>{

    await consumeMessages<{pid:Types.ObjectId,fid:Types.ObjectId}>("folderex","exfolder","abc",async(data)=>{
const project=await Project.findById(data.pid)
project?.folders.push(data.fid)
    })
}


const delfolder = async () => {
  await consumeMessages<{ folders: string[] }>(
    "delex",
    "exdel",
    "del",
    async (data) => {
      await Promise.all(
        data.folders.map((folder) =>
          Folder.findByIdAndDelete(folder)
        )
      );
    }
  );
};

export {addfolder,delfolder}