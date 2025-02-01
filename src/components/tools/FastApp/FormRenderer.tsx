// File: FormRenderer.tsx
import React from 'react';

interface FormRendererProps {
  schema: Record<string, any>;
  formData: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  schema,
  formData,
  onChange,
}) => {
  if (!schema || !schema.properties) {
    return <div>No valid schema was provided.</div>;
  }

  const handleFieldChange = (fieldKey: string, value: any) => {
    onChange({
      ...formData,
      [fieldKey]: value,
    });
  };

  return (
    <div>
      {/* If the schema step has a title, show it here (optional) */}
      {schema.title && (
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {schema.title}
        </h2>
      )}

      {Object.entries(schema.properties).map(([fieldKey, fieldDef]: [string, any]) => {
        const fieldValue = formData[fieldKey] || '';
        const isRequired = schema.required?.includes(fieldKey);
        const labelText = (fieldDef.title || fieldKey) + (isRequired ? ' *' : '');

        return (
          <div key={fieldKey} className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              {labelText}
            </label>

            {/* If it's an enum => <select> */}
            {Array.isArray(fieldDef.enum) ? (
              <select
                className="block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fieldValue}
                onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
              >
                <option value="">-- Select an option --</option>
                {fieldDef.enum.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : fieldDef.type === 'number' ? (
              <input
                type="number"
                className="block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fieldValue}
                onChange={(e) => {
                  const numericVal = parseFloat(e.target.value);
                  handleFieldChange(fieldKey, isNaN(numericVal) ? '' : numericVal);
                }}
              />
            ) : (
              // Default to text input
              <input
                type="text"
                className="block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fieldValue}
                onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FormRenderer;
