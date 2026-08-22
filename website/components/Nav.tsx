import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav({ current }: { current?: "home" | "demo" | "judges" | "docs" }) {
  return (
    <nav>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Logo size={18} />
        <span>haloscan</span>
      </Link>
      <div className="nav-links">
        <Link href="/scan" aria-current={current === "demo" ? "page" : undefined}>
          scan
        </Link>
        <Link href="/judges" aria-current={current === "judges" ? "page" : undefined}>
          judges
        </Link>
        <a href="https://github.com/arjunkshah12345-hash/haloscan" target="_blank" rel="noopener noreferrer">
          github ↗
        </a>
        <ThemeToggle />
      </div>
    </nav>
  );
}
