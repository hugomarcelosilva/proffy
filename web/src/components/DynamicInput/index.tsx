import React, { InputHTMLAttributes, useState, useRef, useEffect } from 'react';
import { useField } from '@unform/core';
import { StyledComponent } from 'styled-components';

import './styles.css';

interface DynamicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  label: string;
  name: string;
  passwordIcons?: [
    StyledComponent<any, any, {}, never>,
    StyledComponent<any, any, {}, never>,
  ];
}

const DynamicInput: React.FC<DynamicInputProps> = ({
  label,
  name,
  passwordIcons,
  ...rest
}) => {
  const inputRef = useRef(null);

  const [inputType, setInputType] = useState(rest.type);
  const { fieldName, defaultValue, registerField } = useField(name);

  const [touched, setTouched] = useState(false);

  var Icons = !passwordIcons
    ? false
    : {
        notShowText: passwordIcons[0],
        showText: passwordIcons[1],
      };

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  function handleIconClick() {
    setInputType(inputType === 'text' ? 'password' : 'text');
  }

  return (
    <div className="dynamic-input-block">
      <input
        type={inputType}
        id={name}
        name={name}
        ref={inputRef}
        defaultValue={defaultValue}
        onFocus={() => setTouched(true)}
      />

      <span
        className={
          touched ? 'placeholder dynamic-block-touched' : 'placeholder'
        }
      >
        {label}
      </span>
      {Icons && Icons.showText && inputType === 'text' ? (
        <Icons.showText onClick={handleIconClick} />
      ) : (
        Icons &&
        Icons.notShowText && <Icons.notShowText onClick={handleIconClick} />
      )}
    </div>
  );
};

export default DynamicInput;
