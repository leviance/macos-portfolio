const RESUME_URL = "/resume.pdf";
const RESUME_FILENAME = "Dung_Duong_Resume.pdf";

export default function Typora() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--app-bg, #f5f5f7)",
        color: "var(--text-primary, #1d1d1f)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 44,
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "0 14px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
          <span className="i-ph:file-pdf" style={{ fontSize: 20, color: "#d92d20", flex: "0 0 auto" }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 650, lineHeight: 1.15 }}>Dung Dương Resume</div>
            <div style={{ fontSize: 11, opacity: 0.58, lineHeight: 1.15 }}>PDF document</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "0 0 auto" }}>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            title="Open resume in a new tab"
            style={{
              width: 30,
              height: 30,
              display: "grid",
              placeItems: "center",
              borderRadius: 8,
              color: "inherit",
              textDecoration: "none",
              background: "rgba(0,0,0,0.055)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <span className="i-ph:arrow-square-out" style={{ fontSize: 17 }} />
          </a>
          <a
            href={RESUME_URL}
            download={RESUME_FILENAME}
            title="Download resume"
            style={{
              width: 30,
              height: 30,
              display: "grid",
              placeItems: "center",
              borderRadius: 8,
              color: "inherit",
              textDecoration: "none",
              background: "rgba(0,0,0,0.055)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <span className="i-ph:download-simple" style={{ fontSize: 17 }} />
          </a>
        </div>
      </div>

      <object
        data={`${RESUME_URL}#view=FitH`}
        type="application/pdf"
        style={{
          flex: "1 1 auto",
          width: "100%",
          minHeight: 0,
          border: 0,
          background: "#3a3a3c",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "grid",
            placeItems: "center",
            padding: 24,
            textAlign: "center",
            background: "#f5f5f7",
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 650, marginBottom: 8 }}>Resume preview is unavailable</div>
            <a href={RESUME_URL} target="_blank" rel="noreferrer" style={{ color: "#0a84ff", fontSize: 13 }}>
              Open the PDF in a new tab
            </a>
          </div>
        </div>
      </object>
    </div>
  );
}
