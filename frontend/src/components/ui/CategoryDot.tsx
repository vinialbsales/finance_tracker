import { FALLBACK_CATEGORY_COLOR } from "../../lib/ui";

type CategoryDotProps = {
  color: string | null | undefined;
  size?: "sm" | "md";
};

// The category's own color is the only "data color" in lists; null falls back to gray.
export function CategoryDot({ color, size = "sm" }: CategoryDotProps) {
  const dimensions = size === "md" ? "h-3 w-3" : "h-2.5 w-2.5";

  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full ${dimensions}`}
      style={{ backgroundColor: color ?? FALLBACK_CATEGORY_COLOR }}
    />
  );
}
