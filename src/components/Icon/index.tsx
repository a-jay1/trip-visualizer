import React from 'react';

type IconName = 'location' | 'destination' | 'people' | 'calendar' | 'route' | 'crown' | 'close' | 'chevronDown' | 'plus';

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ name, className = '', size = 20 }) => {
  const iconPaths: Record<IconName, React.ReactElement> = {
    location: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill="currentColor"
      />
    ),
    destination: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
      />
    ),
    people: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm11 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM7 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm8 1c-2.33 0-7 1.17-7 3.5V18h14v-1.5c0-2.33-4.67-3.5-7-3.5z"
        fill="currentColor"
      />
    ),
    calendar: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
        fill="currentColor"
      />
    ),
    route: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z"
        fill="currentColor"
      />
    ),
    crown: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 16L3 3l5.5 7L12 4l3.5 6L21 3l-2 13H5zm2.7-2h8.6l.9-5.4-2.1 2.7L12 8l-3.1 3.3-2.1-2.7L7.7 14z"
        fill="currentColor"
      />
    ),
    close: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        fill="currentColor"
      />
    ),
    chevronDown: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
        fill="currentColor"
      />
    ),
    plus: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
        fill="currentColor"
      />
    )
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {iconPaths[name] || iconPaths.location}
    </svg>
  );
};

export default Icon;
