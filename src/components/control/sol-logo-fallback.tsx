import Image from "next/image";

/** Optimised static fallback for the 3D anchor (no WebGL / init failure). */
export function SolLogoFallback() {
  return (
    <div className="grid aspect-square w-full place-items-center rounded-[2px] border border-[color-mix(in_oklab,var(--persimmon)_40%,transparent)] bg-[var(--bg)] p-4">
      <Image
        src="/SolLogoDef1.1.png"
        alt="SOL_DNB"
        width={1535}
        height={1024}
        sizes="(max-width: 1024px) 80vw, 300px"
        className="h-auto w-full max-w-[260px] object-contain"
      />
    </div>
  );
}
