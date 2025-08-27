export type IconName = 'location' | 'destination' | 'people' | 'calendar' | 'route' | 'crown' | 'close' | 'chevronDown' | 'plus';

export interface Option {
  value: string;
  label: string;
}

export interface BaseField {
  id: string;
  label: string;
  icon?: IconName;
  validation?: {
    required?: boolean;
    minLength?: number;
    minItems?: number;
  };
}

export interface InputField extends BaseField {
  type: 'input';
  placeholder: string;
}

export interface DropdownField extends BaseField {
  type: 'dropdown';
  defaultValue: string;
  options: Option[];
}

export interface DestinationListField extends BaseField {
  type: 'destination-list';
  placeholder: string;
  addButtonText: string;
}

export type FieldConfig = InputField | DropdownField | DestinationListField;

export type FormValue = string | string[];
export type FormData = Record<string, FormValue>;

export interface FormConfig {
  title: string;
  fields: FieldConfig[];
  submitButton: {
    text: string;
    icon: string;
    type: string;
  };
  premiumFeatures: {
    title: string;
    description: string;
    icon: string;
  };
}
