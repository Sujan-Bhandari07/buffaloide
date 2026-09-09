import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  Star,
  Link2,
  Moon,
  ChevronDown,
  Plus,
  Zap,
  X,
  Trash2,
  LogOut,
} from "lucide-react";
import {
  useCreateprojectMutation,
  useDeleteprojectMutation,
  useGetallprojectQuery,
  useTogglestarMutation,
} from "../store/Projectapi";
import { useLogoutMutation, userApi } from "../store/Userapi";
import { useAppDispatch, useAppSelector } from "../utils/Hooks";
import { resetProjectWorkspace } from "../store/Projectslice";
import { setUser } from "../store/Userslice";
import { useNavigate } from "react-router-dom";

/* ---------- Project data & types ---------- */

interface Project {
  id: string;
  name: string;
  description?: string;
  isStarred: boolean;
}

type ProjectView = "all" | "starred";

/* ---------- Small sidebar pieces ---------- */

function Logo() {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate("/")} className="hidden items-center gap-3 px-1 sm:flex">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#238636] text-lg">🦬</span>
      <span className="text-lg font-semibold text-[#f0f6fc]">
        Buffalo<span className="text-[#58a6ff]">IDE</span>
      </span>
    </button>
  );
}

function FloatingBadge() {
  return (
    <span className="absolute -left-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-950 bg-sky-400 text-sm font-bold text-neutral-950 shadow-lg">
      S
    </span>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <button
      type="button"
      className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors sm:justify-start sm:px-3 ${
        active
          ? "bg-neutral-800 text-white"
          : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function CreditsCard() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-800">
            <Link2 className="h-3.5 w-3.5 text-neutral-300" />
          </span>
          <span className="text-sm text-neutral-300">AI Credits</span>
        </div>
        <span className="text-sm font-semibold text-white">100</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
        <div className="h-full w-full rounded-full bg-white" />
      </div>
      <p className="mt-2 text-xs text-neutral-500">100 credits remaining</p>
    </div>
  );
}

function UpgradeCard() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <h3 className="text-sm font-semibold text-white">Upgrade Plan</h3>
      <p className="mt-1 text-xs text-neutral-500">
        Upgrade to Pro for more credits.
      </p>
      <button
        type="button"
        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white py-2 text-sm font-semibold text-neutral-900 transition-opacity hover:opacity-90"
      >
        <Zap className="h-4 w-4 fill-neutral-900" />
        Upgrade Now
      </button>
    </div>
  );
}

/* ---------- Left panel (~30%) ---------- */

interface SidebarProps {
  view: ProjectView;
  onViewChange: (view: ProjectView) => void;
}

function Sidebar({ view, onViewChange }: SidebarProps) {
  return (
    <aside
      className="relative flex h-full w-16 shrink-0 flex-col justify-between
                 border-r border-neutral-800 bg-neutral-950 p-2
                 sm:w-56 sm:p-4 md:w-64 lg:w-72 xl:w-80"
    >
      <FloatingBadge />

      <div className="mt-3 sm:mt-0">
        <Logo />
        <p className="mb-3 mt-6 hidden px-1 text-xs font-medium tracking-wide text-neutral-500 sm:block">
          MAIN
        </p>
        <nav className="mt-10 flex flex-col gap-1 sm:mt-0">
          <div className="cursor-pointer" onClick={() => onViewChange("all")}>
            <NavItem icon={<Folder className="h-4 w-4" />} label="Projects" active={view === "all"} />
          </div>
          <div className="cursor-pointer" onClick={() => onViewChange("starred")}>
            <NavItem icon={<Star className="h-4 w-4" />} active={view === "starred"} label="Starred" />
          </div>
        </nav>
      </div>

      <div className="mt-8 hidden flex-col gap-3 sm:flex">
        <CreditsCard />
        <UpgradeCard />
      </div>
    </aside>
  );
}

/* ---------- Right panel pieces (~70%) ---------- */

function TopBar() {
 const dispatch = useAppDispatch();
 const navigate = useNavigate();
 const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
 const {name, email}=useAppSelector(state=>state.user)
 const initials = name
  ?.trim()
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0])
  .join("")
  .toUpperCase() || email.slice(0, 2).toUpperCase() || "U";

 const handleLogout = async () => {
   try {
     await logout().unwrap();

   } finally {
     dispatch(setUser({ name: "", email: "", avatar: "", isauth: false }));
     dispatch(userApi.util.resetApiState());
     navigate("/login");
   }
 };
  return (
    <div className="flex items-center justify-end gap-2 border-b border-neutral-800 px-4 py-4 sm:gap-4 sm:px-8">
      <button
        type="button"
        className="cursor-pointer rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-neutral-800"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-xs font-semibold text-white">
         {initials}
        </span>
        <span className="hidden text-sm font-medium text-neutral-200 sm:inline">
         {name}
        </span>
        <ChevronDown className="hidden h-4 w-4 text-neutral-500 sm:inline" />
      </button>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        title="Log out"
        className="cursor-pointer rounded-md p-2 text-neutral-400 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

interface HeaderProps {
  onCreateClick: () => void;
}

function Header({ onCreateClick }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-8 sm:flex-row sm:items-start sm:justify-between sm:px-8">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          Welcome back, Virtual <span className="inline-block">👋</span>
        </h1>
        <p className="mt-2 text-neutral-400">
          Ready to build something amazing today?
        </p>
      </div>
      <button
        type="button"
        onClick={onCreateClick}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-opacity hover:opacity-90 sm:mt-1"
      >
        <Plus className="h-4 w-4" />
        New Project
      </button>
    </div>
  );
}

interface EmptyStateProps {
  onCreateClick: () => void;
  title?: string;
  description?: string;
}

function EmptyState({
  onCreateClick,
  title = "No projects yet",
  description = "Create your first project and start building something amazing!",
}: EmptyStateProps) {
  return (
    <div className="flex h-full min-h-[22rem] flex-col items-center justify-center rounded-xl border border-neutral-800/60 bg-neutral-900/30 px-6 py-16 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
        <FolderOpen className="h-7 w-7 text-neutral-400" />
      </span>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        {description}
      </p>
      <button
        type="button"
        onClick={onCreateClick}
        className="mt-6 flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-opacity hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Create Project
      </button>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  onToggleStar: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

function ProjectCard({
  project,
  onToggleStar,
  onDeleteProject,
}: ProjectCardProps) {
  const navigate=useNavigate()
  return (
    <div className="cursor-pointer flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-neutral-700" onClick={()=>navigate(`project/${project.id}`)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="truncate text-base font-semibold text-white">
          {project.name}
        </h3>
        <button
          type="button"
          aria-label="Toggle starred"
          onClick={(event) => { event.stopPropagation(); onToggleStar(project); }}
          className="shrink-0 cursor-pointer rounded-md p-1 hover:bg-neutral-800"
        >
          <Star
            className={`h-4 w-4 ${
              project.isStarred
                ? "fill-amber-400 text-amber-400"
                : "text-neutral-500"
            }`}
          />
        </button>
      </div>

      <p className="mt-1 text-sm text-neutral-500">
        {project.description || "No description"}
      </p>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          aria-label="Delete project"
          onClick={(event) => { event.stopPropagation(); onDeleteProject(project); }}
          className="cursor-pointer rounded-md p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface ProjectGridProps {
  projects: Project[];
  onToggleStar: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

function ProjectGrid({
  projects,
  onToggleStar,
  onDeleteProject,
}: ProjectGridProps) {
  return (
    <div className="max-h-[min(32rem,calc(100dvh-15rem))] overflow-y-auto pr-1">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onToggleStar={onToggleStar}
            onDeleteProject={onDeleteProject}
          />
        ))}
      </div>
    </div>
  );
}

interface RecentProjectsProps {
  onCreateClick: () => void;
  view: ProjectView;
}

function RecentProjects({ onCreateClick, view }: RecentProjectsProps) {

  const { data } = useGetallprojectQuery();
  const dispatch = useAppDispatch();
  const [toggleStar] = useTogglestarMutation();
  const [deleteProject] = useDeleteprojectMutation();
  const allProjects: Project[] = (data?.payload ?? []).map((project) => ({
    id: project._id,
    name: project.name,
    description: project.description,
    isStarred: project.isstar,
  }));
  const projects = view === "starred"
    ? allProjects.filter((project) => project.isStarred)
    : allProjects;

  const handleToggleStar = async (project: Project) => {
    await toggleStar({ id: project.id, isstar: !project.isStarred }).unwrap();
  };

  const handleDeleteProject = async (project: Project) => {
    dispatch(resetProjectWorkspace());
    await deleteProject({ projectid: project.id }).unwrap();
  };

  return (
    <div className="flex flex-1 flex-col px-4 pb-8 pt-8 sm:px-8">
      <h2 className="mb-4 text-lg font-semibold text-white">
        {view === "starred" ? "Starred Projects" : "Recent Projects"}
      </h2>
      <div className="flex-1">
        {projects.length === 0 ? (
          <EmptyState
            onCreateClick={onCreateClick}
            title={view === "starred" ? "No starred projects yet" : undefined}
            description={
              view === "starred"
                ? "Star a project to find it here."
                : undefined
            }
          />
        ) : (
          <ProjectGrid
            projects={projects}
            onToggleStar={handleToggleStar}
            onDeleteProject={handleDeleteProject}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Create project modal ---------- */

interface CreateProjectModalProps {
  onClose: () => void;
}

function CreateProjectModal({ onClose }: CreateProjectModalProps) {



  const [details, setdetails] = useState({
    name:"",
    desc:""
  })
  const handlechange=(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{

  const{name,value}=e.target
  setdetails((prev)=>({...prev,[name]:value}))
  }
  const[createproject]=useCreateprojectMutation()
const handleproject=async()=>{

  if( !details.name)return
  const a=await createproject({
    name:details.name,
    description:details.desc
  }).unwrap()
  if(a.success){
    setdetails({
       name:"",
    desc:""
    })
    onClose()
    
    
  }
}

  console.log(details)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Create project</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Set up a new workspace in seconds
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-neutral-500 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wide text-neutral-400">
              PROJECT NAME
            </label>
            <input
              type="text"
              name="name"
              onChange={handlechange}
              value={details.name}
              placeholder="My Awesome Project"
              className="w-full rounded-lg border border-sky-500/60 bg-neutral-950 px-4 py-3 text-sm text-neutral-200 placeholder-neutral-500 outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wide text-neutral-400">
              DESCRIPTION
            </label>
            <textarea
              placeholder="What is this project about?"
              rows={4}
              onChange={handlechange}
              value={details.desc}
              name="desc"
              className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-200 placeholder-neutral-500 outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-neutral-800 px-5 py-2.5 text-sm font-semibold text-neutral-200 hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleproject}
            className="cursor-pointer rounded-lg bg-neutral-400 px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-300"
          >
            Create project
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [view, setView] = useState<ProjectView>("all");

  return (
    <div className="flex h-dvh w-full min-w-0 overflow-hidden bg-neutral-950">
      <Sidebar view={view} onViewChange={setView} />
      <main className="flex flex-1 flex-col overflow-y-auto">
        <TopBar />
        <Header onCreateClick={() => setIsModalOpen(true)} />
        <RecentProjects
          onCreateClick={() => setIsModalOpen(true)}
          view={view}
        />
      </main>

      {isModalOpen && (
        <CreateProjectModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
