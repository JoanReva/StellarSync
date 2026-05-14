import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../Common/Button";
import { ScoreboardButton } from "../Common/ScoreboardButton";
import { ScoreboardModal } from "../Common/ScoreboardModal";
import { SettingsControls } from "../Settings/SettingsControls";
import { useAudio } from "../../hooks/useAudio";
import { useTranslation } from "../../store/useI18nStore";

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const { play } = useAudio();
  const { t } = useTranslation();

  useEffect(() => {
    startButtonRef.current?.focus();
  }, []);

  const handleStart = () => {
    play("start");
    onStart();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16 sm:py-24">
      <SettingsControls
        extraControl={
          <ScoreboardButton
            isOpen={isLeaderboardVisible}
            onClick={() => setIsLeaderboardVisible(true)}
          />
        }
        showMute={false}
      />

      <div className="flex w-full max-w-sm flex-col items-center gap-8 px-6 py-8 sm:gap-10">
        <motion.div
          initial={{ y: "-100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <div className="rounded-full bg-gradient-to-tr from-logo-grad-start via-logo-grad-mid to-logo-grad-end p-1.5 shadow-logo-glow">
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white p-5 md:h-44 md:w-44 md:p-6">
              <img
                src="/logo.svg"
                alt={t("gameLogo")}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 2 } }}
          className="flex flex-col items-center"
        >
          <h1 className="text-center text-5xl font-bold text-white drop-shadow-md sm:text-6xl md:text-7xl">
            {t("stellarSync")}
          </h1>
          <p className="mt-3 text-center text-lg font-bold uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-subtitle-grad-start via-subtitle-grad-mid to-subtitle-grad-end drop-shadow-sm sm:text-xl">
            {t("memorySubtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 100,
            delay: 0.5,
          }}
        >
          <Button
            ref={startButtonRef}
            className="min-w-44"
            onClick={handleStart}
            size="lg"
          >
            {t("start")}
          </Button>
        </motion.div>
      </div>

      <ScoreboardModal
        isOpen={isLeaderboardVisible}
        onClose={() => setIsLeaderboardVisible(false)}
      />
    </div>
  );
};
