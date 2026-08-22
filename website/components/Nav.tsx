import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav({ current }: { current?: "home" | "demo" | "judges" | "docs" }) {
  return (
    <nav>
      <Link href="/">coincell</Link>
      <div className="nav-links">
        <Link href="/demo" aria-current={current === "demo" ? "page" : undefined}>
          demo
        </Link>
        <Link href="/judges" aria-current={current === "judges" ? "page" : undefined}>
          judges
        </Link>
        <a href="https://github.com/arjunkshah12345-hash/coincell" target="_blank" rel="noopener noreferrer">
          github ↗
        </a>
        <ThemeToggle />
      </div>
    </nav>
  );
}
