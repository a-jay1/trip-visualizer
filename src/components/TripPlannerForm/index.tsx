import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Card from '../Card';
import FormField from '../FormField';
import Button from '../Button';
import Icon from '../Icon';
import { FormConfig, FormData, FormValue, FieldConfig } from '../../types/form';

interface TripPlannerFormProps {
  config: FormConfig;
  onSubmit?: (formData: FormData) => void;
  className?: string;
}

const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  config,
  onSubmit,
  className = ''
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: FieldConfig, value: FormValue): string | undefined => {
    const { validation } = field;
    if (!validation) return undefined;

    if (validation.required) {
      if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) {
        return `${field.label} is required`;
      }
    }

    if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`;
    }

    if (validation.minItems && Array.isArray(value) && value.length < validation.minItems) {
      return `Please add at least ${validation.minItems} ${field.label.toLowerCase()}`;
    }

    return undefined;
  };

  const handleFieldChange = (fieldId: string, value: FormValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    // Validate all fields
    config.fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);

    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData);
    }
  };

  const getFieldValue = (fieldId: string, field: FieldConfig): FormValue => {
    if (formData[fieldId] !== undefined) {
      return formData[fieldId];
    }
    
    // Set default values
    if (field.type === 'dropdown') {
      return field.defaultValue;
    }
    
    if (field.type === 'destination-list') {
      return [];
    }
    
    return '';
  };

  return (
    <div className={twMerge('min-h-screen bg-green flex flex-col items-center justify-center p-4', className)}>
      <div className="w-full max-w-md">
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {config.title}
              </h1>
            </div>

            <div className="space-y-6">
              {config.fields.map((field) => (
                <FormField
                  key={field.id}
                  field={field}
                  value={getFieldValue(field.id, field)}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  error={errors[field.id]}
                />
              ))}
            </div>

            <Button
              type="primary"
              submitButton
              label={config.submitButton.text}
              iconBefore={<Icon name="route" size={20} className="text-white" />}
              classNames={{
                root: 'w-full bg-green-600 hover:bg-green-700 border-green-600 py-3 text-base font-semibold rounded-lg'
              }}
            />
          </form>
        </Card>

        {config.premiumFeatures && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Icon name="crown" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {config.premiumFeatures.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {config.premiumFeatures.description}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TripPlannerForm;
