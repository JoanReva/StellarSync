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
      className="inline-flex h-12 w-auto  px-2 items-center justify-center gap-1 rounded-full bg-[var(--color-surface)] text-sm font-bold uppercase text-[var(--color-text-main)] shadow-[var(--shadow-control)] ring-2 ring-[var(--color-surface-ring)] transition duration-200 hover:scale-105 hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-offset-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        <path d="M2 12h20"></path>
      </svg>
      <span>{language}</span>
    </button>
  );
};
