
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { en } from './en';

const translations = { en };
const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.enableFallback = true;
i18n.locale = Localization.getLocales()[0]?.languageTag || 'en';

export default i18n;
