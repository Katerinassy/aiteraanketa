import React from 'react';
import SkillsCheckbox from './SkillsCheckbox';

const FormSection = ({ title, fields, formData, errors, handleChange }) => {
  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>
      {fields.map((field) => {
        if (field.type === 'textarea') {
          return (
            <div key={field.id} className="form-group">
              <label htmlFor={field.id}>{field.label}{field.required && ' *'}</label>
              <textarea
                id={field.id}
                name={field.id}
                value={formData[field.id] || ''}
                onChange={handleChange}
              />
              {errors[field.id] && <span className="error">{errors[field.id]}</span>}
            </div>
          );
        } else if (field.type === 'select') {
          return (
            <div key={field.id} className="form-group">
              <label htmlFor={field.id}>{field.label}{field.required && ' *'}</label>
              <select
                id={field.id}
                name={field.id}
                value={formData[field.id] || ''}
                onChange={handleChange}
              >
                {field.options.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors[field.id] && <span className="error">{errors[field.id]}</span>}
            </div>
          );
        } else if (field.type === 'skills') {
          return (
            <SkillsCheckbox
              key={field.id}
              label={field.label}
              options={field.options}
              selectedSkills={formData.skills}
              handleChange={handleChange}
            />
          );
        } else {
          return (
            <div key={field.id} className="form-group">
              <label htmlFor={field.id}>{field.label}{field.required && ' *'}</label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                value={formData[field.id] || ''}
                onChange={handleChange}
                required={field.required}
                readOnly={field.readOnly}
                min={field.min}
                max={field.max}
                step={field.step}
              />
              {errors[field.id] && <span className="error">{errors[field.id]}</span>}
            </div>
          );
        }
      })}
    </div>
  );
};

export default FormSection;