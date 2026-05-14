import { useI18nStore, useTranslation } from '../../store/useI18nStore';

export const LanguageButton = () => {
  const language = useI18nStore((state) => state.language);
  const setLanguage = useI18nStore((state) => state.setLanguage);
  const { t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button
      type="button"
      aria-label={t('toggleLanguage')}
      onClick={toggleLanguage}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)] text-sm font-bold uppercase text-[var(--color-text-main)] shadow-[var(--shadow-control)] ring-2 ring-[var(--color-surface-ring)] transition duration-200 hover:scale-105 hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-offset-2"
    >
      {language}
    </button>
  );
};
