import React from 'react';
import { twMerge } from 'tailwind-merge';
import Icon from '../Icon';
import { IconName } from '../../types/form';

interface InputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  icon?: IconName;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  placeholder,
  value = '',
  onChange,
  onBlur,
  error,
  icon,
  required = false,
  disabled = false,
  className = '',
  inputClassName = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon name={icon} size={20} />
          </div>
        )}
        
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={twMerge(
            'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200',
            icon && 'pl-11',
            error && 'border-red-500 focus:ring-red-500',
            disabled && 'bg-gray-100 cursor-not-allowed',
            inputClassName
          )}
        />
      </div>
      
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Input;
