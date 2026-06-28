import { useStore } from "~/stores";
import { github1sUrl, repoSlug } from "~/configs/portfolio";

export default function VSCode() {
  const repo = useStore((state) => state.vscodeRepo || "macos-portfolio");
  const slug = repoSlug(repo);

  return (
    <iframe
      className="size-full bg-[#202020]"
      src={github1sUrl(repo)}
      title={`VSCode - ${slug}`}
    />
  );
}
