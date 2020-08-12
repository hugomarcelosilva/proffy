import React, { InputHTMLAttributes, useState, useRef, useEffect } from 'react';
import { useField } from '@unform/core';

import './styles.css';

interface DynamicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

const DynamicInput: React.FC<DynamicInputProps> = ({
  label,
  name,
  ...rest
}) => {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField } = useField(name);

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <div className="dynamic-input-block">
      <input
        type="text"
        id={name}
        name={name}
        ref={inputRef}
        defaultValue={defaultValue}
        {...rest}
        onFocus={() => setTouched(true)}
      />

      <span
        className={
          touched ? 'placeholder dynamic-block-touched' : 'placeholder'
        }
      >
        {label}
      </span>
    </div>
  );
};

export default DynamicInput;
