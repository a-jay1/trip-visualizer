import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Icon from '../Icon';
import { IconName } from '../../types/form';

interface DestinationListProps {
  id?: string;
  label?: string;
  value?: string[];
  onChange?: (destinations: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
  error?: string;
  icon?: IconName;
  required?: boolean;
  className?: string;
}

const DestinationList: React.FC<DestinationListProps> = ({
  id,
  label,
  value = [],
  onChange,
  placeholder = 'Enter destination',
  addButtonText = 'Add another destination',
  error,
  icon = 'destination',
  required = false,
  className = ''
}) => {
  const [destinations, setDestinations] = useState<string[]>(value.length > 0 ? value : ['']);

  const updateDestination = (index: number, newValue: string) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[index] = newValue;
    setDestinations(updatedDestinations);
    
    // Filter out empty destinations for the parent component
    const filteredDestinations = updatedDestinations.filter(dest => dest.trim() !== '');
    onChange?.(filteredDestinations);
  };

  const removeDestination = (index: number) => {
    if (destinations.length > 1) {
      const updatedDestinations = destinations.filter((_, i) => i !== index);
      setDestinations(updatedDestinations);
      
      const filteredDestinations = updatedDestinations.filter(dest => dest.trim() !== '');
      onChange?.(filteredDestinations);
    }
  };

  const addDestination = () => {
    const updatedDestinations = [...destinations, ''];
    setDestinations(updatedDestinations);
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
      
      <div className="flex flex-col gap-3">
        {destinations.map((destination, index) => (
          <div key={index} className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
              <Icon name={icon} size={20} />
            </div>
            
            <input
              type="text"
              placeholder={placeholder}
              value={destination}
              onChange={(e) => updateDestination(index, e.target.value)}
              className={twMerge(
                'w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200',
                error && 'border-red-500 focus:ring-red-500'
              )}
            />
            
            {destinations.length > 1 && (
              <button
                type="button"
                onClick={() => removeDestination(index)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <Icon name="close" size={20} />
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={addDestination}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-200 self-start"
        >
          <Icon name="plus" size={16} />
          {addButtonText}
        </button>
      </div>
      
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
};

export default DestinationList;
