import React, { useState, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, darkTheme } from '../../../theme';
import { sanitizeInput } from '../../../utils/validation';
import {
  InputContainer,
  LabelContainer,
  StyledLabel,
  RequiredIndicator,
  StyledInputContainer,
  StyledInput,
  HelperTextContainer,
  HelperText,
  CharacterCount,
} from './Input.styles';
import type { InputProps } from './Input.types';

export const Input: React.FC<InputProps> = ({
  label,
  required = false,
  error,
  helperText,
  disabled: propDisabled = false,
  isDisabled,
  maxLength,
  showCharacterCount = false,
  value,
  onChangeText,
  containerStyle,
  inputStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
  placeholder,
  ...props
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const currentTheme = isDark ? darkTheme : theme;

  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  // Handle both disabled and isDisabled props (isDisabled takes precedence)
  const disabled = isDisabled !== undefined ? isDisabled : propDisabled;
  
  const hasError = Boolean(error);
  const displayValue = value !== undefined ? value : internalValue;
  const characterCount = displayValue.length;

  const handleFocus = useCallback((e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  }, [props.onFocus]);

  const handleBlur = useCallback((e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  }, [props.onBlur]);

  const handleChangeText = useCallback((text: string) => {
    // Sanitize input to prevent XSS
    const sanitizedText = sanitizeInput(text);
    
    // Apply max length if specified
    const finalText = maxLength ? sanitizedText.slice(0, maxLength) : sanitizedText;
    
    if (value === undefined) {
      setInternalValue(finalText);
    }
    
    onChangeText?.(finalText);
  }, [maxLength, onChangeText, value]);

  const placeholderTextColor = useMemo(() => {
    if (disabled) return currentTheme.colors.textMuted;
    return currentTheme.colors.textSecondary;
  }, [disabled, currentTheme]);

  const defaultAccessibilityLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;
    if (label) return `${label}${required ? ' required' : ''} input`;
    return t('common.input', { defaultValue: 'Text input' });
  }, [accessibilityLabel, label, required, t]);

  const accessibilityState = useMemo(() => ({
    disabled,
    invalid: hasError,
  }), [disabled, hasError]);

  const inputAccessibilityHint = useMemo(() => {
    if (accessibilityHint) return accessibilityHint;
    
    const hints = [];
    if (required) hints.push(t('common.required', { defaultValue: 'Required field' }));
    if (maxLength) hints.push(t('common.maxLength', { 
      defaultValue: 'Maximum {{count}} characters',
      count: maxLength 
    }));
    
    return hints.length > 0 ? hints.join('. ') : undefined;
  }, [accessibilityHint, required, maxLength, t]);

  return (
    <InputContainer style={containerStyle}>
      {label && (
        <LabelContainer>
          <StyledLabel
            $required={required}
            $hasError={hasError}
            $disabled={disabled}
            $isDark={isDark}
            theme={currentTheme}
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          >
            {label}
          </StyledLabel>
          {required && <RequiredIndicator theme={currentTheme}>*</RequiredIndicator>}
        </LabelContainer>
      )}

      <StyledInputContainer
        $hasError={hasError}
        $isFocused={isFocused}
        $disabled={disabled}
        $isDark={isDark}
        theme={currentTheme}
      >
        <StyledInput
          {...props}
          value={displayValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          $hasError={hasError}
          $disabled={disabled}
          $isDark={isDark}
          theme={currentTheme}
          maxLength={maxLength}
          testID={testID}
          accessibilityLabel={defaultAccessibilityLabel}
          accessibilityHint={inputAccessibilityHint}
          accessibilityState={accessibilityState}
        />
      </StyledInputContainer>

      {(error || helperText || (showCharacterCount && maxLength)) && (
        <HelperTextContainer theme={currentTheme}>
          {(error || helperText) && (
            <HelperText
              $isError={hasError}
              theme={currentTheme}
              testID={testID ? `${testID}-${hasError ? 'error' : 'helper'}` : undefined}
              accessibilityRole={hasError ? 'alert' : 'text'}
              accessibilityLiveRegion={hasError ? 'assertive' : 'none'}
            >
              {error || helperText}
            </HelperText>
          )}
          
          {showCharacterCount && maxLength && (
            <CharacterCount
              theme={currentTheme}
              testID={testID ? `${testID}-character-count` : undefined}
              accessibilityLabel={t('common.characterCount', {
                defaultValue: '{{current}} of {{max}} characters',
                current: characterCount,
                max: maxLength
              })}
            >
              {characterCount}/{maxLength}
            </CharacterCount>
          )}
        </HelperTextContainer>
      )}
    </InputContainer>
  );
};
