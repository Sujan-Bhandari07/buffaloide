import { err, success, tryCatch } from "@buffalo/shared";
import { Types } from "mongoose";
import { Folder, Project } from "../models.js";

interface PlannedFile {
  path: string;
  content: string;
}

interface ProjectPlan {
  projectName: string;
  description: string;
  files: PlannedFile[];
}

const systemPrompt = `You are the implementation engine inside Buffalo IDE. Execute the user's instruction against the supplied project context.
Return JSON only with this exact shape: {"projectName": string, "description": string, "files": [{"path": string, "content": string}]}.
Every file must contain its complete final text. Use existing files as the source of truth and preserve working behavior unless the instruction requires changing it.
Create all files needed for a runnable result, including package/config files when appropriate. Keep imports, routes, names, and types internally consistent.
For React or Vite projects, always include package.json with both "dev" and "start" scripts; use "vite --host 0.0.0.0" for start so npm run start works in Buffalo IDE, and include every required dependency.
For every Node project, include a package.json script that matches the user's requested start command and make the project runnable after npm install.
Never return explanations, placeholders, TODO-only files, markdown fences, secrets, binary data, absolute paths, or paths containing .. segments.
If the request asks to modify an existing project, return the complete contents of every changed file and keep unchanged files out of the response.`;

const parsePlan = (value: unknown): ProjectPlan => {
  if (!value || typeof value !== "object") throw new Error("AI returned an invalid project plan");
  const plan = value as Record<string, unknown>;
  if (typeof plan.projectName !== "string" || typeof plan.description !== "string" || !Array.isArray(plan.files)) {
    throw new Error("AI returned an incomplete project plan");
  }
  const files = plan.files.filter((file): file is Record<string, unknown> => Boolean(file) && typeof file === "object");
  if (files.length === 0 || files.length > 50) throw new Error("AI plan must contain between 1 and 50 files");
  return {
    projectName: plan.projectName.trim().slice(0, 100) || "ai-project",
    description: plan.description.trim().slice(0, 500),
    files: files.map((file) => {
      const path = typeof file.path === "string" ? file.path.trim() : "";
      if (!path || path.startsWith("/") || path.split("/").some((part) => part === ".." || part === "")) {
        throw new Error(`AI returned an unsafe file path: ${path}`);
      }
      if (typeof file.content !== "string") throw new Error(`Missing content for ${path}`);
      return { path, content: file.content };
    }),
  };
};

const generateproject = tryCatch(async (req, res) => {
  const { prompt, projectId } = req.body as { prompt?: unknown; projectId?: unknown };
  const owner = req.headers.id;
  if (typeof owner !== "string") return err(res, "Not authenticated");
  if (typeof prompt !== "string" || prompt.trim().length < 3) return err(res, "Please provide an instruction");
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPENROUTER_API_KEY;
  const isOpenRouter = Boolean(!process.env.OPENAI_API_KEY && process.env.OPENROUTER_API_KEY);
  const baseUrl = process.env.OPENAI_BASE_URL ?? (isOpenRouter ? "https://openrouter.ai/api/v1" : "https://api.openai.com/v1");
  if (!apiKey || apiKey === "your-key") return err(res, "AI service is not configured with a valid API key");
  let projectContext = "No existing project files. Design the project structure from the instruction.";
  if (typeof projectId === "string" && Types.ObjectId.isValid(projectId)) {
    const existingProject = await Project.findOne({ _id: projectId, owner });
    if (existingProject) {
      const existingFiles = await Folder.find({ projectid: existingProject._id }).select("name type content parentid").lean();
      const byId = new Map(existingFiles.map((file) => [file._id.toString(), file]));
      const getPath = (file: typeof existingFiles[number]): string => {
        const parent = file.parentid ? byId.get(file.parentid.toString()) : undefined;
        return parent ? `${getPath(parent)}/${file.name}` : file.name;
      };
      const files = existingFiles.filter((file) => file.type === "file").map((file) => ({
        path: getPath(file),
        content: (file.content ?? "").slice(0, 20000),
      }));
      projectContext = JSON.stringify({ projectName: existingProject.name, description: existingProject.description, files }).slice(0, 120000);
    }
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(isOpenRouter ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:5173", "X-Title": "Buffalo IDE" } : {}),
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `PROJECT CONTEXT:\n${projectContext}\n\nUSER INSTRUCTION:\n${prompt.trim()}` },
      ],
    }),
  });
  if (!response.ok) throw new Error(`AI provider request failed (${response.status})`);
  const completion = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = completion.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI provider returned no project plan");
  const plan = parsePlan(JSON.parse(content.replace(/^```json\s*|\s*```$/g, "")));

  let project = typeof projectId === "string" && Types.ObjectId.isValid(projectId)
    ? await Project.findOne({ _id: projectId, owner })
    : null;
  if (!project) project = await Project.create({ name: plan.projectName, description: plan.description, owner, folders: [] });

  const folderIds = new Map<string, Types.ObjectId>();
  for (const file of plan.files) {
    const parts = file.path.split("/");
    let parentid: Types.ObjectId | undefined;
    for (const folderName of parts.slice(0, -1)) {
      const key = `${parentid?.toString() ?? "root"}/${folderName}`;
      let folderId = folderIds.get(key);
      if (!folderId) {
        const folder = await Folder.create({ name: folderName, type: "folder", ...parentid ? { parentid } : {}, projectid: project._id, isroot: !parentid });
        const createdFolderId = folder._id;
        folderId = createdFolderId;
        folderIds.set(key, createdFolderId);
        project.folders.push(createdFolderId);
      }
      parentid = folderId;
    }
    const fileName = parts.at(-1);
    if (!fileName) throw new Error("AI returned an invalid file path");
    const existing = await Folder.findOne({ projectid: project._id, name: fileName, ...parentid ? { parentid } : {}, type: "file" });
    if (existing) { existing.content = file.content; await existing.save(); }
    else {
      const fileRecord = await Folder.create({ name: fileName, type: "file", content: file.content, ...parentid ? { parentid } : {}, projectid: project._id, isroot: !parentid });
      project.folders.push(fileRecord._id);
    }
  }
  await project.save();
  return success(res, "Project created from AI instruction", { projectId: project._id, projectName: project.name, files: plan.files.map((file) => file.path) });
});

export { generateproject };