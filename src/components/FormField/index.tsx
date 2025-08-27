import React from 'react';
import Input from '../Input';
import Dropdown from '../Dropdown';
import DestinationList from '../DestinationList';
import { FieldConfig, FormValue } from '../../types/form';

interface FormFieldProps {
  field: FieldConfig;
  value: FormValue;
  onChange: (value: FormValue) => void;
  error?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  error,
  className = ''
}) => {
  const commonProps = {
    id: field.id,
    label: field.label,
    icon: field.icon,
    required: field.validation?.required,
    error,
    className
  };

  switch (field.type) {
    case 'input':
      return (
        <Input
          {...commonProps}
          placeholder={field.placeholder}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
        />
      );
    
    case 'dropdown':
      return (
        <Dropdown
          {...commonProps}
          options={field.options}
          value={typeof value === 'string' ? value : field.defaultValue}
          onChange={onChange}
        />
      );
    
    case 'destination-list':
      return (
        <DestinationList
          {...commonProps}
          placeholder={field.placeholder}
          addButtonText={field.addButtonText}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      );
    
    default:
      return null;
  }
};

export default FormField;
