const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frame";

const variants = {
  primary: "bg-navy text-white shadow-sm hover:bg-navy-deep",
  secondary: "border border-hairline bg-white text-ink shadow-xs hover:bg-canvas",
  ghost: "text-ink-muted hover:bg-canvas hover:text-ink",
};
// Sizes are whole sets rather than overrides: Tailwind doesn't guarantee that a later class in
// `className` beats an earlier one for the same property.
const sizes = {
  md: "h-10 px-4",
  sm: "h-9 px-3",
  icon: "size-10",
};

/** Class names for a button (or a link or label styled as one). */
export const button = (variant = "secondary", size = "md") =>
  `inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${focusRing} ${sizes[size]} ${variants[variant]}`;

export const inputStyles =
  "h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink shadow-xs transition-colors placeholder:text-ink-muted/50 focus:border-frame focus:outline-none focus:ring-4 focus:ring-frame/20 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/15";

export const linkStyles = `rounded font-medium text-navy underline-offset-2 hover:underline ${focusRing}`;
