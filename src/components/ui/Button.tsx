import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "navy";
type Size = "md" | "lg";

/**
 * Buttons get three states, not two.
 *
 * Hover lifts the button a hair and deepens its shadow; press pulls it back
 * *below* the resting position and collapses the shadow, so the control reads
 * as physically depressed. Most buttons animate on hover and then do nothing on
 * click, which is the moment the user most needs confirmation that the press
 * registered — especially on touch, where hover never fires at all.
 *
 * The transform stays on its own fast timing so the press feels immediate,
 * while colour and shadow settle more slowly.
 */
const base = [
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold",
  "transition-[transform,box-shadow,background-color,border-color,color]",
  "duration-200 ease-[var(--ease-out-expo)] active:duration-75",
  "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  "will-change-transform",
].join(" ");

const variants: Record<Variant, string> = {
  primary: [
    "bg-flame-500 text-white shadow-(--shadow-glow)",
    "hover:bg-flame-600 hover:-translate-y-0.5 hover:shadow-(--shadow-glow-lg)",
    "active:translate-y-px active:bg-flame-700 active:shadow-(--shadow-e1)",
  ].join(" "),
  navy: [
    "bg-navy-950 text-white shadow-(--shadow-e1)",
    "hover:bg-navy-900 hover:-translate-y-0.5 hover:shadow-(--shadow-e2)",
    "active:translate-y-px active:shadow-none",
  ].join(" "),
  outline: [
    "border border-current/25 text-current",
    "hover:border-current/50 hover:bg-current/5 hover:-translate-y-0.5",
    "active:translate-y-px active:bg-current/10",
  ].join(" "),
  ghost: "text-current hover:bg-current/8 active:bg-current/12",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: Props) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
    if (external) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
