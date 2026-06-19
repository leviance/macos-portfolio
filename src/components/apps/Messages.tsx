import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolioProfile } from "~/configs/portfolio";

interface Message {
  id: string;
  text: string;
  from: "me" | "them";
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread?: number;
  messages: Message[];
  online?: boolean;
}

const conversationsSeed: Conversation[] = [
  {
    id: "recruiter",
    name: "Recruiter Notes",
    avatar: "R",
    preview: "Start with Finder, then Terminal, then Resume.",
    time: "Now",
    unread: 1,
    online: true,
    messages: [
      { id: "1", text: "What should I open first?", from: "them", time: "10:30 AM" },
      { id: "2", text: "Start with Finder for the project map, then Terminal for a quick command-driven profile.", from: "me", time: "10:31 AM" },
      { id: "3", text: "Resume has the long-form version when you want deeper context.", from: "me", time: "10:32 AM" },
    ],
  },
  {
    id: "systems",
    name: "Systems Track",
    avatar: "S",
    preview: "WebAssembly, FFmpeg, streaming, and backend architecture.",
    time: "Pinned",
    messages: [
      { id: "1", text: "Milan Player is the main media systems case study.", from: "them", time: "9:20 AM" },
      { id: "2", text: "It connects FFmpeg, WebAssembly, Canvas rendering, streaming constraints, and key-management thinking.", from: "me", time: "9:22 AM" },
    ],
  },
  {
    id: "identity",
    name: "Identity Track",
    avatar: "I",
    preview: "SSI translation, Identra, CertNet.",
    time: "Research",
    messages: [
      { id: "1", text: "The identity track is not just blockchain branding.", from: "them", time: "8:00 AM" },
      { id: "2", text: "Right. It is about credentials, trust, terminology, wallets, and infrastructure people can reason about.", from: "me", time: "8:03 AM" },
    ],
  },
  {
    id: "contact",
    name: "Contact",
    avatar: "C",
    preview: portfolioProfile.email,
    time: "Anytime",
    messages: [
      { id: "1", text: `Email: ${portfolioProfile.email}`, from: "me", time: "Now" },
      { id: "2", text: `GitHub: ${portfolioProfile.github}`, from: "me", time: "Now" },
      { id: "3", text: `LinkedIn: ${portfolioProfile.linkedin}`, from: "me", time: "Now" },
    ],
  },
];

export default function MessagesApp() {
  const [activeConv, setActiveConv] = useState(conversationsSeed[0]);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState(conversationsSeed);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [activeConv, conversations]);

  const send = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      from: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeConv.id
          ? { ...conversation, messages: [...conversation.messages, newMsg], preview: input.trim(), time: "Now" }
          : conversation
      )
    );
    setActiveConv((prev) => ({ ...prev, messages: [...prev.messages, newMsg] }));
    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        background: "rgba(248,248,250,0.99)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 238,
          flexShrink: 0,
          borderRight: "0.5px solid rgba(0,0,0,0.1)",
          background: "rgba(242,242,247,0.98)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: 12, borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(0,0,0,0.07)",
              borderRadius: 9,
              padding: "6px 9px",
            }}
          >
            <span className="i-ph:magnifying-glass" style={{ width: 12, height: 12, opacity: 0.5 }} />
            <input
              placeholder="Search"
              style={{
                background: "none",
                border: "none",
                outline: "none",
                fontSize: 14,
                width: "100%",
                color: "#1c1c1e",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => {
                setActiveConv(conversation);
                setConversations((prev) =>
                  prev.map((item) => (item.id === conversation.id ? { ...item, unread: 0 } : item))
                );
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: activeConv.id === conversation.id ? "rgba(0,122,255,0.1)" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                borderRadius: 10,
                margin: "1px 4px",
                width: "calc(100% - 8px)",
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #007AFF, #34C759)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    color: "white",
                    fontWeight: 800,
                  }}
                >
                  {conversation.avatar}
                </div>
                {conversation.online && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#34C759",
                      border: "2px solid rgba(242,242,247,0.98)",
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: conversation.unread ? 800 : 600,
                      color: "#1c1c1e",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conversation.name}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", flexShrink: 0 }}>{conversation.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 2 }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: conversation.unread ? "#1c1c1e" : "rgba(0,0,0,0.45)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conversation.preview}
                  </span>
                  {conversation.unread ? (
                    <span
                      style={{
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        background: "#007AFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "white",
                        fontWeight: 800,
                        padding: "0 4px",
                      }}
                    >
                      {conversation.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "0.5px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(248,248,250,0.99)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #007AFF, #34C759)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              color: "white",
              fontWeight: 800,
            }}
          >
            {activeConv.avatar}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1c1e" }}>{activeConv.name}</div>
            {activeConv.online && <div style={{ fontSize: 11, color: "#34C759" }}>Active now</div>}
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <AnimatePresence>
            {activeConv.messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.025, duration: 0.2 }}
                style={{ display: "flex", justifyContent: message.from === "me" ? "flex-end" : "flex-start" }}
              >
                <div
                  style={{
                    maxWidth: "72%",
                    padding: "8px 12px",
                    borderRadius: message.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: message.from === "me" ? "linear-gradient(135deg, #007AFF, #0055D4)" : "rgba(229,229,234,0.9)",
                    color: message.from === "me" ? "white" : "#1c1c1e",
                    fontSize: 14,
                    lineHeight: 1.45,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div
          style={{
            padding: "10px 12px",
            borderTop: "0.5px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(248,248,250,0.99)",
          }}
        >
          <div style={{ flex: 1, background: "rgba(0,0,0,0.06)", borderRadius: 20, padding: "7px 14px" }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && send()}
              placeholder="iMessage"
              style={{
                width: "100%",
                background: "none",
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "#1c1c1e",
              }}
            />
          </div>
          <button
            onClick={send}
            disabled={!input.trim()}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: input.trim() ? "#007AFF" : "rgba(0,0,0,0.15)",
              border: "none",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: input.trim() ? "white" : "rgba(0,0,0,0.3)",
              flexShrink: 0,
            }}
          >
            <span className="i-ph:arrow-up" style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
