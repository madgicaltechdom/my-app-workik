import React from 'react';
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  FieldContainer,
  Label,
  Input,
  ErrorText,
} from './FormField.styles';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  showError?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error = '',
  showError = true,
  ...props
}) => {
  const theme = useTheme();
  
  return (
    <FieldContainer>
      <Label>{label}</Label>
      <Input
        placeholderTextColor={theme.colors.subText}
        {...props}
      />
      {showError && error ? <ErrorText>{error}</ErrorText> : null}
    </FieldContainer>
  );
};

export default FormField;
