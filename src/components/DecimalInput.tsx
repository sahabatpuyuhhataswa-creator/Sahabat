import React, { useState, useEffect } from 'react';

export interface DecimalInputProps {
  value: number | string | undefined | null;
  onChange: (numValue: number, rawString: string) => void;
  allowDecimal?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  autoFocus?: boolean;
  'aria-label'?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Safely parses string with comma (,) or dot (.) decimal separator to float number.
 * Returns 0 if empty or invalid.
 */
export const parseDecimal = (val: string | number | undefined | null): number => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = val.toString().trim();
  if (str === '' || str === '-' || str === ',' || str === '.') return 0;
  // Replace comma with dot for standard JS parsing
  const normalized = str.replace(',', '.');
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Input component that:
 * 1. Allows arbitrary decimal precision (e.g., 43,5678889 or 43.5678889)
 * 2. Supports both comma (,) and dot (.) as decimal separator
 * 3. When deleted / backspaced, it clears completely to "" without snapping back to 0
 */
export const DecimalInput: React.FC<DecimalInputProps> = ({
  value,
  onChange,
  allowDecimal = true,
  min,
  max,
  placeholder,
  className = '',
  required = false,
  disabled = false,
  id,
  name,
  autoFocus = false,
  'aria-label': ariaLabel,
  onBlur,
  onFocus,
}) => {
  const initialString = () => {
    if (value === undefined || value === null) return '';
    // If value is 0, we can display "0" initially unless it was initialized empty
    return value.toString();
  };

  const [displayValue, setDisplayValue] = useState<string>(initialString);

  // Synchronize when value changes externally (e.g. record selected in modal)
  useEffect(() => {
    if (value === undefined || value === null) {
      if (displayValue !== '') setDisplayValue('');
      return;
    }

    const currentNum = parseDecimal(displayValue);
    const incomingNum = typeof value === 'number' ? value : parseDecimal(value);

    // Only update displayValue if value is numerically different
    // OR if displayValue is empty and incoming is not 0
    if (currentNum !== incomingNum) {
      setDisplayValue(value.toString());
    } else if (displayValue === '' && incomingNum !== 0) {
      setDisplayValue(value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // If completely cleared, keep it empty! Do NOT snap to "0".
    if (raw === '') {
      setDisplayValue('');
      onChange(0, '');
      return;
    }

    // Validation pattern based on allowDecimal and min
    // Allow digits and at most one decimal separator (, or .)
    let isValid = false;
    if (allowDecimal) {
      // Regex allows partial typing like "43,", "43.", "0.", "43,5678889"
      const decimalRegex = min !== undefined && min >= 0
        ? /^[0-9]*[.,]?[0-9]*$/
        : /^-?[0-9]*[.,]?[0-9]*$/;
      isValid = decimalRegex.test(raw);
    } else {
      const integerRegex = min !== undefined && min >= 0
        ? /^[0-9]*$/
        : /^-?[0-9]*$/;
      isValid = integerRegex.test(raw);
    }

    if (!isValid) {
      return; // Reject invalid characters (letters, double commas, etc.)
    }

    setDisplayValue(raw);

    // If typing just a minus, comma, or dot, trigger 0 without resetting input
    if (raw === '-' || raw === ',' || raw === '.' || raw === '-,' || raw === '-.') {
      onChange(0, raw);
      return;
    }

    const parsed = parseDecimal(raw);
    onChange(parsed, raw);
  };

  return (
    <input
      type="text"
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      autoComplete="off"
      value={displayValue}
      onChange={handleChange}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      className={className}
      required={required}
      disabled={disabled}
      id={id}
      name={name}
      autoFocus={autoFocus}
      aria-label={ariaLabel}
    />
  );
};
