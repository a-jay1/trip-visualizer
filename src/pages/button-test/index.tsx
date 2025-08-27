import React from 'react';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

const ButtonTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Button Test Page</h1>
        
        {/* Basic Primary Button */}
        <Button
          type="primary"
          label="Primary Button"
          onClick={() => console.log('Primary clicked')}
        />
        
        {/* Basic Secondary Button */}
        <Button
          type="secondary"
          label="Secondary Button" 
          onClick={() => console.log('Secondary clicked')}
        />
        
        {/* Button with Icon */}
        <Button
          type="primary"
          label="With Icon"
          iconBefore={<Icon name="location" size={16} className="text-white" />}
          onClick={() => console.log('Icon button clicked')}
        />
        
        {/* Green Button (like form submit) */}
        <Button
          type="primary"
          label="Plan My Trip"
          iconBefore={<Icon name="route" size={16} className="text-white" />}
          onClick={() => console.log('Submit clicked')}
          classNames={{
            root: 'w-full bg-green-600 hover:bg-green-700 border-green-600 py-3 text-base font-semibold rounded-lg'
          }}
        />
        
        {/* Loading Button */}
        <Button
          type="primary"
          label="Loading Button"
          loading={true}
          onClick={() => console.log('Loading button clicked')}
        />
        
        {/* Disabled Button */}
        <Button
          type="primary"
          label="Disabled Button"
          disabled={true}
          onClick={() => console.log('Disabled button clicked')}
        />
      </div>
    </div>
  );
};

export default ButtonTestPage;
