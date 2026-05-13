import { Board } from '../Game/Board';

export const GameScreen = () => {
  return (
    <div className="flex w-full flex-col items-center gap-8 px-4">
      <Board />
    </div>
  );
};
