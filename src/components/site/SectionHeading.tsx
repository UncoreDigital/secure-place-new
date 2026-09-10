import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "light",
  className,
}: Props) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "reveal flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 font-mono text-2xs font-semibold uppercase tracking-[0.16em]",
            dark ? "text-flame-400" : "text-flame-700",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-flame-500" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "max-w-3xl text-fluid-lg font-bold leading-[1.08]",
          dark ? "text-white" : "text-navy-950",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "max-w-2xl text-md leading-relaxed",
            dark ? "text-white/65" : "text-mist-500",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
