import { useCallback, useEffect, useState } from 'react';
import { useTranslation as useI18nTranslation, TFunction } from 'react-i18next';

/**
 * A safe version of useTranslation that ensures i18n is initialized before returning the t function
 * This prevents the "Empty input string" error that can occur when i18n is not ready
 */
export const useSafeTranslation = (): { t: TFunction; ready: boolean } => {
  const { t: i18nT, ready } = useI18nTranslation();
  const [isReady, setIsReady] = useState(false);

  // Create a safe translation function that won't throw if i18n isn't ready
  const safeT = useCallback(
    (key: string, options?: any) => {
      if (!isReady) return key; // Return key if not ready
      try {
        return i18nT(key, options);
      } catch (error) {
        console.error(`Translation error for key "${key}":`, error);
        return key; // Return key if translation fails
      }
    },
    [i18nT, isReady]
  );

  // Only mark as ready after a small delay to ensure i18n is fully initialized
  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  return { t: safeT, ready: isReady };
};

export default useSafeTranslation;
