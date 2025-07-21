
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
    lng: Localization.getLocales()[0]?.languageTag || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
