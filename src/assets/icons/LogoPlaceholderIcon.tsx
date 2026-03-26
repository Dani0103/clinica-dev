type Props = {
  size?: number;
  className?: string;
};

export function LogoPlaceholderIcon({ size = 32, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7 15V11L10 13L13 9L17 12V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
