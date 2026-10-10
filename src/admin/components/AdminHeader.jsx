import { getAcademicYear } from "../../lib/format";
import { useApiHealth } from "../queries";
import { ExternalIcon } from "./icons";
import { button } from "./styles";

const HEALTH = {
  online: ["API online", "bg-success"],
  "database-offline": ["Database offline", "bg-danger"],
  offline: ["API offline", "bg-danger"],
  checking: ["Checking API…", "bg-ink-muted/40"],
};

function HealthBadge() {
  const health = useApiHealth();
  const state = health.isError ? "offline" : (health.data ?? "checking");
  const [label, dot] = HEALTH[state];
  return (
    <span role="status" className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-ink-muted">
      <span aria-hidden="true" className={`size-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function AdminHeader() {
  return (
    <header className="border-b-4 border-navy-deep bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <img src="/NU_shield.svg" alt="" width="40" height="40" className="size-10" />
          <div className="leading-tight">
            <p className="text-lg font-extrabold tracking-tight text-navy">
              NU CEBU <span className="font-semibold text-ink-muted">· Student Admin</span>
            </p>
            <p className="text-xs font-medium uppercase text-navy-ink">Academic Year {getAcademicYear()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HealthBadge />
          <a href="/" target="_blank" rel="noreferrer" className={button("ghost", "sm")}>
            Open kiosk
            <ExternalIcon className="size-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
