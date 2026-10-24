// Shared Tailwind class strings so form controls look the same on every page.

export const FALLBACK_CATEGORY_COLOR = "#808080";

// One keyboard focus ring for every control that doesn't draw its own (inputs use a border + ring).
export const focusRingClass =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";

export const labelClass = "block text-xs font-medium text-zinc-600";

// Helper/hint text under a field. zinc-500 is the lightest gray that keeps 4.5:1 on white.
export const helperTextClass = "mt-1.5 text-xs text-zinc-500";

export const errorTextClass = "mt-1.5 flex items-center gap-1.5 text-xs text-danger";

export const inputClass =
  "mt-1.5 block w-full min-w-0 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 " +
  "transition-colors placeholder:text-zinc-500 enabled:hover:border-zinc-300 " +
  "focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 " +
  "aria-invalid:border-danger aria-invalid:focus:border-danger aria-invalid:focus:ring-danger " +
  "disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500";

export const primaryButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white " +
  `transition-colors hover:bg-zinc-700 active:bg-zinc-800 ${focusRingClass} ` +
  "disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 " +
  `transition-colors hover:border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100 ${focusRingClass} ` +
  "disabled:cursor-not-allowed disabled:opacity-50";

// Low-emphasis text action in a panel header ("Ver todas", "Cancelar"). The negative
// margin keeps the label aligned with the panel's padding despite its own hit area.
export const subtleButtonClass =
  "-mr-2 rounded-md px-2 py-1 text-xs font-medium text-zinc-600 transition-colors " +
  `hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200 ${focusRingClass}`;

// zinc-500 icons keep the 3:1 non-text contrast; the padding gives a 32px target on touch screens.
export const iconButtonClass =
  "rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200 sm:p-1.5 " +
  `${focusRingClass} disabled:cursor-not-allowed disabled:opacity-50`;

// Segmented control built from visually hidden radios: the <label> is the visible option.
// Hover is limited to unchecked, enabled options so it never outranks the checked white text.
// Horizontal padding and font size are left to each use (compact filter vs. form field).
export const segmentedGroupClass = "rounded-md border border-zinc-200 p-0.5";

export const segmentedOptionClass =
  "cursor-pointer rounded-[5px] py-1.5 text-center text-zinc-500 transition-colors " +
  "not-has-checked:not-has-disabled:hover:bg-zinc-50 not-has-checked:not-has-disabled:hover:text-zinc-900 " +
  "has-checked:bg-zinc-900 has-checked:font-medium has-checked:text-white " +
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-zinc-900 " +
  "has-disabled:cursor-not-allowed has-disabled:text-zinc-400";

// Shared by every Recharts series so bars and slices move the same way. "auto" makes
// Recharts skip the animation when the OS asks for reduced motion.
export const CHART_ANIMATION = {
  isAnimationActive: "auto",
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: "ease-out",
} as const;

// Tooltips only glide between items, so they move faster than the series.
export const CHART_TOOLTIP_ANIMATION = {
  isAnimationActive: "auto",
  animationDuration: 200,
  animationEasing: "ease-out",
} as const;
