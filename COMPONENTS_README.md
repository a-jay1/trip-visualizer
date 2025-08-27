# Trip Planner - Reusable Component System

This project implements a modern, reusable component system for a trip planning application using Next.js, TypeScript, and Tailwind CSS.

## 🏗️ Architecture

The project follows a modular architecture with reusable components that can be configured via JSON/TypeScript configuration files.

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button/          # Enhanced button component
│   ├── Input/           # Text input with icon support
│   ├── Dropdown/        # Custom dropdown component
│   ├── DestinationList/ # Multi-destination input component
│   ├── FormField/       # Dynamic form field renderer
│   ├── TripPlannerForm/ # Main form component
│   ├── Card/           # Layout card component
│   ├── Icon/           # SVG icon component
│   └── index.ts        # Component exports
├── bridges/             # Business logic layer
│   └── Planner/        # Trip planner bridge
├── pages/              # Next.js pages
│   └── planner/        # Trip planner page
├── data/               # Configuration files
│   └── plannerFormConfig.ts # Form configuration
└── types/              # TypeScript type definitions
    └── form.ts         # Form-related types
```

## 🎨 Components

### 1. Icon Component
Renders SVG icons with proper TypeScript support.

```tsx
<Icon name="location" size={20} className="text-gray-400" />
```

### 2. Input Component
Text input with icon support and validation.

```tsx
<Input
  label="Starting Point"
  placeholder="Enter your starting location"
  icon="location"
  value={value}
  onChange={setValue}
  required
/>
```

### 3. Dropdown Component
Custom dropdown with search and selection.

```tsx
<Dropdown
  label="Number of People"
  options={peopleOptions}
  value={selectedValue}
  onChange={handleChange}
  icon="people"
/>
```

### 4. DestinationList Component
Allows adding/removing multiple destinations.

```tsx
<DestinationList
  label="Destinations"
  placeholder="Enter destination"
  addButtonText="Add another destination"
  value={destinations}
  onChange={setDestinations}
/>
```

### 5. FormField Component
Dynamic component that renders different field types based on configuration.

```tsx
<FormField
  field={fieldConfig}
  value={value}
  onChange={handleChange}
  error={error}
/>
```

## 📋 Configuration-Driven Forms

The form is entirely configuration-driven, making it easy to modify without changing code:

```typescript
export const plannerFormConfig: FormConfig = {
  title: "Plan Your Trip",
  fields: [
    {
      id: "startingPoint",
      label: "Starting Point",
      type: "input",
      placeholder: "Enter your starting location",
      icon: "location",
      validation: {
        required: true,
        minLength: 2
      }
    },
    // ... more fields
  ],
  submitButton: {
    text: "Plan My Trip",
    icon: "route",
    type: "primary"
  }
}
```

## 🔧 Field Types

### Input Field
```typescript
{
  id: "fieldId",
  label: "Field Label",
  type: "input",
  placeholder: "Placeholder text",
  icon: "location",
  validation: {
    required: true,
    minLength: 2
  }
}
```

### Dropdown Field
```typescript
{
  id: "fieldId",
  label: "Field Label",
  type: "dropdown",
  icon: "people",
  defaultValue: "1",
  options: [
    { value: "1", label: "1 Person" },
    { value: "2", label: "2 People" }
  ],
  validation: {
    required: true
  }
}
```

### Destination List Field
```typescript
{
  id: "destinations",
  label: "Destinations",
  type: "destination-list",
  placeholder: "Enter destination",
  icon: "destination",
  addButtonText: "Add another destination",
  validation: {
    required: true,
    minItems: 1
  }
}
```

## 🎯 Features

- **TypeScript Support**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS for rapid styling
- **Icon System**: SVG-based icon system with proper typing
- **Form Validation**: Built-in validation with error handling
- **Responsive Design**: Mobile-first responsive design
- **Reusable Components**: Modular components that can be used across the app
- **Configuration-Driven**: Easy to modify forms without code changes
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Usage

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit the planner page:**
   ```
   http://localhost:3001/planner
   ```

3. **Customize the form by editing:**
   ```
   src/data/plannerFormConfig.ts
   ```

## 🧩 Creating New Forms

To create a new form:

1. Create a new configuration file in `src/data/`
2. Define your field configuration using the available field types
3. Import and use `TripPlannerForm` component with your configuration
4. Handle form submission in your bridge component

## 🎨 Styling

The components use Tailwind CSS with a green color scheme matching the design. Key design elements:

- **Primary Color**: Green (#10B981)
- **Background**: Gradient from green-100 to green-200
- **Cards**: White background with rounded corners and shadows
- **Icons**: SVG-based with proper sizing and colors
- **Responsive**: Mobile-first design principles

## 📱 Responsive Design

The form is fully responsive and works on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)

## 🔍 Type Safety

All components are fully typed with TypeScript, providing:
- IntelliSense support
- Compile-time error checking
- Better developer experience
- Reduced runtime errors
