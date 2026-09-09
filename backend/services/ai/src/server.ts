import "dotenv/config";
import express from "express";
import http from "node:http";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { WebSocketServer, type WebSocket } from "ws";
import { Types } from "mongoose";
import { redis } from "@buffalo/shared";
import { connectdb } from "./config/db.js";
import { Folder, Project } from "./models.js";
import { airouter } from "./routes/airoutes.js";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use("/", airouter);

const server = http.createServer(app);
const terminalServer = new WebSocketServer({ noServer: true });

const getCookie = (cookieHeader: string | undefined, name: string) => cookieHeader
	?.split(";")
	.map((part) => part.trim())
	.find((part) => part.startsWith(`${name}=`))
	?.slice(name.length + 1);

const prepareWorkspace = async (projectId: string, owner: string) => {
	if (!Types.ObjectId.isValid(projectId)) throw new Error("A valid project is required for the terminal");
	const project = await Project.findOne({ _id: projectId, owner });
	if (!project) throw new Error("Project not found");
	const workspace = path.resolve(process.env.TERMINAL_WORKSPACE_ROOT ?? path.join(process.cwd(), ".workspaces"), projectId);
	const items = await Folder.find({ projectid: project._id }).lean();
	const byId = new Map(items.map((item) => [item._id.toString(), item]));
	const getFilePath = (item: (typeof items)[number]): string => {
		const parent = item.parentid ? byId.get(item.parentid.toString()) : undefined;
		return parent ? `${getFilePath(parent)}/${item.name}` : item.name;
	};
	await rm(workspace, { recursive: true, force: true });
	await mkdir(workspace, { recursive: true });
	for (const item of items) {
		const relativePath = getFilePath(item);
		const target = path.resolve(workspace, relativePath);
		if (!target.startsWith(`${workspace}${path.sep}`)) continue;
		if (item.type === "folder") await mkdir(target, { recursive: true });
		else {
			await mkdir(path.dirname(target), { recursive: true });
			await writeFile(target, item.content ?? "", "utf8");
		}
	}
	return workspace;
};

server.on("upgrade", async (request, socket, head) => {
	const url = new URL(request.url ?? "/", "http://localhost");
	if (url.pathname !== "/terminal") {
		socket.destroy();
		return;
	}
	const token = getCookie(request.headers.cookie, "token");
	const session = token ? await redis.get(`token-${token}`) : null;
	if (!session) {
		socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
		socket.destroy();
		return;
	}
	const user = JSON.parse(session) as { _id?: string };
	const projectId = url.searchParams.get("projectId");
	if (!projectId || !user._id) {
		socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
		socket.destroy();
		return;
	}
	try {
		const cwd = await prepareWorkspace(projectId, user._id);
		terminalServer.handleUpgrade(request, socket, head, (client) => terminalServer.emit("connection", client, { cwd }));
	} catch {
		socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
		socket.destroy();
	}
});

terminalServer.on("connection", (client: WebSocket, context: { cwd: string }) => {
	let commandLine = "";
	let running: ChildProcessWithoutNullStreams | undefined;
	const { cwd } = context;

	const send = (message: { type: string; data?: string; code?: number | null }) => {
		if (client.readyState === client.OPEN) client.send(JSON.stringify(message));
	};

	send({ type: "ready", data: `Connected to ${cwd}\r\n$ ` });
	client.on("message", (raw) => {
		const message = JSON.parse(raw.toString()) as { type?: string; data?: string };
		if (message.type !== "input" || typeof message.data !== "string") return;
		for (const character of message.data) {
			if (character === "\u0003") {
				running?.kill("SIGINT");
				send({ type: "output", data: "^C\r\n$ " });
				commandLine = "";
			} else if (character === "\r" || character === "\n") {
				const command = commandLine.trim();
				commandLine = "";
				if (!command) { send({ type: "output", data: "$ " }); continue; }
				running = spawn("/bin/zsh", ["-lc", command], { cwd, env: process.env });
				running.stdout.on("data", (data) => send({ type: "output", data: data.toString() }));
				running.stderr.on("data", (data) => send({ type: "output", data: data.toString() }));
				running.on("close", (code) => { running = undefined; send({ type: "exit", code, data: "\r\n$ " }); });
			} else if (character === "\u007f") {
				if (commandLine.length > 0) { commandLine = commandLine.slice(0, -1); send({ type: "output", data: "\b \b" }); }
			} else {
				commandLine += character;
				send({ type: "output", data: character });
			}
		}
	});
	client.on("close", () => running?.kill("SIGTERM"));
});

await connectdb();
server.listen(process.env.PORT, () => console.log("ai service listened"));