import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowSize } from "~/hooks/useWindowSize";

interface Note {
  id: string;
  title: string;
  body: string;
  date: string;
  dateISO?: string;
  pinned?: boolean;
  color?: string;
  section?: "notes" | "shared";
  tags?: string[];
}

const INITIAL_NOTES: Note[] = [
  {
    id: "1",
    title: "Technical Direction",
    body: "Backend & Systems Engineer building at the intersection of WebAssembly, multimedia processing, cryptography, blockchain, distributed systems, and Self-Sovereign Identity.\n\nI prefer understanding systems from first principles before turning them into usable product behavior.",
    date: "Profile",
    dateISO: "2026-06-17",
    pinned: true,
    color: "#FFCC00",
    section: "notes",
    tags: ["systems"],
  },
  {
    id: "2",
    title: "Milan Player",
    body: "Case-study work around browser video systems: FFmpeg, WebAssembly, Canvas rendering, FLV/HLS playback, A/V sync, stream control, DRM/EME, license-server thinking, and key management.",
    date: "Case study",
    dateISO: "2026-06-17",
    section: "notes",
    tags: ["multimedia", "systems"],
  },
  {
    id: "3",
    title: "Self-Sovereign Identity",
    body: "Vietnamese translation and terminology work for SSI: DID, Verifiable Credentials, OpenID4VC, SD-JWT, mDL, trust frameworks, revocation status, selective disclosure, and public verifiability.",
    date: "Research",
    dateISO: "2026-06-17",
    section: "notes",
    tags: ["identity"],
  },
  {
    id: "4",
    title: "Identra",
    body: "Open-source identity wallet concept for storing, managing, and selectively sharing verifiable credentials. The product idea is privacy-first, user-owned, and designed around understandable trust.",
    date: "Product",
    dateISO: "2026-06-17",
    section: "notes",
    tags: ["identity", "product"],
  },
  {
    id: "5",
    title: "CertNet",
    body: "Hybrid blockchain concept for trust infrastructure in Vietnam: permissioned validators, public-read access, observer nodes, DID registry, audit logs, governance, and off-chain personal data protection.",
    date: "Architecture",
    dateISO: "2026-06-17",
    pinned: false,
    color: "#007AFF",
    section: "notes",
    tags: ["blockchain", "identity"],
  },
  {
    id: "6",
    title: "Awncorp Ecosystem",
    body: "Product map: Identra, CertNet, SCH (Smart Contract Hosting), Pinet, and AI Trust Agent. The shared thread is digital trust, secure communication, verifiable credentials, and infrastructure people can reason about.",
    date: "Ecosystem",
    dateISO: "2026-06-17",
    color: "#34C759",
    section: "shared",
    tags: ["product", "identity"],
  },
  {
    id: "7",
    title: "Learning & Hobbies",
    body: "- Senior Go Backend and systems engineering\n- OSSU-style computer science fundamentals\n- English and Chinese (HSK4 direction)\n- Piano, nunchaku, chess, logic puzzles\n- Math, physics, running, gym, trekking\n- Books: psychology, history, science fiction, philosophy, economics, detective, science, self-improvement, and technology",
    date: "Personal",
    dateISO: "2026-06-17",
    section: "notes",
    tags: ["personal"],
  },
];

const DATE_BUCKET_ORDER = ["Previous 7 Days", "2026", "2025", "2024", "2023", "2022", "2021", "Older"];

function dateBucket(note: Note): string {
  const iso = note.dateISO;
  if (!iso) {
    const d = note.date.toLowerCase();
    if (d === "today" || d === "now" || d === "thursday" || d === "friday" || d === "saturday" || d === "sunday" || d === "monday" || d === "tuesday" || d === "wednesday" || d === "yesterday")
      return "Previous 7 Days";
    return "Older";
  }
  const year = iso.slice(0, 4);
  const noteDate = new Date(iso);
  const now = new Date();
  const diffDays = (now.getTime() - noteDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays <= 7) return "Previous 7 Days";
  return year;
}

function groupNotes(notes: Note[]): { bucket: string; notes: Note[] }[] {
  const map: Record<string, Note[]> = {};
  for (const n of notes) {
    const b = dateBucket(n);
    if (!map[b]) map[b] = [];
    map[b].push(n);
  }
  return DATE_BUCKET_ORDER.filter((b) => map[b]?.length).map((b) => ({ bucket: b, notes: map[b] }));
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selected, setSelected] = useState<string>(INITIAL_NOTES[0].id);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<"notes" | "shared">("notes");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;
  const [mobileView, setMobileView] = useState<"sidebar" | "list" | "editor">("list");

  const tags = useMemo(
    () => Array.from(new Set(notes.flatMap((note) => note.tags ?? []))).sort(),
    [notes]
  );

  const sectionNotes = useMemo(
    () => notes.filter((note) => (note.section ?? "notes") === activeSection),
    [activeSection, notes]
  );

  const taggedNotes = useMemo(
    () => activeTag ? sectionNotes.filter((note) => note.tags?.includes(activeTag)) : sectionNotes,
    [activeTag, sectionNotes]
  );

  const filtered = useMemo(() => {
    const base = taggedNotes;
    return search.trim()
      ? base.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.body.toLowerCase().includes(search.toLowerCase())
      )
      : base;
  }, [search, taggedNotes]);

  useEffect(() => {
    if (filtered.length && !filtered.some((note) => note.id === selected)) {
      setSelected(filtered[0].id);
      return;
    }
    if (!filtered.length && selected) setSelected("");
  }, [filtered, selected]);

  const activeNote = notes.find((n) => n.id === selected);

  const pinned = filtered.filter((n) => n.pinned);
  const regular = filtered.filter((n) => !n.pinned);
  const groups = groupNotes(regular);

  const updateNote = (field: "title" | "body", val: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selected ? { ...n, [field]: val } : n))
    );
  };

  const newNote = () => {
    const id = Date.now().toString();
    const note: Note = {
      id,
      title: "New Note",
      body: "",
      date: "Now",
      dateISO: new Date().toISOString().slice(0, 10),
      section: activeSection,
      tags: activeTag ? [activeTag] : [],
    };
    setNotes((prev) => [note, ...prev]);
    setSelected(id);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selected === id) {
      setSelected(notes.find((n) => n.id !== id)?.id ?? "");
      if (isMobile) setMobileView("list");
    }
  };

  const selectSection = (section: "notes" | "shared") => {
    setActiveSection(section);
    setActiveTag(null);
    const first = notes.find((note) => (note.section ?? "notes") === section);
    setSelected(first?.id ?? "");
    if (isMobile) setMobileView("list");
  };

  const selectTag = (tag: string | null) => {
    setActiveTag(tag);
    const base = notes.filter((note) => (note.section ?? "notes") === activeSection);
    const first = tag ? base.find((note) => note.tags?.includes(tag)) : base[0];
    setSelected(first?.id ?? "");
    if (isMobile) setMobileView("list");
  };

  const selectNote = (note: Note) => {
    setSelected(note.id);
    if (isMobile) setMobileView("editor");
  };

  const NoteRow = ({ note }: { note: Note }) => (
    <button
      type="button"
      data-note-id={note.id}
      onPointerDown={(event) => {
        event.stopPropagation();
        selectNote(note);
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
        selectNote(note);
      }}
      onClick={(event) => {
        event.stopPropagation();
        selectNote(note);
      }}
      style={{
        padding: "9px 14px",
        borderRadius: "8px",
        margin: "1px 6px",
        cursor: "default",
        background: selected === note.id ? "rgba(255,204,0,0.22)" : "transparent",
        border: "none",
        transition: "background 0.15s ease",
        display: "flex",
        gap: "8px",
        alignItems: "flex-start",
        textAlign: "left",
        width: "calc(100% - 12px)",
      }}
      onMouseEnter={(e) => {
        if (selected !== note.id)
          (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.04)";
      }}
      onMouseLeave={(e) => {
        if (selected !== note.id)
          (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {note.color && (
        <div style={{ width: 3, borderRadius: 2, background: note.color, alignSelf: "stretch", flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#1c1c1e",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {note.title || "Untitled"}
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "1px" }}>
          <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)", flexShrink: 0 }}>{note.date}</span>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(0,0,0,0.35)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {note.body.slice(0, 28) || "No additional text"}
          </span>
        </div>
      </div>
    </button>
  );

  const GroupHeader = ({ label }: { label: string }) => (
    <div
      style={{
        fontSize: "12px",
        fontWeight: 700,
        color: "rgba(0,0,0,0.4)",
        padding: "8px 14px 3px",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </div>
  );

  const toolbarIcons = [
    { icon: "i-ph:note-pencil", title: "New Note", action: newNote },
    { icon: "i-ph:text-aa", title: "Format" },
    { icon: "i-ph:table", title: "Table" },
    { icon: "i-ph:check-square", title: "Checklist" },
    { icon: "i-ph:paperclip", title: "Attachment" },
    { icon: "i-ph:tag", title: "Tags" },
    { icon: "i-ph:share-network", title: "Share" },
    { icon: "i-ph:dots-three", title: "More" },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        
        background: "rgba(250,250,248,0.99)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      {/* ── Left sidebar (iCloud/sections) ── */}
      {(!isMobile || mobileView === "sidebar") && (
      <div
        style={{
          width: isMobile ? "100%" : "180px",
          flexShrink: 0,
          borderRight: "0.5px solid rgba(0,0,0,0.1)",
          background: "rgba(244,242,236,0.99)",
          display: "flex",
          flexDirection: "column",
          paddingTop: "8px",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "6px 12px 8px",
            borderBottom: "0.5px solid rgba(0,0,0,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1c1c1e" }}>Notes</span>
          <button
            onClick={newNote}
            title="New Note"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              borderRadius: "5px",
              color: "#886800",
            }}
          >
            <span className="i-ph:note-pencil" style={{ width: "16px", height: "16px" }} />
          </button>
        </div>

        {/* iCloud section */}
        <div style={{ padding: "10px 0 4px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(0,0,0,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", padding: "0 12px 4px" }}>
            iCloud
          </div>
          <button
            onClick={() => selectSection("notes")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px 12px",
              width: "calc(100% - 8px)",
              background: activeSection === "notes" ? "rgba(0,122,255,0.12)" : "transparent",
              border: "none",
              borderRadius: "6px",
              margin: "0 4px",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <img src="/img/icons/sf-icons/folder.svg" alt="Folder" style={{ width: "13px", height: "13px", opacity: 0.8 }} className="dark:invert" />
              <span style={{ fontSize: "12px", fontWeight: activeSection === "notes" ? 600 : 400, color: activeSection === "notes" ? "#007AFF" : "#1c1c1e" }}>
                Notes
              </span>
            </div>
            <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.35)", background: "rgba(0,0,0,0.07)", borderRadius: "8px", padding: "1px 6px" }}>
              {notes.filter((note) => (note.section ?? "notes") === "notes").length}
            </span>
          </button>
          <button
            onClick={() => selectSection("shared")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px 12px",
              width: "calc(100% - 8px)",
              margin: "0 4px",
              background: activeSection === "shared" ? "rgba(0,122,255,0.12)" : "transparent",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <img src="/img/icons/sf-icons/folder-user.svg" alt="Shared Folder" style={{ width: "13px", height: "13px", opacity: 0.6 }} className="dark:invert" />
              <span style={{ fontSize: "12px", color: activeSection === "shared" ? "#007AFF" : "#1c1c1e", fontWeight: activeSection === "shared" ? 600 : 400 }}>Shared</span>
            </div>
            <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.35)", background: "rgba(0,0,0,0.07)", borderRadius: "8px", padding: "1px 6px" }}>
              {notes.filter((note) => note.section === "shared").length}
            </span>
          </button>
        </div>

        {/* Tags */}
        <div style={{ padding: "8px 12px 4px", borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(0,0,0,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
            Tags
          </div>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {["All Tags", ...tags.map((tag) => `#${tag}`)].map((tag) => {
              const tagValue = tag === "All Tags" ? null : tag.slice(1);
              const active = activeTag === tagValue;
              return (
              <button
                key={tag}
                type="button"
                onClick={() => selectTag(tagValue)}
                style={{
                  background: active ? "rgba(255,204,0,0.35)" : "rgba(0,0,0,0.07)",
                  border: "none",
                  borderRadius: "12px",
                  padding: "3px 9px",
                  fontSize: "11px",
                  color: "#1c1c1e",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {tag}
              </button>
            )})}
          </div>
        </div>
      </div>
      )}

      {/* ── Note list ── */}
      {(!isMobile || mobileView === "list") && (
      <div
        style={{
          width: isMobile ? "100%" : "220px",
          flexShrink: 0,
          borderRight: "0.5px solid rgba(0,0,0,0.1)",
          background: "rgba(248,246,240,0.99)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search + new */}
        <div
          style={{
            padding: "8px 10px",
            borderBottom: "0.5px solid rgba(0,0,0,0.08)",
            display: "flex",
            gap: "6px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "rgba(0,0,0,0.07)",
              borderRadius: "7px",
              padding: "4px 8px",
            }}
          >
            <img src="/img/icons/sf-icons/search.svg" alt="Search" style={{ width: "11px", height: "11px", opacity: 0.5 }} className="dark:invert" />
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", fontSize: "12px", width: "100%", color: "#1c1c1e" }}
            />
          </div>
          <button
            onClick={newNote}
            title="New Note"
            style={{
              background: "rgba(255,204,0,0.3)",
              border: "none",
              borderRadius: "7px",
              width: "28px",
              height: "28px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "18px", lineHeight: 1, color: "#886800" }}>+</span>
          </button>
        </div>

        {/* Grouped note list */}
        <div style={{ flex: 1, overflowY: "auto", paddingTop: "4px" }}>
          {pinned.length > 0 && (
            <>
              <GroupHeader label="Pinned" />
              {pinned.map((n) => <NoteRow key={n.id} note={n} />)}
            </>
          )}
          {groups.map(({ bucket, notes: gNotes }) => (
            <div key={bucket}>
              <GroupHeader label={bucket} />
              {gNotes.map((n) => <NoteRow key={n.id} note={n} />)}
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ── Editor ── */}
      {(!isMobile || mobileView === "editor") && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", width: isMobile ? "100%" : "auto" }}>
      {activeNote ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Editor toolbar */}
          {isMobile && (
            <button onClick={() => setMobileView("list")} style={{ padding: "8px 12px", background: "none", border: "none", color: "#007AFF", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
              ‹ Back
            </button>
          )}
          <div
            style={{
              padding: "6px 12px",
              borderBottom: "0.5px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              gap: "2px",
              background: "rgba(250,250,248,0.99)",
            }}
          >
            {toolbarIcons.map((t) => (
              <button
                key={t.title}
                title={t.title}
                onClick={t.action}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 6px",
                  borderRadius: "6px",
                  opacity: 0.55,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 0.12s, background 0.12s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                  (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.55";
                  (e.currentTarget as HTMLElement).style.background = "none";
                }}
              >
                <span className={t.icon} style={{ width: "16px", height: "16px" }} />
              </button>
            ))}
            <div style={{ flex: 1 }} />
            {/* Search in note */}
            <button
              title="Search"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: "6px", opacity: 0.55 }}
            >
              <img src="/img/icons/sf-icons/search.svg" alt="Search" style={{ width: "16px", height: "16px", opacity: 0.7 }} className="dark:invert" />
            </button>
            {/* Delete */}
            <button
              onClick={() => deleteNote(activeNote.id)}
              title="Delete"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: "6px", opacity: 0.4 }}
            >
              <img src="/img/icons/sf-icons/trash.svg" alt="Trash" style={{ width: "14px", height: "14px", opacity: 0.7 }} className="dark:invert" />
            </button>
          </div>

          {/* Date */}
          <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)", padding: "10px 20px 0", textAlign: "center" }}>
            {activeNote.dateISO ?? activeNote.date}
          </div>

          {/* Title */}
          <input
            key={`title-${activeNote.id}`}
            value={activeNote.title}
            onChange={(e) => updateNote("title", e.target.value)}
            className="font-display"
            style={{
              border: "none",
              outline: "none",
              fontSize: "20px",
              fontWeight: 700,
              color: "#1c1c1e",
              padding: "8px 20px 4px",
              background: "transparent",
            }}
          />

          {/* Body */}
          <textarea
            key={`body-${activeNote.id}`}
            ref={textareaRef}
            value={activeNote.body}
            onChange={(e) => updateNote("body", e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#1c1c1e",
              padding: "0 20px 20px",
              background: "transparent",
              
            }}
          />
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.3)", fontSize: "14px" }}>
          Select or create a note
        </div>
      )}
      </div>
      )}
    </div>
  );
}
