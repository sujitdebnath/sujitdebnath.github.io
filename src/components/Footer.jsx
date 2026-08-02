import { profile } from "../data/content.js";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t hairline">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[12px] text-ink-muted dark:text-parchment-muted">
          © {year} {profile.name}. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="mark-line font-mono text-[12px] text-ink-muted dark:text-parchment-muted hover:text-ink dark:hover:text-parchment"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
