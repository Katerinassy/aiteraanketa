import React from 'react';

const SkillsCheckbox = ({ label, options, selectedSkills, handleChange }) => {
    return (
        <div className="form-group checkbox-group">
            <label>{label}</label>
            <div className="checkbox-container">
                {options.map((option) => (
                    <div key={option.value} className="checkbox-item">
                        <input
                            type="checkbox"
                            id={`skill-${option.value}`}
                            name="skills"
                            value={option.value}
                            checked={selectedSkills.includes(option.value)}
                            onChange={handleChange}
                        />
                        <label htmlFor={`skill-${option.value}`}>
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsCheckbox;