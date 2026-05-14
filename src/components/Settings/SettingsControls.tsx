import { AccessibilityMenu } from './AccessibilityMenu';
import { LanguageButton } from './LanguageButton';
import { MuteButton } from './MuteButton';

type SettingsControlsProps = {
  showMute?: boolean;
};

export const SettingsControls = ({ showMute = true }: SettingsControlsProps) => {
  return (
    <div className="absolute right-4 top-4 z-20 flex items-start gap-2 sm:right-5 sm:top-5">
      <LanguageButton />
      <AccessibilityMenu />
      {showMute && <MuteButton />}
    </div>
  );
};
