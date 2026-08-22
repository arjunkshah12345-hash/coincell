import Link from "next/link";

export function Nav({ current }: { current?: "home" | "demo" | "judges" | "docs" }) {
  return (
    <nav>
      <Link href="/" className="site-title">
        Haloscan
      </Link>
      <div className="nav-links">
        <Link href="/scan" aria-current={current === "demo" ? "page" : undefined}>
          Clinical Scanner
        </Link>
        <Link href="/judges" aria-current={current === "judges" ? "page" : undefined}>
          Judge Guide
        </Link>
        <a href="https://github.com/arjunkshah12345-hash/haloscan" target="_blank" rel="noopener noreferrer">
          Source Code
        </a>
      </div>
    </nav>
  );
}
