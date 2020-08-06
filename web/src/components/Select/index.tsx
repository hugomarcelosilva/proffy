import React, { SelectHTMLAttributes, useRef, useEffect } from 'react';
import { useField } from '@unform/core';

import './styles.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const Select: React.FC<SelectProps> = ({ name, label, options, ...props }) => {
  const inputRef = useRef(null);
  const { fieldName, defaultValue = '', registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <div className="select-block">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        ref={inputRef}
        {...props}
      >
        <option value="" disabled hidden>
          Selecione uma opção
        </option>
        {options.map(option => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
      {error && <span>{error}</span>}
    </div>
  );
};

export default Select;
