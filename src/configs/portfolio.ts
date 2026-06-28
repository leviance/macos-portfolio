export const portfolioProfile = {
  name: "Dung Dương",
  handle: "@duongdung12a8",
  role: "Backend & Systems Engineer",
  location: "Vietnam, UTC+7",
  email: "duongdung12a8@gmail.com",
  github: "https://github.com/leviance",
  linkedin: "https://www.linkedin.com/in/d%C5%A9ng-d%C6%B0%C6%A1ng-95578a208/",
  avatar: "/img/ui/avatar.jpg",
  oneLine:
    "Backend & Systems Engineer building at the intersection of WebAssembly, multimedia processing, cryptography, blockchain, distributed systems, and Self-Sovereign Identity.",
  bio:
    "I like understanding systems from first principles before hiding them behind abstractions. My work spans browser-level multimedia, FFmpeg and WebAssembly, secure backend architecture, cryptographic protocols, identity wallets, and trust infrastructure for verifiable digital systems.",
  principles: [
    "Build from first principles, then turn the principle into usable product behavior.",
    "Privacy belongs in architecture, not just in marketing copy.",
    "Open source is a way to spread knowledge and create trust.",
    "Good design makes complex technology understandable without flattening it.",
    "Trust infrastructure should be verifiable, inspectable, and useful to real people."
  ],
  skills: [
    "Go",
    "C/C++",
    "TypeScript",
    "Node.js",
    "Rust",
    "Zig",
    "WebAssembly",
    "FFmpeg",
    "Emscripten",
    "Canvas",
    "AudioWorklet",
    "API design",
    "Distributed systems",
    "Microservices",
    "Caching",
    "JWT",
    "Fault tolerance",
    "Consistency",
    "Observability",
    "HashiCorp Vault",
    "Key management",
    "Cryptography",
    "RSA / Diffie-Hellman / ECC",
    "Digital signatures",
    "Merkle trees",
    "Zero-knowledge proofs",
    "Compression / codecs",
    "Compiler internals",
    "DID",
    "Verifiable Credentials",
    "PoA / permissioned validators",
    "Blockchain architecture"
  ],
  experience: [
    {
      company: "VCCorp",
      role: "Software Engineer, Video Platform",
      period: "Approx. 2 years",
      detail:
        "Worked on Milan Player for online video systems, including contexts connected to VTV.VN. The work touched browser media playback, performance, codecs, WebAssembly, streaming, and content protection."
    },
    {
      company: "Independent research and product work",
      role: "Backend, Identity, and Trust Infrastructure",
      period: "Research track",
      detail:
        "Researching SSI, translating and systematizing identity concepts in Vietnamese, and shaping Identra, CertNet, and Pinet as related trust-infrastructure ideas."
    }
  ],
  hobbies: [
    "Chess and logic puzzles",
    "Books on psychology, history, philosophy, economics, science, and technology",
    "Running, gym, trekking, and nunchaku practice",
    "Learning piano, English, and Chinese"
  ],
  goals: [
    "Grow into a senior backend and systems engineer who can design high-scale infrastructure.",
    "Build open-source products around self-sovereign identity and digital trust.",
    "Turn deep technical research into infrastructure that real people can use.",
    "Use engineering and product craft to build a Vietnam-rooted technology company with global ambition."
  ]
};

export const terminalSkills = [
  "Node.js",
  "C/C++",
  "Typescript",
  "Webassembly",
  "FFmpeg",
  "HashiCorp Vault",
  "Compression / codecs",
  "Cryptography"
];

export const terminalExperience = portfolioProfile.experience.map((item) =>
  item.company === "Independent research and product work"
    ? {
        ...item,
        detail:
          "Researching SSI, translating and systematizing identity concepts in Vietnamese, and shaping Identra, CertNet, and Pinet as related trust-infrastructure ideas."
      }
    : item
);

export const spotlightProjects = [
  {
    id: "milan-player",
    title: "Milan Player",
    kind: "Case Study",
    folder: "Multimedia",
    repo: "",
    url: "",
    summary:
      "Browser video player work using Canvas, FFmpeg, and WebAssembly to handle FLV/HLS playback, A/V sync, stream control, and content-protection research.",
    tech: ["FFmpeg", "WebAssembly", "Emscripten", "Canvas", "AudioWorklet", "HLS"]
  },
  {
    id: "ssi-translation",
    title: "SSI Vietnamese Translation",
    kind: "Research",
    folder: "Identity",
    repo: "",
    url: "",
    summary:
      "Translation, terminology design, and technical editing around Self-Sovereign Identity, DID, Verifiable Credentials, OpenID4VC, SD-JWT, mDL, and trust frameworks.",
    tech: ["DID", "VC", "OpenID4VC", "SD-JWT", "mDL", "Trust framework"]
  },
  {
    id: "identra",
    title: "Identra",
    kind: "Product Concept",
    folder: "Identity",
    repo: "",
    url: "",
    summary:
      "Open-source identity wallet concept for storing, managing, and selectively sharing verifiable credentials without turning the user into the product.",
    tech: ["Identity wallet", "Selective disclosure", "Secure messaging", "Passkey", "Recovery"]
  },
  {
    id: "identra-website",
    title: "identra-website",
    kind: "Website Repo",
    folder: "Identity",
    repo: "identra-awncorp/identra-website",
    url: "https://github.com/identra-awncorp/identra-website",
    summary:
      "Public website repository for presenting the Identra identity-wallet concept and its trust-centered product direction.",
    tech: ["Website", "Identity", "Product"]
  },
  {
    id: "certnet",
    title: "CertNet",
    kind: "System Architecture",
    folder: "Blockchain",
    repo: "",
    url: "",
    summary:
      "Hybrid blockchain concept for verifiable trust infrastructure in Vietnam, using permissioned validators, public-read access, observer nodes, and off-chain personal data protection.",
    tech: ["PoA", "Observer node", "DID registry", "Audit log", "Dual-token model"]
  },
  {
    id: "certnet-website",
    title: "certnet-website",
    kind: "Website Repo",
    folder: "Blockchain",
    repo: "certnet-awncorp/certnet-website",
    url: "https://github.com/certnet-awncorp/certnet-website",
    summary:
      "Public website repository for presenting CertNet as verifiable trust infrastructure around credentials, auditability, and blockchain-backed validation.",
    tech: ["Website", "Blockchain", "Trust infrastructure"]
  },
  {
    id: "audio-worklet-loader",
    title: "Audio Worklet Loader",
    kind: "Public Repo",
    folder: "Browser Runtime",
    repo: "audio-worklet-loader",
    url: "https://github.com/leviance/audio-worklet-loader",
    summary:
      "Webpack loader for AudioWorklet, aligned with the browser audio and multimedia runtime work behind Milan Player.",
    tech: ["JavaScript", "Webpack", "AudioWorklet"]
  },
  {
    id: "macos-portfolio",
    title: "macos-portfolio",
    kind: "Public Repo",
    folder: "Portfolio",
    repo: "macos-portfolio",
    url: "https://github.com/leviance/macos-portfolio",
    summary:
      "The interactive macOS-style portfolio website, built as a desktop workspace for exploring resume, projects, terminal commands, and source links.",
    tech: ["React", "Vite", "TypeScript", "macOS UI"]
  },
  {
    id: "pinet",
    title: "Pinet / Pinet Vue",
    kind: "Public Repo",
    folder: "Messaging",
    repo: "pinet",
    url: "https://github.com/leviance/pinet",
    summary:
      "Chat and messaging experiments that connect naturally to later interest in secure messaging inside identity and trust systems.",
    tech: ["Vue", "Node.js", "Realtime", "Messaging"]
  },
  {
    id: "uni-js",
    title: "Uni.js",
    kind: "Public Repo",
    folder: "Framework Internals",
    repo: "Uni.js",
    url: "https://github.com/leviance/Uni.js",
    summary:
      "A small JavaScript framework built for learning how reactive UI abstractions work beneath the API surface.",
    tech: ["JavaScript", "Reactivity", "Framework internals"]
  }
];

export const pinnedFinderRepos = ["certnet-website", "identra-website", "audio-worklet-loader", "macos-portfolio"];

export const archiveRepos = [
  "shop-acc-game",
  "Gomart",
  "webassembly-tutorial",
  "wasm-tutorial",
  "FLV-test-link",
  "did-resolver",
  "matic-docs",
  "polygon-smart-contract-tutorial",
  "Flappy-Bird-with-Javascript",
  "ace-editor-vue3",
  "zelo-app-chat",
  "vue2-ace-editor",
  "pinet-vue",
  "handson-ml2",
  "Vue-Ecommerce-Store",
  "Telecom-Template",
  "Neural-Network-for-Mnist-dataset-Hand-writing",
  "map-covid-19",
  "classified",
  "Awesome_chat",
  "Message-App"
];

export const repoSlug = (repo: string) => (repo.includes("/") ? repo : `leviance/${repo}`);
export const repoUrl = (repo: string) => `https://github.com/${repoSlug(repo)}`;
export const vscodeUrl = (repo: string) => `https://vscode.dev/github/${repoSlug(repo)}`;
export const github1sUrl = (repo: string) => `https://github1s.com/${repoSlug(repo)}`;

