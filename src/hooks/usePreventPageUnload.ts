import { useEffect, useRef } from 'react';

type PreventPageUnloadOptions = {
  shouldBypass?: () => boolean;
};

export const usePreventPageUnload = (
  isBlocked: boolean,
  options: PreventPageUnloadOptions = {},
) => {
  const shouldBypassRef = useRef(options.shouldBypass);

  useEffect(() => {
    shouldBypassRef.current = options.shouldBypass;
  }, [options.shouldBypass]);

  useEffect(() => {
    if (!isBlocked) {
      return undefined;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldBypassRef.current?.()) {
        return;
      }

      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isBlocked]);
};
