import { motion } from 'framer-motion';
import cometUrl from '../../assets/cards/comet.svg';
import moonUrl from '../../assets/cards/moon.svg';
import starUrl from '../../assets/cards/star.svg';
import sunUrl from '../../assets/cards/sun.svg';
import type { CardSymbol, MemoryCard } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTranslation } from '../../store/useI18nStore';

type CardProps = {
  card: MemoryCard;
  isDisabled: boolean;
  isComparing: boolean;
  isWaiting: boolean;
  onSelect: (cardId: string) => void;
};

const CARD_MOTION = {
  hoverLiftY: -4,
  tapScale: 0.97,
  waitingOpacity: 0.48,
  waitingScale: 0.96,
  comparingPulseY: [0, -3, 0],
  flipDurationSeconds: 0.45,
  comparingPulseDurationSeconds: 0.8,
  comparingRingDurationSeconds: 0.8,
  waitingShimmerDurationSeconds: 0.9,
} as const;

const CARD_COLORS = {
  backBackground: 'var(--color-card-back-bg)',
  backText: 'var(--color-card-back-text)',
  backBorder: 'var(--color-card-back-border)',
  frontBackground: 'var(--color-card-front-bg)',
  frontBorder: 'var(--color-card-front-border)',
  comparingRing: 'var(--color-card-comparing-ring)',
  comparingGlow: 'var(--color-card-comparing-glow)',
  waitingOverlay: 'var(--color-card-waiting-overlay)',
} as const;

const cardImages: Record<CardSymbol, string> = {
  star: starUrl,
  moon: moonUrl,
  sun: sunUrl,
  comet: cometUrl,
};

export const Card = ({
  card,
  isDisabled,
  isComparing,
  isWaiting,
  onSelect,
}: CardProps) => {
  const isCardLabelEnabled = useSettingsStore(
    (state) => state.isCardLabelEnabled,
  );
  const { t } = useTranslation();
  
  const isFaceUp = card.isFlipped || card.isMatched;
  const translatedSymbol = t(`symbol_${card.symbol}` as Parameters<typeof t>[0]);
  
  const label = isFaceUp
    ? card.isMatched
      ? t('cardMatched', { symbol: translatedSymbol })
      : t('cardRevealed', { symbol: translatedSymbol })
    : t('revealCard');

  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-pressed={isFaceUp}
      disabled={isDisabled || card.isMatched}
      onClick={() => onSelect(card.id)}
      className="group aspect-square w-full rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-offset-4 disabled:cursor-not-allowed"
      // Controls the blocked/comparing visual state for the whole card.
      animate={{
        opacity: isWaiting ? CARD_MOTION.waitingOpacity : 1,
        scale: isWaiting ? CARD_MOTION.waitingScale : 1,
        y: isComparing ? [...CARD_MOTION.comparingPulseY] : 0,
      }}
      // Face-down cards lift on hover to show they are clickable.
      whileHover={
        !isDisabled && !isFaceUp ? { y: CARD_MOTION.hoverLiftY } : undefined
      }
      // Small press animation when the player clicks a selectable card.
      whileTap={
        !isDisabled && !isFaceUp ? { scale: CARD_MOTION.tapScale } : undefined
      }
      transition={{
        opacity: { duration: 0.2 },
        scale: { type: 'spring', stiffness: 360, damping: 24 },
        y: {
          repeat: isComparing ? Infinity : 0,
          duration: CARD_MOTION.comparingPulseDurationSeconds,
        },
      }}
    >
      <span className="relative block h-full w-full [perspective:900px]">
        <motion.span
          className="absolute inset-0 block h-full w-full rounded-2xl [transform-style:preserve-3d]"
          // Flips the card from the blue back to the symbol face.
          animate={{ rotateY: isFaceUp ? 180 : 0 }}
          transition={{
            duration: CARD_MOTION.flipDurationSeconds,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span
            className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl border-4 text-5xl font-bold shadow-[var(--shadow-card)] [backface-visibility:hidden] md:text-6xl"
            style={{
              backfaceVisibility: 'hidden',
              background: CARD_COLORS.backBackground,
              borderColor: CARD_COLORS.backBorder,
              color: CARD_COLORS.backText,
            }}
          >
            ?
          </span>

          <span
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-4 px-3 shadow-[var(--shadow-card)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{
              backfaceVisibility: 'hidden',
              background: card.isMatched
                ? 'var(--color-card-matched-bg)'
                : CARD_COLORS.frontBackground,
              borderColor: card.isMatched
                ? 'var(--color-card-matched-border)'
                : CARD_COLORS.frontBorder,
              transform: 'rotateY(180deg)',
            }}
          >
            <img
              src={cardImages[card.symbol]}
              alt=""
              aria-hidden="true"
              className="h-3/5 w-3/5 object-contain"
              draggable={false}
            />
            {isCardLabelEnabled && (
              <span
                className="absolute bottom-0 w-full px-2 pb-1 text-center text-lg font-bold capitalize leading-none sm:pb-2 sm:text-xl"
                style={{
                  background: 'var(--color-card-label-bg)',
                  color: 'var(--color-card-label-text)',
                }}
              >
                {translatedSymbol}
              </span>
            )}
          </span>
        </motion.span>

        {isComparing && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              boxShadow: `0 0 0 4px ${CARD_COLORS.comparingRing}, 0 0 22px ${CARD_COLORS.comparingGlow}`,
            }}
            // Pulsing ring marks the two cards currently being compared.
            animate={{ opacity: [0.35, 0.9, 0.35] }}
            transition={{
              repeat: Infinity,
              duration: CARD_MOTION.comparingRingDurationSeconds,
            }}
          />
        )}

        {isWaiting && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ background: CARD_COLORS.waitingOverlay }}
            initial={{ opacity: 0 }}
            // Shimmer over unavailable cards while the board is locked.
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{
              repeat: Infinity,
              duration: CARD_MOTION.waitingShimmerDurationSeconds,
            }}
          />
        )}
      </span>
    </motion.button>
  );
};
