import { useMemo, useState } from "react";
import { portfolioProfile } from "~/configs/portfolio";

interface MailMessage {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread?: boolean;
  accent: string;
}

const messages: MailMessage[] = [
  {
    id: "hello",
    from: "Dung Dương",
    fromEmail: portfolioProfile.email,
    subject: "Thanks for visiting my desktop",
    preview: "This inbox is a quick map for recruiters and technical reviewers.",
    body:
      "Hi,\n\nThanks for taking time to explore this portfolio. The main route is Finder for projects, Terminal for a command-driven profile, Resume for long-form context, and VS Code for source previews.\n\nI care about backend systems, WebAssembly, multimedia pipelines, cryptography, distributed systems, blockchain, and Self-Sovereign Identity.",
    time: "Now",
    unread: true,
    accent: "#007AFF",
  },
  {
    id: "contact",
    from: "Contact",
    fromEmail: portfolioProfile.email,
    subject: "Best ways to reach me",
    preview: `${portfolioProfile.email} | GitHub @leviance | LinkedIn`,
    body: `Email: ${portfolioProfile.email}\nGitHub: ${portfolioProfile.github}\nLinkedIn: ${portfolioProfile.linkedin}\n\nI am open to backend, systems, identity, media infrastructure, and research-heavy engineering conversations.`,
    time: "Pinned",
    unread: true,
    accent: "#34C759",
  },
  {
    id: "milan",
    from: "Project Note",
    fromEmail: "milan-player.local",
    subject: "Milan Player case study",
    preview: "FFmpeg, WebAssembly, Canvas, streaming, and DRM/key-management research.",
    body:
      "Milan Player is the deepest case-study window in this portfolio. It focuses on a browser media stack shaped around FFmpeg, WebAssembly, Canvas rendering, streaming constraints, and DRM/key-management thinking.\n\nOpen Finder to inspect the project notes and related source links.",
    time: "Case study",
    accent: "#FF9500",
  },
  {
    id: "identity",
    from: "Research Thread",
    fromEmail: "ssi.local",
    subject: "Self-Sovereign Identity direction",
    preview: "Translation, terminology, wallet concepts, and trust infrastructure.",
    body:
      "The identity track connects the Vietnamese SSI translation project with Identra and CertNet.\n\nThe goal is to make identity systems understandable, usable, and technically grounded: wallets, credentials, trust registries, and infrastructure that people can reason about.",
    time: "Research",
    accent: "#5856D6",
  },
];

const folders = ["Inbox", "Pinned", "Projects", "Research"];

export default function Mail() {
  const [selected, setSelected] = useState(messages[0].id);
  const [activeFolder, setActiveFolder] = useState("Inbox");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return messages;
    return messages.filter((message) =>
      [message.from, message.subject, message.preview, message.body]
        .join(" ")
        .toLowerCase()
        .includes(text)
    );
  }, [search]);

  const activeMessage = messages.find((message) => message.id === selected) ?? filtered[0];

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
          width: 168,
          flexShrink: 0,
          background: "var(--lg-bg-tinted)",
          borderRight: "var(--lg-border)",
          padding: "12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ padding: "0 8px 8px", color: "var(--c-text-tertiary)", fontSize: 12, fontWeight: 700 }}>
          Mailboxes
        </div>
        {folders.map((folder) => (
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            style={{
              border: "none",
              borderRadius: 7,
              padding: "7px 10px",
              background: activeFolder === folder ? "rgba(0,122,255,0.13)" : "transparent",
              color: activeFolder === folder ? "#007AFF" : "var(--c-text)",
              fontSize: 13,
              fontWeight: activeFolder === folder ? 700 : 500,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {folder}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <a
          href={`mailto:${portfolioProfile.email}`}
          style={{
            margin: 8,
            borderRadius: 8,
            padding: "8px 10px",
            background: "#007AFF",
            color: "white",
            textAlign: "center",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Compose
        </a>
      </aside>

      <section
        style={{
          width: 292,
          flexShrink: 0,
          background: "var(--c-bg-secondary)",
          borderRight: "var(--lg-border)",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <div style={{ padding: 10, borderBottom: "var(--lg-border)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--c-bg-tertiary)",
              borderRadius: 7,
              padding: "6px 8px",
            }}
          >
            <span className="i-ph:magnifying-glass" style={{ width: 13, height: 13, color: "var(--c-text-tertiary)" }} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "var(--c-text)",
                fontSize: 13,
              }}
            />
          </div>
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {filtered.map((message) => {
            const active = activeMessage?.id === message.id;
            return (
              <button
                key={message.id}
                onClick={() => setSelected(message.id)}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "var(--lg-border)",
                  background: active ? "rgba(0,122,255,0.1)" : "transparent",
                  padding: "12px 14px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns: "38px minmax(0,1fr)",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: `${message.accent}22`,
                    color: message.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                  }}
                >
                  {message.from[0]}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span
                      style={{
                        color: "var(--c-text)",
                        fontSize: 13,
                        fontWeight: message.unread ? 800 : 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {message.from}
                    </span>
                    <span style={{ color: "var(--c-text-tertiary)", fontSize: 11, flexShrink: 0 }}>{message.time}</span>
                  </span>
                  <span
                    style={{
                      display: "block",
                      color: "var(--c-text)",
                      fontSize: 12,
                      fontWeight: message.unread ? 700 : 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginTop: 2,
                    }}
                  >
                    {message.subject}
                  </span>
                  <span
                    style={{
                      display: "block",
                      color: "var(--c-text-secondary)",
                      fontSize: 11,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginTop: 2,
                    }}
                  >
                    {message.preview}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <main style={{ flex: 1, background: "var(--c-bg)", padding: "28px 32px", overflowY: "auto", minWidth: 0 }}>
        {activeMessage && (
          <>
            <h1 style={{ margin: "0 0 14px", color: "var(--c-text)", fontSize: 24, lineHeight: 1.2 }}>
              {activeMessage.subject}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: `${activeMessage.accent}22`,
                  color: activeMessage.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                }}
              >
                {activeMessage.from[0]}
              </span>
              <span>
                <span style={{ display: "block", color: "var(--c-text)", fontSize: 14, fontWeight: 700 }}>
                  {activeMessage.from}
                </span>
                <span style={{ display: "block", color: "var(--c-text-secondary)", fontSize: 12 }}>
                  {activeMessage.fromEmail} | {activeMessage.time}
                </span>
              </span>
            </div>
            <p
              style={{
                whiteSpace: "pre-wrap",
                color: "var(--c-text)",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 720,
                margin: 0,
              }}
            >
              {activeMessage.body}
            </p>
          </>
        )}
      </main>
    </div>
  );
}
