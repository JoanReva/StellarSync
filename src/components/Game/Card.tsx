import { motion } from 'framer-motion';
import cometUrl from '../../assets/cards/comet.svg';
import moonUrl from '../../assets/cards/moon.svg';
import starUrl from '../../assets/cards/star.svg';
import sunUrl from '../../assets/cards/sun.svg';
import type { CardSymbol, MemoryCard } from '../../store/useGameStore';
import { CARD_ANIMATION_CONFIG, CARD_THEME_CONFIG } from '../../utils/constants';

type CardProps = {
  card: MemoryCard;
  isDisabled: boolean;
  isComparing: boolean;
  isWaiting: boolean;
  onSelect: (cardId: string) => void;
};

const cardImages: Record<CardSymbol, string> = {
  star: starUrl,
  moon: moonUrl,
  sun: sunUrl,
  comet: cometUrl,
};

const cardLabels: Record<CardSymbol, string> = {
  star: 'star',
  moon: 'moon',
  sun: 'sun',
  comet: 'comet',
};

export const Card = ({
  card,
  isDisabled,
  isComparing,
  isWaiting,
  onSelect,
}: CardProps) => {
  const isFaceUp = card.isFlipped || card.isMatched;
  const label = isFaceUp
    ? `${cardLabels[card.symbol]} card${card.isMatched ? ', matched' : ''}`
    : 'Reveal card';

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
        opacity: isWaiting ? CARD_ANIMATION_CONFIG.waitingOpacity : 1,
        scale: isWaiting ? CARD_ANIMATION_CONFIG.waitingScale : 1,
        y: isComparing ? [...CARD_ANIMATION_CONFIG.comparingPulseY] : 0,
      }}
      // Face-down cards lift on hover to show they are clickable.
      whileHover={
        !isDisabled && !isFaceUp
          ? { y: CARD_ANIMATION_CONFIG.hoverLiftY }
          : undefined
      }
      // Small press animation when the player clicks a selectable card.
      whileTap={
        !isDisabled && !isFaceUp
          ? { scale: CARD_ANIMATION_CONFIG.tapScale }
          : undefined
      }
      transition={{
        opacity: { duration: 0.2 },
        scale: { type: 'spring', stiffness: 360, damping: 24 },
        y: {
          repeat: isComparing ? Infinity : 0,
          duration: CARD_ANIMATION_CONFIG.comparingPulseDurationSeconds,
        },
      }}
    >
      <span className="relative block h-full w-full [perspective:900px]">

        <motion.span
          className="absolute inset-0 block h-full w-full rounded-2xl [transform-style:preserve-3d]"
          // Flips the card from the blue back to the symbol face.
          animate={{ rotateY: isFaceUp ? 180 : 0 }}
          transition={{
            duration: CARD_ANIMATION_CONFIG.flipDurationSeconds,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span
            className="absolute inset-0 flex items-center justify-center rounded-2xl border-4 text-5xl font-bold shadow-xl [backface-visibility:hidden] md:text-6xl"
            style={{
              backfaceVisibility: 'hidden',
              background: CARD_THEME_CONFIG.backBackground,
              borderColor: CARD_THEME_CONFIG.backBorder,
              color: CARD_THEME_CONFIG.backText,
            }}
          >
            ?
          </span>

          <span
            className="absolute inset-0 flex items-center justify-center rounded-2xl border-4 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{
              backfaceVisibility: 'hidden',
              background: CARD_THEME_CONFIG.frontBackground,
              borderColor: CARD_THEME_CONFIG.frontBorder,
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
          </span>
        </motion.span>

        {isComparing && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ boxShadow: `0 0 0 4px ${CARD_THEME_CONFIG.comparingRing}` }}
            // Pulsing ring marks the two cards currently being compared.
            animate={{ opacity: [0.35, 0.9, 0.35] }}
            transition={{
              repeat: Infinity,
              duration: CARD_ANIMATION_CONFIG.comparingRingDurationSeconds,
            }}
          />
        )}

        {isWaiting && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ background: CARD_THEME_CONFIG.waitingOverlay }}
            initial={{ opacity: 0 }}
            // Shimmer over unavailable cards while the board is locked.
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{
              repeat: Infinity,
              duration: CARD_ANIMATION_CONFIG.waitingShimmerDurationSeconds,
            }}
          />
        )}
      </span>
    </motion.button>
  );
};
