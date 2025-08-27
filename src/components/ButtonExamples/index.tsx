import React from 'react';
import Button from '../Button';
import Icon from '../Icon';

// Example usage of the fixed Button component
const ButtonExamples: React.FC = () => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!', e);
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Button Component Examples</h2>
      
      {/* Primary Button */}
      <Button
        type="primary"
        label="Primary Button"
        onClick={handleClick}
      />
      
      {/* Secondary Button */}
      <Button
        type="secondary"
        label="Secondary Button"
        onClick={handleClick}
      />
      
      {/* Button with Icon Before */}
      <Button
        type="primary"
        label="With Icon"
        iconBefore={<Icon name="location" size={16} />}
        onClick={handleClick}
      />
      
      {/* Button with Icon After */}
      <Button
        type="primary"
        label="Next"
        iconAfter={<Icon name="chevronDown" size={16} />}
        onClick={handleClick}
      />
      
      {/* Loading Button */}
      <Button
        type="primary"
        label="Loading Button"
        loading={true}
        onClick={handleClick}
      />
      
      {/* Disabled Button */}
      <Button
        type="primary"
        label="Disabled Button"
        disabled={true}
        onClick={handleClick}
      />
      
      {/* Submit Button */}
      <Button
        type="primary"
        label="Submit Form"
        submitButton={true}
        onClick={handleClick}
      />
      
      {/* Custom Styled Button */}
      <Button
        type="primary"
        label="Custom Styled"
        onClick={handleClick}
        classNames={{
          root: 'bg-green-600 hover:bg-green-700 border-green-600 py-4 px-8 text-lg',
          label_: 'font-bold'
        }}
      />
      
      {/* Button with Children */}
      <Button
        type="secondary"
        onClick={handleClick}
      >
        <div className="flex items-center gap-2">
          <Icon name="crown" size={16} />
          <span>Premium Features</span>
        </div>
      </Button>
    </div>
  );
};

export default ButtonExamples;
