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
        "Researching SSI, translating and systematizing identity concepts in Vietnamese, and shaping Identra, CertNet, SCH, Pinet, and AI Trust Agent as related trust-infrastructure ideas."
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
    id: "sch",
    title: "SCH - Smart Contract Hosting",
    kind: "Product Concept",
    folder: "Blockchain",
    repo: "",
    url: "",
    summary:
      "Smart Contract Hosting concept for making contract deployment, verification, and operations more accessible inside a broader digital-trust ecosystem.",
    tech: ["Smart contracts", "Hosting", "Verification", "Developer tooling"]
  },
  {
    id: "ai-trust-agent",
    title: "AI Trust Agent",
    kind: "Research Concept",
    folder: "Identity / AI",
    repo: "",
    url: "",
    summary:
      "Research direction for agents that help people reason about credentials, permissions, trust signals, and identity-related decisions without hiding the security model.",
    tech: ["AI agents", "DID", "VC", "Trust signals", "User agency"]
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
    id: "wasm-ffmpeg-lab",
    title: "WebAssembly / FFmpeg Lab",
    kind: "Repo Group",
    folder: "Systems Lab",
    repo: "ffmpeg-tutorial",
    url: "https://github.com/leviance/ffmpeg-tutorial",
    summary:
      "Learning lab around FFmpeg 5.0, C/C++, WebAssembly, and Emscripten, showing the lower-level path behind browser multimedia work.",
    tech: ["C/C++", "FFmpeg", "WebAssembly", "Emscripten"]
  },
  {
    id: "data-compression",
    title: "Data Compression",
    kind: "Public Repo",
    folder: "Systems Lab",
    repo: "data-compression",
    url: "https://github.com/leviance/data-compression",
    summary:
      "C++ systems-learning repo around compression, aligned with interest in codecs, entropy coding, ANS, FSE, and performance-oriented algorithms.",
    tech: ["C++", "Compression", "Algorithms", "Codecs"]
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

export const archiveRepos = [
  "shop-acc-game",
  "Gomart",
  "ace-editor-vue3",
  "Flappy-Bird-with-Javascript",
  "Vue-Ecommerce-Store",
  "Telecom-Template",
  "Neural-Network-for-Mnist-dataset-Hand-writing",
  "polygon-smart-contract-tutorial",
  "map-covid-19",
  "classified",
  "Awesome_chat",
  "Message-App"
];

export const repoUrl = (repo: string) => `https://github.com/leviance/${repo}`;
export const vscodeUrl = (repo: string) => `https://vscode.dev/github/leviance/${repo}`;

