import type { ReactNode } from 'react';
import { AccessibilityMenu } from './AccessibilityMenu';
import { LanguageButton } from './LanguageButton';
import { MuteButton } from './MuteButton';

type SettingsControlsProps = {
  extraControl?: ReactNode;
  showMute?: boolean;
};

export const SettingsControls = ({
  extraControl,
  showMute = true,
}: SettingsControlsProps) => {
  return (
    <div className="absolute right-3 top-3 z-20 flex flex-row items-end gap-2 sm:right-5 sm:top-5 sm:flex-row sm:items-start">
      <LanguageButton />
      <AccessibilityMenu />
      {showMute && <MuteButton />}
      {extraControl}
    </div>
  );
};
