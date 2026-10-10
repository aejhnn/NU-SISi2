// Stroke icons on a 24px grid; they inherit the text color and take their size from `className`.
function Icon({ className = "size-4", children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const PlusIcon = (props) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const DownloadIcon = (props) => (
  <Icon {...props}>
    <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
  </Icon>
);

export const UploadIcon = (props) => (
  <Icon {...props}>
    <path d="M12 16V5m0 0-4 4m4-4 4 4M5 20h14" />
  </Icon>
);

export const CameraIcon = (props) => (
  <Icon {...props}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </Icon>
);

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const CardIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M7 14h4" />
  </Icon>
);

export const ExternalIcon = (props) => (
  <Icon {...props}>
    <path d="M14 5h5v5M19 5l-8 8M17 14v5H5V7h5" />
  </Icon>
);
