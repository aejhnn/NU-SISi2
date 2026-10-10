// Navy-and-gold waves framing the page. Both are drawn in artboard pixels (1920×1072) and sized
// in rem, so they scale with the rest of the layout. The top-left wave sits behind the frosted
// card; the bottom-right one overlaps it on large screens, as in the design.

const TL_EDGE =
  "M500 -18C487 -12 444 4 420 18C396 32 376 46 356 64C336 82 318 105 300 128C282 151 267 176 250 200C233 224 217 249 200 272C183 295 168 318 150 338C132 358 113 377 93 394C73 411 54 426 32 440C10 454 -28 470 -40 476";
const TL_RIBBON =
  "M320 -18C312 -12 285 7 270 20C255 33 242 47 230 60C218 73 210 88 200 100C190 112 180 122 170 133C160 144 150 155 140 165C130 175 120 186 110 195C100 204 91 214 79 220C67 226 60 230 40 234C20 238 -27 244 -40 246";
const BR_EDGE =
  "M840 8C830 9 800 10 780 14C760 18 740 27 720 35C700 43 679 53 660 64C641 75 623 87 606 100C589 113 574 126 560 140C546 154 533 168 520 182C507 196 495 210 482 225C469 240 456 258 443 275C430 292 417 308 405 325C393 342 381 358 369 375C357 392 346 408 333 425C320 442 308 458 294 475C280 492 267 508 252 525C237 542 223 558 206 575C189 592 171 608 148 625C125 642 93 660 68 675C43 690 11 706 0 712";
const BR_INNER_EDGE =
  "M840 288C830 287 798 284 780 282C762 280 745 276 730 276C715 276 704 280 690 284C676 288 664 293 649 300C634 307 614 317 600 325C586 333 576 342 566 350C556 358 546 367 538 375C530 383 526 388 515 400C504 412 488 433 475 450C462 467 451 483 439 500C427 517 416 533 403 550C390 567 378 583 364 600C350 617 332 635 316 650C300 665 279 680 265 692C251 704 236 715 230 720";

function GoldGradient({ id, x1, y1, x2, y2 }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
      <stop offset="0" stopColor="#b48c3b" />
      <stop offset="0.3" stopColor="#e3c46f" />
      <stop offset="0.5" stopColor="#f7e3a3" />
      <stop offset="0.72" stopColor="#d8b660" />
      <stop offset="1" stopColor="#b2893a" />
    </linearGradient>
  );
}

function BackgroundWaves() {
  return (
    <>
      <svg
        viewBox="0 0 480 480"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 -z-10 hidden w-120 lg:block drop-shadow-[0_0.4rem_0.9rem_rgb(17_24_64/0.22)]"
      >
        <defs>
          <linearGradient id="wave-tl-navy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#283070" />
            <stop offset="1" stopColor="#2e3a82" />
          </linearGradient>
          <GoldGradient id="wave-tl-gold" x1="480" y1="0" x2="0" y2="480" />
          <clipPath id="wave-tl-clip">
            <path d={`${TL_EDGE}L-60 476L-60 -60L500 -60Z`} />
          </clipPath>
        </defs>
        <path d={`${TL_EDGE}L-60 476L-60 -60L500 -60Z`} fill="url(#wave-tl-navy)" />
        <g clipPath="url(#wave-tl-clip)" fill="#fff">
          <path d="M0 0H210L60 150Z" opacity="0.04" />
          <path d="M210 0L120 260L330 90Z" opacity="0.025" />
          <path d="M0 300L120 260L60 420Z" opacity="0.035" />
        </g>
        <path d={TL_RIBBON} fill="none" stroke="url(#wave-tl-gold)" strokeWidth="6" />
        <path d={TL_EDGE} fill="none" stroke="url(#wave-tl-gold)" strokeWidth="8" />
      </svg>

      <svg
        viewBox="0 0 780 692"
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 -z-10 w-[min(48.75rem,90vw)] drop-shadow-[0_0_1rem_rgb(17_24_64/0.3)] lg:z-10"
      >
        <defs>
          <linearGradient id="wave-br-navy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2d3886" />
            <stop offset="1" stopColor="#222b6b" />
          </linearGradient>
          <linearGradient id="wave-br-inner" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#32408a" />
            <stop offset="1" stopColor="#262f70" />
          </linearGradient>
          <GoldGradient id="wave-br-gold" x1="780" y1="0" x2="0" y2="692" />
          <GoldGradient id="wave-br-gold-inner" x1="780" y1="280" x2="230" y2="692" />
          <clipPath id="wave-br-inner-clip">
            <path d={`${BR_INNER_EDGE}L230 760L860 760L860 288Z`} />
          </clipPath>
          <filter id="wave-br-lift" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="-3" stdDeviation="5" floodColor="#0b1033" floodOpacity="0.45" />
          </filter>
        </defs>
        <path d={`${BR_EDGE}L-20 760L860 760L860 8Z`} fill="url(#wave-br-navy)" />
        <path d="M200 692L560 170" stroke="#1d2560" strokeOpacity="0.5" strokeWidth="1" />
        <g filter="url(#wave-br-lift)">
          <path d={`${BR_INNER_EDGE}L230 760L860 760L860 288Z`} fill="url(#wave-br-inner)" />
        </g>
        <g clipPath="url(#wave-br-inner-clip)" fill="#fff">
          <path d="M420 692L560 500L700 692Z" opacity="0.04" />
          <path d="M560 500L780 420L700 692Z" opacity="0.025" />
          <path d="M300 692L420 600L560 692Z" opacity="0.03" />
        </g>
        <path d={BR_INNER_EDGE} fill="none" stroke="url(#wave-br-gold-inner)" strokeWidth="7" />
        <path d={BR_EDGE} fill="none" stroke="url(#wave-br-gold)" strokeWidth="9" />
      </svg>
    </>
  );
}

export default BackgroundWaves;
