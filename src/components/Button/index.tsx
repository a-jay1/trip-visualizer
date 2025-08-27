import React from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonType = 'primary' | 'secondary';

interface ButtonProps {
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  type?: ButtonType;
  disabled?: boolean;
  classNames?: {
    root?: string;
    label_?: string;
  };
  loading?: boolean;
  submitButton?: boolean;
  tracking?: {
    eventName?: string;
    screen?: string;
    custom?: Record<string, unknown>;
  };
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    label,
    onClick = () => {},
    iconBefore,
    iconAfter,
    type = 'primary',
    disabled = false,
    classNames = {},
    loading = false,
    submitButton,
    tracking = {},
    children,
    ...rest
  } = props;

  const { root = '', label_ = '' } = classNames;

  const classNameMapping: Record<ButtonType | `${ButtonType}-disable`, string> = {
    primary: 'bg-blue-900 border border-blue-900 text-white hover:bg-blue-800',
    'primary-disable': 'bg-gray-200 border border-gray-200 text-gray-400',
    secondary: 'bg-transparent border border-blue-900 text-blue-900 hover:bg-blue-50',
    'secondary-disable': 'bg-transparent border border-gray-400 text-gray-400',
  };

  const { eventName, screen, custom } = tracking;

  const getDisabledVariant = (buttonType: ButtonType): `${ButtonType}-disable` => {
    return `${buttonType}-disable`;
  };

  const rootStyle = twMerge(
    'font-medium text-sm rounded flex items-center gap-2 px-4 py-2 relative overflow-hidden transition-all duration-200',
    classNameMapping[type],
    root,
    tracking?.eventName ? 'event-track' : '',
    disabled ? `cursor-not-allowed ${classNameMapping[getDisabledVariant(type)]}` : 'cursor-pointer',
  );

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.classList.add('animate-ripple', 'absolute', 'rounded-full', 'bg-current', 'bg-opacity-40');

    button.appendChild(circle);

    // Remove the ripple after animation
    circle.addEventListener('animationend', () => {
      circle.remove();
    });
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      createRipple(e);
      // Small delay to allow ripple animation to start
      setTimeout(() => onClick?.(e), 50);
    }
  };

  return (
    <button
      className={rootStyle}
      type={submitButton ? 'submit' : 'button'}
      onClick={handleButtonClick}
      disabled={disabled || loading}
      data-track={JSON.stringify({ name: eventName, screen, custom })}
      {...rest}
    >
      {iconBefore && iconBefore}
      {!loading && label && (
        <span className={twMerge('text-center', label_)}>{label}</span>
      )}
      {loading && (
        <span className="text-center">Loading...</span>
      )}
      {iconAfter && iconAfter}
      {children}
    </button>
  );
};

export default Button;
