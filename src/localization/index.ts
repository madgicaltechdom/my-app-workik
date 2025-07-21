import { en } from './en';

export const translations = {
  en,
};

export type SupportedLocale = keyof typeof translations;

export function t(locale: SupportedLocale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return key;
  }
  return value;
}
