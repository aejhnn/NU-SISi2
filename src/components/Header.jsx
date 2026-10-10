import { getAcademicYear } from "../lib/format";

function Header({ role, busy }) {
  return (
    <header>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pb-4 lg:flex-nowrap lg:pb-4.5">
        <div className="flex items-center">
          <div className="flex flex-col items-center gap-1.5 lg:gap-[0.95rem]">
            <img src="NU_shield.svg" height="65px" width="65px" />
            <span className="text-[0.55rem] font-bold leading-none text-navy lg:text-[0.9375rem]">
              NU CEBU
            </span>
          </div>
          <p
            aria-label="NU Cebu"
            className="ml-3 flex flex-col font-extrabold leading-none text-navy lg:ml-[1.6rem]"
          >
            <span className="text-[2.4rem] tracking-tighter lg:text-[3.9rem]">
              NU
            </span>
            <span className="-mt-0.5 text-xl tracking-[-0.03em] lg:-mt-[=0.3rem] lg:text-[2rem]">
              CEBU
            </span>
          </p>
          <span
            aria-hidden="true"
            className="mx-3 h-12 w-px bg-[#cfd3dc] lg:mr-3 lg:ml-[1.1rem] lg:h-20"
          />
          <div>
            <h2 className="text-base font-medium leading-none text-ink-muted sm:text-xl lg:text-[2.06rem]">
              Identification Dashboard
            </h2>
            <p className="mt-2 text-[0.7rem] font-medium uppercase leading-none text-navy-ink sm:text-sm lg:mt-3.5 lg:text-[1.5rem]">
              Academic Year {getAcademicYear()}
            </p>
          </div>
        </div>
        <span className="inline-flex h-9 items-center rounded-lg bg-signal px-4 text-sm font-bold uppercase tracking-[0.04em] text-ink shadow-[0_0.375rem_1rem_-0.375rem_rgb(176_146_0/0.6)] lg:h-14.5 lg:rounded-[0.875rem] lg:px-9.5 lg:text-[1.5625rem]">
          {role}
        </span>
      </div>

      {/* Header rule; a gold sweep runs along it while a scanned card is being verified. */}
      <div className="relative h-1 overflow-hidden bg-navy-deep">
        {busy && (
          <span className="absolute inset-y-0 left-0 w-1/4 animate-sweep bg-linear-to-r from-transparent via-[#f3d27a] to-transparent" />
        )}
      </div>
    </header>
  );
}

export default Header;
