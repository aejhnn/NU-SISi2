import { useState } from "react";

function Silhouette() {
  return (
    <svg viewBox="0 0 200 270" aria-hidden="true" className="size-full text-[#3a2bb0] opacity-45">
      <circle cx="100" cy="104" r="36" fill="currentColor" />
      <path d="M18 270C20 204 56 162 100 162C144 162 180 204 182 270Z" fill="currentColor" />
    </svg>
  );
}

function StudentPhoto({ src, alt, watermark, className = "" }) {
  // Remember a URL that failed to load so a broken link falls back to the silhouette.
  const [failedSrc, setFailedSrc] = useState(null);
  const showPhoto = src && src !== failedSrc;

  return (
    <figure
      className={`relative aspect-[20.4/27.5] overflow-hidden rounded-[1.1rem] border-4 border-frame bg-[radial-gradient(130%_90%_at_50%_30%,#190b80_0%,#0c0254_55%,#050030_100%)] shadow-[0_0_2.25rem_0.125rem_rgb(91_139_252/0.38)] ${className}`}
    >
      {showPhoto ? (
        <img src={src} alt={alt} onError={() => setFailedSrc(src)} className="size-full object-cover" />
      ) : (
        <Silhouette />
      )}
      {watermark && (
        <figcaption className="absolute inset-0 grid place-items-center">
          <span className="w-min rounded-md border border-white/40 bg-black/50 px-[0.85rem] py-[0.85rem] text-center text-xl font-black uppercase leading-[1.33] tracking-[0.1em] text-white backdrop-blur-[2px] lg:text-[1.72rem]">
            {watermark}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

export default StudentPhoto;
