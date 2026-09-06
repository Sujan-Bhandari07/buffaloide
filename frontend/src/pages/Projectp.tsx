import React, { useRef } from "react";
import { useParams } from "react-router-dom";

import {
  Files,
  Bot,
  MousePointer2,
  Folder,
  Globe,
  Code2,
  TerminalSquare,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  FilePlus,
  FolderPlus,
  Eye,
  FileCode2,
  ChevronUp,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Wand2,
  MoreHorizontal,
  SendHorizontal,
  GitBranch,
  Wifi,
  X,
  FileJson,
  FileText,
  Image,
  Braces,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../utils/Hooks";
import { receiveAssistantMessage, sendChatMessage, setChatDraft, setMainView, toggleAssistantPanel, toggleExplorer, toggleExplorerPanel, toggleTerminal } from "../store/Projectslice";
import { type ProjectTreeNode, useCreatefileMutation, useCreatefolderMutation, useGettreeQuery } from "../store/Projectapi";

/* ============================================================================
 * STATE — RTK slice (single source of truth, no prop drilling)
 * ==========================================================================*/


/* ============================================================================
 * COMPONENTS
 * ==========================================================================*/
type SidebarView = "explorer" | "assistant" | "search";
type MainView = "editor" | "preview";

function IconRail() {
  const dispatch = useAppDispatch();
  const { explorerVisible, assistantVisible } = useAppSelector((s) => ({
    explorerVisible: s.ide.explorerVisible,
    assistantVisible: s.ide.assistantVisible,
  }));

  const railItems: { id: SidebarView; icon: typeof Files; label: string }[] = [
    { id: "explorer", icon: Files, label: "Explorer" },
    { id: "assistant", icon: Bot, label: "Assistant" },
  ];

  return (
    <div className="flex w-14 flex-col items-center gap-2 border-r border-white/5 bg-[#0a0a0d] py-3">
      {railItems.map(({ id, icon: Icon, label }) => {
        const active = id === "explorer" ? explorerVisible : assistantVisible;
        return (
          <button
            key={id}
            title={label}
            onClick={() => dispatch(id === "explorer" ? toggleExplorerPanel() : toggleAssistantPanel())}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              active
                ? "bg-[#7c6cf6]/15 text-[#8b7cf8]"
                : "text-[#8a8a96] hover:bg-white/5 hover:text-white"
            }`}
          >
            {active && (
              <span className="absolute -left-[9px] h-5 w-[3px] rounded-full bg-[#7c6cf6]" />
            )}
            <Icon size={19} strokeWidth={1.8} />
          </button>
        );
      })}

      <div className="mt-auto flex flex-col items-center gap-2">
        <button
          title="Selection tool"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#8a8a96] hover:bg-white/5 hover:text-white"
        >
          <MousePointer2 size={18} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

function TopBar({ projectName }: { projectName?: string }) {
  const dispatch = useAppDispatch();
  const defaultProjectName = useAppSelector((s) => s.ide.projectName);

  return (
    <div className="flex h-14 items-center justify-between border-b border-white/5 bg-[#0a0a0d] px-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#7c6cf6] to-[#4a3f8f] text-sm font-bold text-white">
            BI
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">
          Buffalo Ide
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-white/90 hover:bg-white/5">
          <Folder size={15} className="text-amber-400" fill="currentColor" strokeWidth={0} />
          <span className="font-medium">{projectName ?? defaultProjectName}</span>
          <Globe size={14} className="ml-1 text-[#8a8a96]" strokeWidth={1.8} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleTerminal())}
          title="Toggle terminal"
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#8a8a96] hover:bg-white/5 hover:text-white"
        >
          <TerminalSquare size={17} strokeWidth={1.8} />
        </button>
        <button
          title="Source"
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#8a8a96] hover:bg-white/5 hover:text-white"
        >
          <Code2 size={17} strokeWidth={1.8} />
        </button>
        <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-orange-300 to-rose-400 ring-1 ring-white/10" />
      </div>
    </div>
  );
}

function getNodeAppearance(node: ProjectTreeNode) {
  if (node.type === "folder") {
    const folderColors: Record<string, string> = {
      src: "text-sky-400",
      components: "text-cyan-400",
      assets: "text-amber-400",
      public: "text-emerald-400",
      config: "text-violet-400",
      utils: "text-pink-400",
    };
    return { icon: Folder, color: folderColors[node.name.toLowerCase()] ?? "text-[#8b7cf8]" };
  }

  const extension = node.name.split(".").pop()?.toLowerCase() ?? "";
  if (extension === "json") return { icon: FileJson, color: "text-amber-300" };
  if (["ts", "tsx"].includes(extension)) return { icon: Braces, color: "text-sky-400" };
  if (["js", "jsx", "mjs", "cjs"].includes(extension)) return { icon: Braces, color: "text-yellow-300" };
  if (["css", "scss", "sass", "less"].includes(extension)) return { icon: FileText, color: "text-pink-400" };
  if (["html", "htm"].includes(extension)) return { icon: FileText, color: "text-orange-400" };
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(extension)) return { icon: Image, color: "text-purple-400" };
  if (["md", "mdx", "txt"].includes(extension)) return { icon: FileText, color: "text-emerald-400" };
  if (node.name.startsWith(".env")) return { icon: FileText, color: "text-lime-400" };
  return { icon: FileCode2, color: "text-[#8a8a96]" };
}

function TreeNode({ node, level = 0, selectedId, onSelectFolder, onOpenContextMenu }: { node: ProjectTreeNode; level?: number; selectedId: string | null; onSelectFolder: (id: string) => void; onOpenContextMenu: (event: React.MouseEvent, parentId: string) => void }) {
  const [expanded, setExpanded] = React.useState(true);
  const isFolder = node.type === "folder";
  const { icon: NodeIcon, color } = getNodeAppearance(node);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (isFolder) {
            setExpanded((value) => !value);
            onSelectFolder(node._id);
          }
        }}
        onContextMenu={(event) => {
          if (isFolder) {
            event.preventDefault();
            onSelectFolder(node._id);
            onOpenContextMenu(event, node._id);
          }
        }}
        className={`flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-sm text-white/90 hover:bg-white/5 ${selectedId === node._id ? "bg-[#7c6cf6]/20" : ""}`}
        style={{ paddingLeft: `${8 + level * 14}px` }}
      >
        {isFolder ? (
          expanded ? <ChevronDown size={14} className="text-[#8a8a96]" /> : <ChevronRight size={14} className="text-[#8a8a96]" />
        ) : <span className="w-[14px]" />}
        <NodeIcon size={15} className={color} fill={isFolder ? "currentColor" : "none"} strokeWidth={isFolder ? 0 : 1.8} />
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder && expanded && node.children.map((child) => (
        <TreeNode key={child._id} node={child} level={level + 1} selectedId={selectedId} onSelectFolder={onSelectFolder} onOpenContextMenu={onOpenContextMenu} />
      ))}
    </div>
  );
}

function Explorer({ tree, isLoading, isError, projectName, projectId, onRefresh }: { tree: ProjectTreeNode[]; isLoading: boolean; isError: boolean; projectName?: string; projectId: string; onRefresh: () => void }) {
  const dispatch = useAppDispatch();
  const [selectedParentId, setSelectedParentId] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState<"file" | "folder" | null>(null);
  const [name, setName] = React.useState("");
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number; parentId: string | null } | null>(null);
  const [createFile, { isLoading: isCreatingFile }] = useCreatefileMutation();
  const [createFolder, { isLoading: isCreatingFolder }] = useCreatefolderMutation();
  const { defaultProjectName, isExplorerExpanded, explorerVisible } = useAppSelector((s) => ({
    defaultProjectName: s.ide.projectName,
    isExplorerExpanded: s.ide.isExplorerExpanded,
    explorerVisible: s.ide.explorerVisible,
  }));
  React.useEffect(() => {
    const closeContextMenu = () => setContextMenu(null);
    window.addEventListener("click", closeContextMenu);
    window.addEventListener("resize", closeContextMenu);
    return () => {
      window.removeEventListener("click", closeContextMenu);
      window.removeEventListener("resize", closeContextMenu);
    };
  }, []);

  if (!explorerVisible) return null;

  const isCreating = isCreatingFile || isCreatingFolder;

  const openCreateForm = (type: "file" | "folder", parentId: string | null) => {
    setSelectedParentId(parentId);
    setCreating(type);
    setName("");
    setContextMenu(null);
  };

  const openContextMenu = (event: React.MouseEvent, parentId: string | null) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, parentId });
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !creating || isCreating) return;

    const payload = { name: trimmedName, projectid: projectId, ...(selectedParentId ? { parentid: selectedParentId } : {}) };
    if (creating === "file") await createFile(payload).unwrap();
    if (creating === "folder") await createFolder(payload).unwrap();
    setName("");
    setCreating(null);
  };

  return (
    <div className="flex w-64 flex-col border-r border-white/5 bg-[#0e0e12]">
      <div className="flex items-center justify-between px-3 pt-4 pb-2">
        <span className="text-[11px] font-semibold tracking-widest text-[#8a8a96]">
          EXPLORER
        </span>
        <div className="flex items-center gap-1 text-[#8a8a96]">
          <button onClick={() => openCreateForm("file", selectedParentId)} className="rounded p-1 hover:bg-white/5 hover:text-white" title="New file">
            <FilePlus size={13.5} strokeWidth={1.8} />
          </button>
          <button onClick={() => openCreateForm("folder", selectedParentId)} className="rounded p-1 hover:bg-white/5 hover:text-white" title="New folder">
            <FolderPlus size={13.5} strokeWidth={1.8} />
          </button>
          <button onClick={onRefresh} className="rounded p-1 hover:bg-white/5 hover:text-white" title="Refresh">
            <RefreshCw size={13.5} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="border-y border-white/5 p-2">
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={`New ${creating} name`}
              className="min-w-0 flex-1 rounded bg-[#17171d] px-2 py-1.5 text-xs text-white outline-none ring-[#7c6cf6] placeholder:text-[#8a8a96]/70 focus:ring-1"
            />
            <button type="submit" disabled={!name.trim() || isCreating} className="rounded bg-[#7c6cf6] px-2 py-1.5 text-xs text-white disabled:opacity-40">
              {isCreating ? "..." : "Add"}
            </button>
            <button type="button" onClick={() => { setCreating(null); setName(""); }} className="rounded p-1.5 text-[#8a8a96] hover:bg-white/5 hover:text-white" title="Cancel">
              <X size={13} />
            </button>
          </div>
          <p className="mt-1 truncate text-[10px] text-[#8a8a96]">
            {selectedParentId ? "Inside selected folder" : "At project root"}
          </p>
        </form>
      )}

      <div className="flex-1 overflow-y-auto px-1">
        <button
          onClick={() => dispatch(toggleExplorer())}
          onContextMenu={(event) => openContextMenu(event, null)}
          className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-sm text-white/90 hover:bg-white/5"
        >
          {isExplorerExpanded ? (
            <ChevronDown size={14} className="text-[#8a8a96]" />
          ) : (
            <ChevronRight size={14} className="text-[#8a8a96]" />
          )}
          <Folder size={15} className="text-[#8b7cf8]" fill="currentColor" strokeWidth={0} />
          <span className="font-medium">{projectName ?? defaultProjectName}</span>
        </button>

        {isExplorerExpanded && isLoading && (
          <div className="py-6 text-center text-xs text-[#8a8a96]/70">Loading files...</div>
        )}
        {isExplorerExpanded && isError && (
          <div className="px-3 py-6 text-center text-xs text-red-300">Unable to load project files.</div>
        )}
        {isExplorerExpanded && !isLoading && !isError && tree.length === 0 && (
          <div className="py-6 text-center text-xs text-[#8a8a96]/70">No files yet.</div>
        )}
        {isExplorerExpanded && !isLoading && !isError && tree.map((node) => (
          <TreeNode key={node._id} node={node} selectedId={selectedParentId} onSelectFolder={setSelectedParentId} onOpenContextMenu={openContextMenu} />
        ))}
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 min-w-40 rounded-md border border-white/10 bg-[#17171d] p-1 shadow-xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <button onClick={() => openCreateForm("file", contextMenu.parentId)} className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs text-white/90 hover:bg-white/10">
            <FilePlus size={14} />
            New file
          </button>
          <button onClick={() => openCreateForm("folder", contextMenu.parentId)} className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs text-white/90 hover:bg-white/10">
            <FolderPlus size={14} />
            New folder
          </button>
        </div>
      )}
    </div>
  );
}

function EditorArea() {
  const dispatch = useAppDispatch();
  const { mainView, terminalOpen, activeFileId } = useAppSelector((s) => ({
    mainView: s.ide.mainView,
    terminalOpen: s.ide.terminalOpen,
    activeFileId: s.ide.activeFileId,
  }));

  const tabs: { id: MainView; label: string; icon: typeof Code2 }[] = [
    { id: "editor", label: "Editor", icon: Code2 },
    { id: "preview", label: "Preview", icon: Eye },
  ];

  return (
    <div className="relative flex flex-1 flex-col bg-black">
      <div className="flex items-center justify-center border-b border-white/5 py-3">
        <div className="flex items-center gap-1 rounded-lg bg-[#17171d] p-1">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = mainView === id;
            return (
              <button
                key={id}
                onClick={() => dispatch(setMainView(id))}
                className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#2c2c36] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                    : "text-[#8a8a96] hover:text-white"
                }`}
              >
                <Icon size={14.5} strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        {activeFileId ? (
          <div className="p-6 text-sm text-white/70">Editing {activeFileId}</div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#17171d]/70 ring-1 ring-white/5">
              <FileCode2 size={28} className="text-[#8a8a96]" strokeWidth={1.5} />
            </div>
            <p className="text-[15px] font-semibold text-white/90">No file open</p>
            <p className="text-sm text-[#8a8a96]">
              Select a file from Explorer to start editing
            </p>
          </div>
        )}
      </div>

      {!terminalOpen && (
        <button
          onClick={() => dispatch(toggleTerminal())}
          className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-[#17171d] px-3 py-1.5 text-xs font-medium text-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:bg-[#1c1c23]"
        >
          <ChevronUp size={13} strokeWidth={2} />
          Show Terminal
        </button>
      )}

      {terminalOpen && (
        <div className="h-44 border-t border-white/5 bg-[#0e0e12] p-3 font-mono text-xs text-white/70">
          <div className="flex items-center justify-between text-[#8a8a96]">
            <span>TERMINAL</span>
            <button onClick={() => dispatch(toggleTerminal())} className="hover:text-white">
              Hide
            </button>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[#8b7cf8]">➜</span>
            <span className="text-white/60">calculator</span>
            <span className="animate-pulse">▍</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatPanel() {
  const dispatch = useAppDispatch();
  const { chatDraft, chatMessages, isAssistantThinking } = useAppSelector((s) => ({
    chatDraft: s.ide.chatDraft,
    chatMessages: s.ide.chatMessages,
    isAssistantThinking: s.ide.isAssistantThinking,
  }));
  const timeoutRef = useRef<number | null>(null);

  const handleSend = () => {
    const text = chatDraft.trim();
    if (!text) return;
    dispatch(sendChatMessage(text));
    timeoutRef.current = window.setTimeout(() => {
      dispatch(receiveAssistantMessage(`Got it — working on "${text}".`));
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex w-[380px] flex-col border-l border-white/5 bg-[#0e0e12]">
      <div className="border-b border-white/5 px-4 py-4">
        <h2 className="text-[15px] font-semibold text-white">Buffalo AI Chat</h2>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4">
        {chatMessages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c6cf6]/25 to-[#4a3f8f]/25 ring-1 ring-white/5">
              <Sparkles size={20} className="text-[#8b7cf8]" strokeWidth={1.8} />
            </div>
            <p className="text-[15px] font-semibold text-white/90">
              What do you want to build?
            </p>
            <p className="text-sm text-[#8a8a96]">Ask me to create or modify files.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-4">
            {chatMessages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "self-end bg-[#7c6cf6]/20 text-white"
                    : "self-start bg-[#17171d] text-white/85"
                }`}
              >
                {m.text}
              </div>
            ))}
            {isAssistantThinking && (
              <div className="self-start rounded-xl bg-[#17171d] px-3 py-2 text-sm text-[#8a8a96]">
                Thinking…
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-white/5 p-3">
        <div className="rounded-xl bg-[#17171d] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
          <textarea
            value={chatDraft}
            onChange={(e) => dispatch(setChatDraft(e.target.value))}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to build something..."
            rows={2}
            className="w-full resize-none bg-transparent px-2 py-1 text-sm text-white placeholder:text-[#8a8a96]/70 focus:outline-none"
          />
          <div className="mt-1 flex items-center justify-between px-1">
            <div className="flex items-center gap-1 text-[#8a8a96]">
              <button className="rounded p-1.5 hover:bg-white/5 hover:text-white" title="Helpful">
                <ThumbsUp size={14} strokeWidth={1.8} />
              </button>
              <button className="rounded p-1.5 hover:bg-white/5 hover:text-white" title="Not helpful">
                <ThumbsDown size={14} strokeWidth={1.8} />
              </button>
              <button className="rounded p-1.5 hover:bg-white/5 hover:text-white" title="Comment">
                <MessageSquare size={14} strokeWidth={1.8} />
              </button>
              <button className="rounded p-1.5 hover:bg-white/5 hover:text-white" title="Share">
                <Share2 size={14} strokeWidth={1.8} />
              </button>
              <button className="rounded p-1.5 hover:bg-white/5 hover:text-white" title="Enhance prompt">
                <Wand2 size={14} strokeWidth={1.8} />
              </button>
              <button className="rounded p-1.5 hover:bg-white/5 hover:text-white" title="More">
                <MoreHorizontal size={14} strokeWidth={1.8} />
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!chatDraft.trim()}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7c6cf6] text-white transition-opacity disabled:opacity-30"
              title="Send"
            >
              <SendHorizontal size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-[#8a8a96]/60">
          Enter to send · Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex h-6 items-center justify-between border-t border-white/5 bg-[#0a0a0d] px-3 text-[11px] text-[#8a8a96]">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <GitBranch size={12} strokeWidth={1.8} />
          main
        </span>
        <span>UTF-8</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <Wifi size={12} strokeWidth={1.8} />
          Connected
        </span>
        <span>Ln 1, Col 1</span>
      </div>
    </div>
  );
}

function IdeLayout({ tree, isLoading, isError, projectName, projectId, onRefresh }: { tree: ProjectTreeNode[]; isLoading: boolean; isError: boolean; projectName?: string; projectId: string; onRefresh: () => void }) {
  const { explorerVisible, assistantVisible } = useAppSelector((s) => ({
    explorerVisible: s.ide.explorerVisible,
    assistantVisible: s.ide.assistantVisible,
  }));
  return (
    <div className="flex h-screen w-screen flex-col bg-[#0a0a0d] font-sans text-white">
      <TopBar projectName={projectName} />
      <div className="flex flex-1 overflow-hidden">
        <IconRail />
        {explorerVisible && <Explorer tree={tree} isLoading={isLoading} isError={isError} projectName={projectName} projectId={projectId} onRefresh={onRefresh} />}
        <EditorArea />
        {assistantVisible && <ChatPanel />}
      </div>
      <StatusBar />
    </div>
  );
}

/* ============================================================================
 * DEFAULT EXPORT — wraps the layout with its own Redux Provider.
 * Drop this component anywhere in your existing app.
 * ==========================================================================*/
export default function Projectp() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useGettreeQuery(id ?? "", { skip: !id });

  return <IdeLayout tree={data?.tree ?? []} isLoading={isLoading} isError={isError || !id} projectName={data?.project.name} projectId={id ?? ""} onRefresh={refetch} />;
}