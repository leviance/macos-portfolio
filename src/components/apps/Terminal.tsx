import React, { useMemo, useRef, useState } from "react";
import terminalTree from "~/configs/terminal";
import { portfolioProfile, repoUrl, spotlightProjects, vscodeUrl } from "~/configs/portfolio";
import type { TerminalData } from "~/types";

type Row = {
  id: number;
  prompt?: string;
  command?: string;
  output?: React.ReactNode;
};

const aliases: Record<string, string> = {
  "?": "help",
  about: "whoami",
  me: "whoami",
  skill: "skills",
  work: "experience",
  project: "projects",
  repo: "projects",
  email: "contact",
};

const help = (
  <div className="space-y-1.5">
    <div className="text-green-300">Available commands</div>
    <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-1">
      <span className="text-yellow-200">whoami</span><span>Short profile.</span>
      <span className="text-yellow-200">skills</span><span>Technical stack and systems interests.</span>
      <span className="text-yellow-200">experience</span><span>Work and research track.</span>
      <span className="text-yellow-200">projects</span><span>Spotlight projects.</span>
      <span className="text-yellow-200">hobbies</span><span>Personal interests.</span>
      <span className="text-yellow-200">goals</span><span>Long-term direction.</span>
      <span className="text-yellow-200">care</span><span>Principles and values.</span>
      <span className="text-yellow-200">contact</span><span>Email, GitHub, LinkedIn.</span>
      <span className="text-yellow-200">open github</span><span>Open GitHub profile.</span>
      <span className="text-yellow-200">ls / cd / cat</span><span>Browse the local profile files.</span>
      <span className="text-yellow-200">clear</span><span>Clear terminal history.</span>
    </div>
  </div>
);

const findChild = (children: TerminalData[], title: string, type?: string) =>
  children.find((item) => item.title === title && (!type || item.type === type));

const getChildrenAtPath = (path: string[]) => {
  let children = terminalTree;
  for (const segment of path) {
    const next = findChild(children, segment, "folder");
    if (!next?.children) return terminalTree;
    children = next.children;
  }
  return children;
};

const commandList = (items: TerminalData[]) => (
  <div className="grid grid-cols-2 gap-x-5 gap-y-1 sm:grid-cols-4">
    {items.map((item) => (
      <span key={item.id} className={item.type === "folder" ? "text-purple-300" : "text-white"}>
        {item.title}
      </span>
    ))}
  </div>
);

export default function Terminal() {
  const [rows, setRows] = useState<Row[]>([
    {
      id: 0,
      output: (
        <div className="space-y-1">
          <div>
            <span className="text-green-300">help</span>: try <span className="text-yellow-200">whoami</span>,{" "}
            <span className="text-yellow-200">skills</span>, <span className="text-yellow-200">projects</span>,{" "}
            <span className="text-yellow-200">contact</span>, or <span className="text-yellow-200">ls</span>.
          </div>
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [path, setPath] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cwd = path.length ? path[path.length - 1] : "~";
  const children = useMemo(() => getChildrenAtPath(path), [path]);

  const print = (command: string, output: React.ReactNode) => {
    setRows((current) => [
      ...current,
      {
        id: Date.now() + current.length,
        prompt: `@leviance ${cwd} >`,
        command,
        output,
      },
    ]);
  };

  const runOpen = (target?: string) => {
    const normalized = (target || "").toLowerCase();
    if (!normalized || normalized === "github") {
      window.open(portfolioProfile.github, "_blank", "noopener,noreferrer");
      return <span>Opening GitHub profile.</span>;
    }
    if (normalized === "linkedin") {
      window.open(portfolioProfile.linkedin, "_blank", "noopener,noreferrer");
      return <span>Opening LinkedIn profile.</span>;
    }
    if (normalized === "email" || normalized === "mail") {
      window.location.href = `mailto:${portfolioProfile.email}`;
      return <span>Opening email client.</span>;
    }

    const project = spotlightProjects.find((item) => item.id === normalized || item.repo?.toLowerCase() === normalized);
    if (project?.repo) {
      window.open(vscodeUrl(project.repo), "_blank", "noopener,noreferrer");
      return <span>Opening {project.title} in VS Code Web.</span>;
    }

    return <span className="text-red-300">open: unknown target: {target}</span>;
  };

  const runCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    setHistory((current) => [...current, trimmed]);
    setHistoryIndex(null);

    const [rawName, ...args] = trimmed.split(/\s+/);
    const name = aliases[rawName.toLowerCase()] || rawName.toLowerCase();
    const arg = args.join(" ");

    if (name === "clear") {
      setRows([]);
      return;
    }

    if (name === "help") return print(trimmed, help);
    if (name === "pwd") return print(trimmed, <span>/{path.join("/")}</span>);
    if (name === "ls") return print(trimmed, commandList(children));

    if (name === "cd") {
      if (!arg || arg === "~" || arg === "/") {
        setPath([]);
        print(trimmed, <span />);
        return;
      }
      if (arg === "..") {
        setPath((current) => current.slice(0, -1));
        print(trimmed, <span />);
        return;
      }
      const folder = findChild(children, arg, "folder");
      if (!folder) return print(trimmed, <span className="text-red-300">cd: no such directory: {arg}</span>);
      setPath((current) => [...current, folder.title]);
      print(trimmed, <span />);
      return;
    }

    if (name === "cat") {
      const file = findChild(children, arg, "file");
      if (!file) return print(trimmed, <span className="text-red-300">cat: no such file: {arg}</span>);
      return print(trimmed, <>{file.content}</>);
    }

    if (name === "whoami") {
      return print(
        trimmed,
        <div className="space-y-1">
          <div className="text-yellow-200">{portfolioProfile.name}</div>
          <div>{portfolioProfile.role}</div>
          <div>{portfolioProfile.oneLine}</div>
        </div>
      );
    }

    if (name === "skills") {
      return print(
        trimmed,
        <div className="grid grid-cols-2 gap-x-5 gap-y-1 sm:grid-cols-3">
          {portfolioProfile.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      );
    }

    if (name === "experience") {
      return print(
        trimmed,
        <div className="space-y-3">
          {portfolioProfile.experience.map((item) => (
            <div key={item.company}>
              <div className="text-yellow-200">{item.role}</div>
              <div className="text-green-300">
                {item.company} | {item.period}
              </div>
              <div>{item.detail}</div>
            </div>
          ))}
        </div>
      );
    }

    if (name === "projects") {
      return print(
        trimmed,
        <div className="space-y-2">
          {spotlightProjects.map((project) => (
            <div key={project.id}>
              <span className="text-yellow-200">{project.title}</span>
              <span className="text-white/50"> ({project.kind})</span>
              <div>{project.summary}</div>
              {project.repo && (
                <a className="text-blue-300" href={repoUrl(project.repo)} target="_blank" rel="noreferrer">
                  {repoUrl(project.repo)}
                </a>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (name === "hobbies" || name === "goals" || name === "care") {
      const list =
        name === "hobbies"
          ? portfolioProfile.hobbies
          : name === "goals"
            ? portfolioProfile.goals
            : portfolioProfile.principles;
      return print(
        trimmed,
        <ul className="ml-5 list-disc">
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    }

    if (name === "contact") {
      return print(
        trimmed,
        <div className="space-y-1">
          <div>Email: <a className="text-blue-300" href={`mailto:${portfolioProfile.email}`}>{portfolioProfile.email}</a></div>
          <div>GitHub: <a className="text-blue-300" href={portfolioProfile.github} target="_blank" rel="noreferrer">github.com/leviance</a></div>
          <div>LinkedIn: <a className="text-blue-300" href={portfolioProfile.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/dung-duong</a></div>
        </div>
      );
    }

    if (name === "open") return print(trimmed, runOpen(arg));
    if (name === "lang") return print(trimmed, <span>Language switching is planned. Current profile copy is English-first with Vietnamese source context preserved.</span>);

    print(trimmed, <span className="text-red-300">zsh: command not found: {rawName}</span>);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const command = input;
    setInput("");
    runCommand(command);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const [commandName, partial = ""] = input.split(/\s+/);
      if (commandName === "cd" || commandName === "cat") {
        const type = commandName === "cd" ? "folder" : "file";
        const match = children.find((item) => item.type === type && item.title.startsWith(partial));
        if (match) setInput(`${commandName} ${match.title}`);
      }
    }
  };

  return (
    <div
      className="h-full overflow-y-auto bg-[#111820]/95 px-3 py-2 font-terminal text-sm font-normal text-white"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="space-y-2 pb-2">
        {rows.map((row) => (
          <div key={row.id} className="break-words">
            {row.prompt && (
              <div>
                <span className="text-yellow-200">{row.prompt}</span> <span>{row.command}</span>
              </div>
            )}
            {row.output && <div className="py-0.5">{row.output}</div>}
          </div>
        ))}

        <form className="flex items-center gap-1.5" onSubmit={handleSubmit}>
          <span className="shrink-0 text-yellow-200">
            @leviance <span className="text-green-300">{cwd}</span> <span className="text-red-400">&gt;</span>
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 bg-transparent px-1 text-white outline-none"
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
