import { AccessibilityMenu } from './AccessibilityMenu';
import { MuteButton } from './MuteButton';

export const SettingsControls = () => {
  return (
    <div className="absolute right-4 top-4 z-20 flex items-start gap-2 sm:right-5 sm:top-5">
      <AccessibilityMenu />
      <MuteButton />
    </div>
  );
};
