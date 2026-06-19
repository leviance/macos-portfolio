import type { TerminalData } from "~/types";
import { portfolioProfile, spotlightProjects, repoUrl, vscodeUrl } from "./portfolio";

const terminal: TerminalData[] = [
  {
    id: "about",
    title: "about",
    type: "folder",
    children: [
      {
        id: "whoami",
        title: "whoami.txt",
        type: "file",
        content: (
          <div className="py-1 space-y-1">
            <div>{portfolioProfile.name}</div>
            <div>{portfolioProfile.role}</div>
            <div>{portfolioProfile.oneLine}</div>
          </div>
        )
      },
      {
        id: "bio",
        title: "bio.txt",
        type: "file",
        content: portfolioProfile.bio
      },
      {
        id: "principles",
        title: "principles.txt",
        type: "file",
        content: (
          <ul className="list-disc ml-6">
            {portfolioProfile.principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )
      },
      {
        id: "contact",
        title: "contact.txt",
        type: "file",
        content: (
          <ul className="list-disc ml-6">
            <li>
              Email:{" "}
              <a className="text-blue-300" href={`mailto:${portfolioProfile.email}`}>
                {portfolioProfile.email}
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a className="text-blue-300" href={portfolioProfile.github} target="_blank" rel="noreferrer">
                github.com/leviance
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a className="text-blue-300" href={portfolioProfile.linkedin} target="_blank" rel="noreferrer">
                linkedin.com/in/dung-duong
              </a>
            </li>
          </ul>
        )
      }
    ]
  },
  {
    id: "skills",
    title: "skills.txt",
    type: "file",
    content: (
      <div className="grid grid-cols-3 gap-x-4 gap-y-1">
        {portfolioProfile.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    )
  },
  {
    id: "experience",
    title: "experience.txt",
    type: "file",
    content: (
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
    )
  },
  {
    id: "projects",
    title: "projects",
    type: "folder",
    children: spotlightProjects.map((project) => ({
      id: project.id,
      title: `${project.id}.md`,
      type: "file",
      content: (
        <div className="space-y-1">
          <div className="text-yellow-200">{project.title}</div>
          <div>{project.summary}</div>
          <div className="text-green-300">{project.tech.join(" / ")}</div>
          {project.repo && (
            <div>
              GitHub:{" "}
              <a className="text-blue-300" href={repoUrl(project.repo)} target="_blank" rel="noreferrer">
                {repoUrl(project.repo)}
              </a>
              <br />
              VS Code Web:{" "}
              <a className="text-blue-300" href={vscodeUrl(project.repo)} target="_blank" rel="noreferrer">
                {vscodeUrl(project.repo)}
              </a>
            </div>
          )}
        </div>
      )
    })) as TerminalData[]
  },
  {
    id: "goals",
    title: "goals.txt",
    type: "file",
    content: (
      <ul className="list-disc ml-6">
        {portfolioProfile.goals.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  },
  {
    id: "hobbies",
    title: "hobbies.txt",
    type: "file",
    content: (
      <ul className="list-disc ml-6">
        {portfolioProfile.hobbies.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
];

export default terminal;
