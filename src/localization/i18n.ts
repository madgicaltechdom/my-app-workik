import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      }
    },
    lng: 'en', // Hardcode to 'en' to avoid locale detection issues
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    debug: false, // Disable debug to reduce noise
  });

export default i18n;
