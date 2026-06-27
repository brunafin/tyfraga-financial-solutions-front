type LogoCoinProps = {
  className?: string;
  gradientId?: string;
};

const LogoCoin = ({ className, gradientId = "coinGradient" }: LogoCoinProps) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient
        id={gradientId}
        x1="24"
        y1="4"
        x2="24"
        y2="44"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3F1B4C" />
        <stop offset="0.5" stopColor="#D72557" />
        <stop offset="1" stopColor="#EA6E56" />
      </linearGradient>
    </defs>
    <path
      d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
      stroke={`url(#${gradientId})`}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32 16H20C18.9391 16 17.9217 16.4214 17.1716 17.1716C16.4214 17.9217 16 18.9391 16 20C16 21.0609 16.4214 22.0783 17.1716 22.8284C17.9217 23.5786 18.9391 24 20 24H28C29.0609 24 30.0783 24.4214 30.8284 25.1716C31.5786 25.9217 32 26.9391 32 28C32 29.0609 31.5786 30.0783 30.8284 30.8284C30.0783 31.5786 29.0609 32 28 32H16"
      stroke="#3F1B4C"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path
      d="M24 36V12"
      stroke="#3F1B4C"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

export default LogoCoin;
