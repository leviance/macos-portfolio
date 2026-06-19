import type { WebsitesData } from "~/types";

const websites: WebsitesData = {
  favorites: {
    title: "Dung Duong",
    sites: [
      {
        id: "my-email",
        title: "Email",
        img: "img/sites/gmail.svg",
        link: "mailto:duongdung12a8@gmail.com",
      },
      {
        id: "my-github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/leviance",
      },
      {
        id: "my-linkedin",
        title: "Linkedin",
        img: "img/sites/linkedin.svg",
        link: "https://www.linkedin.com/in/d%C5%A9ng-d%C6%B0%C6%A1ng-95578a208/",
      },
    ],
  },
  freq: {
    title: "Project Repositories",
    sites: [
      {
        id: "audio-worklet-loader",
        title: "Audio Worklet",
        img: "img/sites/github.svg",
        link: "https://github.com/leviance/audio-worklet-loader",
      },
      {
        id: "ffmpeg-tutorial",
        title: "FFmpeg Lab",
        img: "img/sites/github.svg",
        link: "https://github.com/leviance/ffmpeg-tutorial",
      },
      {
        id: "data-compression",
        title: "Compression",
        img: "img/sites/github.svg",
        link: "https://github.com/leviance/data-compression",
      },
      {
        id: "pinet",
        title: "Pinet",
        img: "img/sites/github.svg",
        link: "https://github.com/leviance/pinet",
      },
      {
        id: "uni-js",
        title: "Uni.js",
        img: "img/sites/github.svg",
        link: "https://github.com/leviance/Uni.js",
      },
    ],
  },
};

export default websites;
