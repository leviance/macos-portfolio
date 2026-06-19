import type { BearData } from "~/types";
import { portfolioProfile, spotlightProjects, repoUrl } from "./portfolio";

const bear: BearData[] = [
  {
    id: "profile",
    title: "Profile",
    icon: "i-ph:user-circle",
    md: [
      {
        id: "about-me",
        title: "About Dung",
        file: "markdown/about-me.md",
        icon: "i-ph:identification-card",
        excerpt: portfolioProfile.oneLine
      },
      {
        id: "principles",
        title: "Engineering Principles",
        file: "markdown/principles.md",
        icon: "i-ph:compass",
        excerpt: "First principles, privacy in architecture, open knowledge, and clear product stories."
      },
      {
        id: "contact",
        title: "Contact",
        file: "markdown/contact.md",
        icon: "i-ph:envelope-simple",
        excerpt: `${portfolioProfile.email} | github.com/leviance`
      }
    ]
  },
  {
    id: "project",
    title: "Projects",
    icon: "i-ph:git-branch",
    md: spotlightProjects.map((project) => ({
      id: project.id,
      title: project.title,
      file: project.repo
        ? `https://raw.githubusercontent.com/leviance/${project.repo}/main/README.md`
        : "markdown/project-case-study.md",
      icon: project.repo ? "i-fa6-brands:github" : "i-ph:blueprint",
      excerpt: project.summary,
      link: project.repo ? repoUrl(project.repo) : undefined
    }))
  }
];

export default bear;
