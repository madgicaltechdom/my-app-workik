import styled from 'styled-components/native';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import ErrorMessage from '../../../components/common/ErrorMessage';

export const Container = styled.View<{ $width: number; $colorScheme: string | null }>`
  flex: 1;
  justify-content: center;
  padding: 24px;
  background-color: #f4f4f4;
  width: ${({ $width }) => ($width > 500 ? '500px' : '100%')};
  align-self: center;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

export const StyledInput = styled(Input)`
  margin-bottom: 8px;
`;

export const StyledErrorMessage = styled(ErrorMessage)`
  margin-bottom: 8px;
`;

export const StyledButton = styled(Button)`
  margin-vertical: 10px;
`;

export const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
`;

export const FooterText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`;

export const FooterLink = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  margin-left: 8px;
  text-decoration: underline;
`;
