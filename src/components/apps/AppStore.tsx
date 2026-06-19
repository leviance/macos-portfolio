import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { portfolioProfile, repoUrl, spotlightProjects, vscodeUrl } from "~/configs/portfolio";

const categories = ["All", "Systems", "Identity", "Media", "Public repos"];

export default function AppStore() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const projects = useMemo(() => {
    const text = search.trim().toLowerCase();
    return spotlightProjects.filter((project) => {
      const categoryMatch =
        category === "All" ||
        project.kind.toLowerCase().includes(category.toLowerCase()) ||
        project.folder.toLowerCase().includes(category.toLowerCase()) ||
        project.summary.toLowerCase().includes(category.toLowerCase()) ||
        project.tech.some((tech) => tech.toLowerCase().includes(category.toLowerCase())) ||
        (category === "Public repos" && project.repo);

      const searchMatch =
        !text ||
        [project.title, project.summary, project.kind, project.folder, project.repo, ...project.tech]
          .join(" ")
          .toLowerCase()
          .includes(text);

      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  const openProject = (repo: string) => {
    if (!repo) return;
    window.open(repoUrl(repo), "_blank", "noopener,noreferrer");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        background: "var(--c-bg)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          borderRight: "var(--lg-border)",
          background: "var(--lg-bg-tinted)",
          backdropFilter: "var(--lg-blur-light)",
          padding: "18px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ padding: "0 6px 12px" }}>
          <div style={{ color: "var(--c-text)", fontSize: 18, fontWeight: 800 }}>Project Store</div>
          <div style={{ color: "var(--c-text-secondary)", fontSize: 12, marginTop: 4 }}>
            Curated work by {portfolioProfile.name}
          </div>
        </div>
        {categories.map((item) => {
          const active = item === category;
          return (
            <button
              key={item}
              onClick={() => setCategory(item)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "none",
                borderRadius: 7,
                padding: "8px 10px",
                background: active ? "var(--c-bg-tertiary)" : "transparent",
                color: active ? "var(--c-text)" : "var(--c-text-secondary)",
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <span className="i-ph:squares-four" style={{ width: 16, height: 16, color: active ? "#007AFF" : "inherit" }} />
              {item}
            </button>
          );
        })}
      </aside>

      <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        <div style={{ padding: "34px 42px 24px", maxWidth: 1060, margin: "0 auto" }}>
          <header
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              borderBottom: "var(--lg-border)",
              paddingBottom: 18,
              marginBottom: 26,
            }}
          >
            <div>
              <h1 style={{ margin: 0, color: "var(--c-text)", fontSize: 34, lineHeight: 1.1, letterSpacing: "-0.3px" }}>
                Spotlight projects
              </h1>
              <p style={{ margin: "8px 0 0", color: "var(--c-text-secondary)", fontSize: 14, maxWidth: 560, lineHeight: 1.5 }}>
                Backend systems, WebAssembly media tooling, identity infrastructure, and public experiments.
              </p>
            </div>
            <div
              style={{
                width: 240,
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "var(--c-bg-tertiary)",
                borderRadius: 8,
                padding: "7px 9px",
              }}
            >
              <span className="i-ph:magnifying-glass" style={{ width: 14, height: 14, color: "var(--c-text-tertiary)" }} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "var(--c-text)",
                  fontSize: 13,
                }}
              />
            </div>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035, duration: 0.25 }}
                style={{
                  border: "var(--lg-border)",
                  borderRadius: 14,
                  background: "var(--c-bg-secondary)",
                  padding: 16,
                  minHeight: 224,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                  <span
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, rgba(0,122,255,0.22), rgba(52,199,89,0.16))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#007AFF",
                    }}
                  >
                    <span className="i-ph:code" style={{ width: 24, height: 24 }} />
                  </span>
                  <span style={{ color: "var(--c-text-tertiary)", fontSize: 12, fontWeight: 700 }}>
                    {project.kind}
                  </span>
                </div>
                <h2 style={{ margin: 0, color: "var(--c-text)", fontSize: 17, lineHeight: 1.25 }}>
                  {project.title}
                </h2>
                <p style={{ margin: "8px 0 14px", color: "var(--c-text-secondary)", fontSize: 13, lineHeight: 1.5 }}>
                  {project.summary}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
                  {project.tech.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      style={{
                        borderRadius: 999,
                        background: "var(--c-bg-tertiary)",
                        color: "var(--c-text-secondary)",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 8px",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  {project.repo ? (
                    <>
                      <button
                        onClick={() => openProject(project.repo)}
                        style={actionButtonStyle(true)}
                      >
                        GitHub
                      </button>
                      <button
                        onClick={() => window.open(vscodeUrl(project.repo), "_blank", "noopener,noreferrer")}
                        style={actionButtonStyle(false)}
                      >
                        VS Code Web
                      </button>
                    </>
                  ) : (
                    <button style={actionButtonStyle(false)} disabled>
                      Case study only
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function actionButtonStyle(primary: boolean): CSSProperties {
  return {
    border: primary ? "none" : "var(--lg-border)",
    borderRadius: 8,
    background: primary ? "#007AFF" : "var(--c-bg)",
    color: primary ? "white" : "var(--c-text)",
    padding: "7px 10px",
    fontSize: 12,
    fontWeight: 800,
    cursor: primary ? "pointer" : "pointer",
  };
}
