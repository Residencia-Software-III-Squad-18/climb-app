type ClimbLogoProps = {
  size?: number;
  color?: string;
  className?: string;
};

export const ClimbLogo = ({
  size = 64,
  color = "#7CC9C3",
  className,
}: ClimbLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 220 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Climb"
    >
      <text
        x="0"
        y="48"
        fill={color}
        fontSize="65"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="-2"
      >
        climb
      </text>

      <rect x="173" y="12" width="10" height="8" rx="1.5" fill={color} />
      <rect x="173" y="26" width="22" height="8" rx="1.5" fill={color} />
      <rect x="173" y="40" width="34" height="8" rx="1.5" fill={color} />
    </svg>
  );
};