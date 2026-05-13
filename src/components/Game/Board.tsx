import { Card } from './Card';
import { useGameStore } from '../../store/useGameStore';

export const Board = () => {
  const cards = useGameStore((state) => state.cards);
  const isBoardLocked = useGameStore((state) => state.isBoardLocked);
  const selectedCardIds = useGameStore((state) => state.selectedCardIds);
  const selectCard = useGameStore((state) => state.selectCard);

  return (
    <section
      aria-label="Memory cards"
      aria-busy={isBoardLocked}
      className="grid w-full max-w-3xl grid-cols-2 gap-4 px-5 sm:grid-cols-4 sm:gap-5 md:gap-6"
    >
      {cards.map((card) => {
        const isSelected = selectedCardIds.includes(card.id);
        const isWaiting =
          isBoardLocked && !isSelected && !card.isMatched && !card.isFlipped;

        return (
          <Card
            key={card.id}
            card={card}
            isDisabled={isBoardLocked || card.isFlipped || card.isMatched}
            isComparing={isBoardLocked && isSelected}
            isWaiting={isWaiting}
            onSelect={selectCard}
          />
        );
      })}
    </section>
  );
};
