export function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.4" opacity="0.65" />
      <circle cx="16" cy="16" r="4" fill="currentColor" />
    </svg>
  );
}
