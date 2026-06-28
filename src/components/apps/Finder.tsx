import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  archiveRepos,
  pinnedFinderRepos,
  portfolioProfile,
  repoUrl,
  spotlightProjects
} from "~/configs/portfolio";

type ViewMode = "icons" | "list";
type SidebarTarget = "spotlight" | "public" | "archive";
type FinderProject = {
  id: string;
  title: string;
  kind: string;
  folder: string;
  repo: string;
  url: string;
  summary: string;
  tech: string[];
};

const sidebar = [
  { id: "spotlight", label: "Pinned Repos", icon: "/img/icons/sf-icons/applications.svg" },
  { id: "public", label: "Public Repos", icon: "/img/icons/sf-icons/desktop.svg" },
  { id: "archive", label: "Archive", icon: "/img/icons/sf-icons/folder.svg" }
] as const;

const folderIcon = "/img/icons/folder-generic.png";
const repositoryProjects: FinderProject[] = spotlightProjects
  .filter((project) => Boolean(project.repo))
  .map((project) => ({
    ...project,
    repo: project.repo,
    url: project.url || repoUrl(project.repo)
  }));
const pinnedProjects = pinnedFinderRepos
  .map((target) => repositoryProjects.find((project) => project.id === target || project.repo === target))
  .filter((project): project is FinderProject => Boolean(project));
const pinnedProjectIds = new Set(pinnedProjects.map((project) => project.id));
const unpinnedProjects = repositoryProjects.filter((project) => !pinnedProjectIds.has(project.id));

export default function Finder() {
  const [target, setTarget] = useState<SidebarTarget>("spotlight");
  const [viewMode, setViewMode] = useState<ViewMode>("icons");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(pinnedProjects[0]?.id || repositoryProjects[0]?.id || archiveRepos[0] || "");

  const items = useMemo(() => {
    const archiveItems: FinderProject[] = archiveRepos.map((repo) => ({
      id: repo,
      title: repo,
      kind: "Public Repo",
      folder: "Archive",
      repo,
      url: repoUrl(repo),
      summary: "Public GitHub repository kept available for source exploration.",
      tech: ["GitHub"]
    }));

    const base =
      target === "archive"
        ? archiveItems
        : target === "public"
          ? [...pinnedProjects, ...unpinnedProjects, ...archiveItems]
        : pinnedProjects;

    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter((project) =>
      [project.title, project.kind, project.folder, project.summary, project.tech.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [target, search]);

  const active = items.find((item) => item.id === selected) || items[0] || pinnedProjects[0] || repositoryProjects[0];

  const openProject = (project: FinderProject) => {
    window.dispatchEvent(new CustomEvent("finder:openVSCode", { detail: { repo: project.repo } }));
  };

  return (
    <div className="h-full flex bg-[#f5f5f7] text-[#1c1c1e] overflow-hidden rounded-b-[14px]">
      <aside className="w-[184px] shrink-0 border-r border-black/10 bg-white/45 backdrop-blur-xl py-3">
        <div className="px-4 pb-2 text-[11px] font-700 uppercase tracking-[0.4px] text-black/35">
          DungOS
        </div>
        {sidebar.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTarget(item.id);
              const first =
                item.id === "archive"
                  ? archiveRepos[0]
                  : item.id === "public"
                    ? pinnedProjects[0]?.id || unpinnedProjects[0]?.id || archiveRepos[0]
                    : pinnedProjects[0]?.id;
              if (first) setSelected(first);
            }}
            className={`mx-2 mb-1 flex h-8 w-[calc(100%-16px)] items-center gap-2 rounded-[8px] px-3 text-left text-[13px] ${
              target === item.id ? "bg-[#007AFF]/13 text-[#007AFF] font-600" : "text-black/70 hover:bg-black/6"
            }`}
          >
            <span
              className="h-[15px] w-[15px] shrink-0"
              style={{
                backgroundColor: target === item.id ? "#007AFF" : "rgba(0,0,0,.55)",
                WebkitMask: `url(${item.icon}) center/contain no-repeat`,
                mask: `url(${item.icon}) center/contain no-repeat`
              }}
            />
            {item.label}
          </button>
        ))}

        <div className="mt-4 px-4 pb-2 text-[11px] font-700 uppercase tracking-[0.4px] text-black/35">
          Profile
        </div>
        <div className="mx-3 rounded-[12px] bg-white/50 p-3 text-[12px] leading-5 text-black/65 shadow-sm">
          <div className="font-700 text-black">{portfolioProfile.name}</div>
          <div>{portfolioProfile.role}</div>
          <a className="text-[#007AFF]" href={portfolioProfile.github} target="_blank" rel="noreferrer">
            github.com/leviance
          </a>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[46px] shrink-0 items-center gap-2 border-b border-black/10 bg-white/70 px-4 backdrop-blur-xl">
          <button className="rounded-[7px] px-2 py-1 text-[14px] text-black/45" type="button">
            ‹
          </button>
          <button className="rounded-[7px] px-2 py-1 text-[14px] text-black/25" type="button">
            ›
          </button>
          <div className="flex-1 text-center text-[13px] font-700">
            {target === "spotlight" ? "Pinned GitHub Repositories" : sidebar.find((item) => item.id === target)?.label}
          </div>
          <div className="flex rounded-[8px] bg-black/6 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("icons")}
              className={`rounded-[7px] px-2 py-1 text-[12px] ${viewMode === "icons" ? "bg-white shadow-sm" : ""}`}
            >
              Icons
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-[7px] px-2 py-1 text-[12px] ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
            >
              List
            </button>
          </div>
          <input
            className="h-7 w-[150px] rounded-[8px] border-0 bg-black/6 px-3 text-[12px] outline-none"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex min-h-0 flex-1">
          <section className="min-w-0 flex-1 overflow-auto">
            {viewMode === "icons" ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] gap-3 p-5">
                {items.map((project, index) => (
                  <motion.button
                    key={project.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.025, duration: 0.2 }}
                    onClick={() => setSelected(project.id)}
                    onDoubleClick={() => openProject(project)}
                    className={`flex min-h-[118px] flex-col items-center justify-center rounded-[12px] border p-2 text-center ${
                      selected === project.id
                        ? "border-[#007AFF]/45 bg-[#007AFF]/12"
                        : "border-transparent hover:bg-black/6"
                    }`}
                  >
                    <img
                      src={folderIcon}
                      alt=""
                      className="h-[54px] w-[54px] object-contain drop-shadow"
                    />
                    <span className="mt-2 max-w-[96px] truncate text-[12px] font-600">{project.title}</span>
                    <span className="max-w-[96px] truncate text-[10px] text-black/45">{project.folder}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-3">
                <div className="grid grid-cols-[1fr_120px_120px] border-b border-black/10 px-3 py-2 text-[11px] font-700 text-black/45">
                  <span>Name</span>
                  <span>Kind</span>
                  <span>Group</span>
                </div>
                {items.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelected(project.id)}
                    onDoubleClick={() => openProject(project)}
                    className={`grid w-full grid-cols-[1fr_120px_120px] items-center rounded-[8px] px-3 py-2 text-left text-[12px] ${
                      selected === project.id ? "bg-[#007AFF]/12 text-[#007AFF]" : "hover:bg-black/5"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <img src={folderIcon} alt="" className="h-5 w-5 object-contain" />
                      {project.title}
                    </span>
                    <span>{project.kind}</span>
                    <span>{project.folder}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="hidden w-[270px] shrink-0 border-l border-black/10 bg-white/55 p-4 backdrop-blur-xl lg:block">
            <img
              src={folderIcon}
              alt=""
              className="mx-auto h-[76px] w-[76px] object-contain drop-shadow"
            />
            <h2 className="mt-3 text-center text-[18px] font-800">{active.title}</h2>
            <div className="mt-1 text-center text-[12px] text-black/45">{active.kind}</div>
            <p className="mt-4 text-[12px] leading-5 text-black/65">{active.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {active.tech.map((tag) => (
                <span key={tag} className="rounded-full bg-black/6 px-2 py-1 text-[10px] text-black/60">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 grid gap-2">
              <a className="rounded-[9px] bg-[#007AFF] px-3 py-2 text-center text-[12px] font-700 text-white" href={repoUrl(active.repo)} target="_blank" rel="noreferrer">
                Open GitHub
              </a>
              <button
                type="button"
                onClick={() => openProject(active)}
                className="rounded-[9px] bg-black/7 px-3 py-2 text-center text-[12px] font-700 text-black/70 hover:bg-black/10"
              >
                Open VS Code
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
