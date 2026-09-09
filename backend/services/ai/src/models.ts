import mongoose, { Types } from "mongoose";

interface IProject {
  name: string;
  description: string;
  owner: string;
  folders: Types.ObjectId[];
  isstar: boolean;
}

interface IFolder {
  name: string;
  type: "folder" | "file";
  content?: string;
  parentid?: Types.ObjectId;
  projectid: Types.ObjectId;
  isroot: boolean;
}

const projectSchema = new mongoose.Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  owner: { type: String, required: true },
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "AIFolder" }],
  isstar: { type: Boolean, default: false },
}, { timestamps: true });

const folderSchema = new mongoose.Schema<IFolder>({
  name: { type: String, required: true },
  type: { type: String, enum: ["folder", "file"], required: true },
  content: { type: String, default: "" },
  parentid: { type: mongoose.Schema.Types.ObjectId, ref: "AIFolder" },
  projectid: { type: mongoose.Schema.Types.ObjectId, ref: "AIProject", required: true },
  isroot: { type: Boolean, default: false },
}, { timestamps: true });

const Project = mongoose.models.AIProject as mongoose.Model<IProject> ?? mongoose.model<IProject>("AIProject", projectSchema, "projects");
const Folder = mongoose.models.AIFolder as mongoose.Model<IFolder> ?? mongoose.model<IFolder>("AIFolder", folderSchema, "folders");

export { Folder, Project };