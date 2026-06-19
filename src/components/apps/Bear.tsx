import bear from "~/configs/bear";
import { portfolioProfile, repoUrl, spotlightProjects, vscodeUrl } from "~/configs/portfolio";
import type { BearData, BearMdData } from "~/types";

interface SidebarProps {
  groups: BearData[];
  activeGroup: number;
  onSelect: (index: number) => void;
}

interface ListProps {
  items: BearMdData[];
  activeItem: number;
  onSelect: (index: number) => void;
}

const profileArticles: Record<string, { title: string; kicker: string; sections: Array<{ heading: string; body: string | string[] }> }> = {
  "about-me": {
    title: `About ${portfolioProfile.name}`,
    kicker: portfolioProfile.role,
    sections: [
      { heading: "Profile", body: portfolioProfile.bio },
      { heading: "Technical Direction", body: portfolioProfile.oneLine },
      { heading: "Skills", body: portfolioProfile.skills },
    ],
  },
  principles: {
    title: "Engineering Principles",
    kicker: "How I prefer to build",
    sections: [
      { heading: "Principles", body: portfolioProfile.principles },
      { heading: "Current Goals", body: portfolioProfile.goals },
    ],
  },
  contact: {
    title: "Contact",
    kicker: "Open to engineering conversations",
    sections: [
      {
        heading: "Links",
        body: [
          `Email: ${portfolioProfile.email}`,
          "GitHub: github.com/leviance",
          "LinkedIn: linkedin.com/in/dung-duong",
        ],
      },
    ],
  },
};

function Sidebar({ groups, activeGroup, onSelect }: SidebarProps) {
  return (
    <aside className="bear-sidebar">
      <div className="bear-sidebar-title">DUNGOS</div>
      <nav className="bear-nav">
        {groups.map((group, index) => (
          <button
            key={group.id}
            type="button"
            className={`bear-nav-item ${activeGroup === index ? "is-active" : ""}`}
            onClick={() => onSelect(index)}
          >
            <span className={group.icon} />
            <span>{group.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function NotesList({ items, activeItem, onSelect }: ListProps) {
  return (
    <section className="bear-list-pane">
      <div className="bear-list-header">
        <span>Project Notes</span>
        <span>{items.length}</span>
      </div>
      <div className="bear-list">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`bear-note-card ${activeItem === index ? "is-active" : ""}`}
            onClick={() => onSelect(index)}
          >
            <span className={`bear-note-icon ${item.icon}`} />
            <span className="bear-note-copy">
              <span className="bear-note-title">{item.title}</span>
              <span className="bear-note-excerpt">{item.excerpt}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SectionBody({ body }: { body: string | string[] }) {
  if (Array.isArray(body)) {
    return (
      <ul className="bear-article-list">
        {body.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p>{body}</p>;
}

function Article({ item }: { item: BearMdData }) {
  const project = spotlightProjects.find((entry) => entry.id === item.id);
  const profile = profileArticles[item.id];

  if (project) {
    return (
      <article className="bear-article">
        <header className="bear-article-header">
          <div>
            <p className="bear-kicker">{project.folder}</p>
            <h1>{project.title}</h1>
          </div>
          <span className="bear-kind">{project.kind}</span>
        </header>

        <p className="bear-summary">{project.summary}</p>

        <section className="bear-section">
          <h2>Technical Notes</h2>
          <div className="bear-chip-row">
            {project.tech.map((tech) => (
              <span key={tech} className="bear-chip">{tech}</span>
            ))}
          </div>
        </section>

        <section className="bear-section">
          <h2>Why It Matters</h2>
          <p>
            This note connects the project to Dung's larger backend and systems direction:
            browser runtimes, media infrastructure, cryptography, distributed systems, and
            digital trust.
          </p>
        </section>

        {project.repo && (
          <footer className="bear-actions">
            <a href={repoUrl(project.repo)} target="_blank" rel="noreferrer">GitHub Repo</a>
            <a href={vscodeUrl(project.repo)} target="_blank" rel="noreferrer">Open in VS Code Web</a>
          </footer>
        )}
      </article>
    );
  }

  if (profile) {
    return (
      <article className="bear-article">
        <header className="bear-article-header">
          <div>
            <p className="bear-kicker">{profile.kicker}</p>
            <h1>{profile.title}</h1>
          </div>
        </header>

        {profile.sections.map((section) => (
          <section className="bear-section" key={section.heading}>
            <h2>{section.heading}</h2>
            <SectionBody body={section.body} />
          </section>
        ))}

        <footer className="bear-actions">
          <a href={`mailto:${portfolioProfile.email}`}>Email</a>
          <a href={portfolioProfile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={portfolioProfile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </footer>
      </article>
    );
  }

  return (
    <article className="bear-article">
      <header className="bear-article-header">
        <div>
          <p className="bear-kicker">Note</p>
          <h1>{item.title}</h1>
        </div>
      </header>
      <p className="bear-summary">{item.excerpt}</p>
    </article>
  );
}

export default function Bear() {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const groups = bear;
  const items = groups[activeGroup]?.md ?? [];
  const selected = items[Math.min(activeItem, Math.max(items.length - 1, 0))];

  const selectGroup = (index: number) => {
    setActiveGroup(index);
    setActiveItem(0);
  };

  return (
    <div className="bear-app">
      <Sidebar groups={groups} activeGroup={activeGroup} onSelect={selectGroup} />
      <NotesList items={items} activeItem={activeItem} onSelect={setActiveItem} />
      <main className="bear-content-pane">
        {selected && <Article item={selected} />}
      </main>
    </div>
  );
}
