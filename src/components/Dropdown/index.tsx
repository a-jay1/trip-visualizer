import React, { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import Icon from '../Icon';
import { IconName, Option } from '../../types/form';

interface DropdownProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  icon?: IconName;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  icon,
  required = false,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={twMerge('flex flex-col gap-2', className)} ref={dropdownRef}>
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
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={twMerge(
            'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between',
            icon && 'pl-11',
            error && 'border-red-500 focus:ring-red-500',
            disabled && 'bg-gray-100 cursor-not-allowed',
            isOpen && 'ring-2 ring-green-500 border-transparent'
          )}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Icon name={icon} size={20} />
              </div>
            )}
            <span className={twMerge(
              'text-gray-900',
              !selectedOption && 'text-gray-500'
            )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          
          <Icon 
            name="chevronDown" 
            size={20} 
            className={twMerge(
              'text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionSelect(option.value)}
                className={twMerge(
                  'w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150',
                  option.value === value && 'bg-green-50 text-green-700',
                  'first:rounded-t-lg last:rounded-b-lg'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Dropdown;
