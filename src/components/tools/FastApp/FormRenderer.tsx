import React from 'react';

interface FormRendererProps {
  schema: Record<string, any>;           // Adjust this type to match your schema
  formData: any;                         // Adjust this type for formData if needed
  onChange: (updatedFormData: any) => void;
}

/**
 * The FormRenderer component iterates over each section of the schema
 * and renders the corresponding form fields. It expects:
 *
 * - schema: the form structure
 * - formData: the current data for all form fields
 * - onChange: a callback to update formData in the parent
 */
const FormRenderer: React.FC<FormRendererProps> = ({
  schema,
  formData,
  onChange,
}) => {
  /**
   * Renders a single section of the form.
   * @param section The schema for this particular section
   * @param sectionKey A unique identifier for the section (used for keys)
   */
  const renderSection = (section: any, sectionKey: string) => {
    // Example logic — you’ll customize based on how your form is structured:
    // If each "section" contains fields, map over them here.

    return (
      <div>
        <h2>{section.title ?? sectionKey}</h2>
        {/* 
          Render the fields inside this section. For example:
          if (section.properties) {
            return Object.keys(section.properties).map((field) => (...))
          }
        */}
      </div>
    );
  };

  return (
    <div>
      {/* Map over each entry in 'schema' and render a section for it */}
      {Object.entries(schema).map(([sectionKey, section]) => (
        // Important: give each top-level child a unique key
        <div key={sectionKey}>
          {renderSection(section, sectionKey)}
        </div>
      ))}
    </div>
  );
};

export default FormRenderer;
