const tones = {
  info: "border-frame/30 bg-frame/8 text-navy-ink",
  success: "border-success/30 bg-success/8 text-success",
  danger: "border-danger/30 bg-danger/8 text-danger",
};

/** An inline message at the top of a panel. Errors are announced as alerts, the rest politely. */
function Banner({ tone = "info", title, children }) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}>
      {title && <p className="font-semibold">{title}</p>}
      {children && <p className={title ? "mt-0.5 text-ink-muted" : undefined}>{children}</p>}
    </div>
  );
}

export default Banner;
