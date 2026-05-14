import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePreventPageUnload } from '../src/hooks/usePreventPageUnload';

type HarnessProps = {
  isBlocked: boolean;
};

const Harness = ({ isBlocked }: HarnessProps) => {
  usePreventPageUnload(isBlocked);
  return null;
};

const dispatchBeforeUnload = () => {
  const event = new Event('beforeunload', { cancelable: true });

  return window.dispatchEvent(event);
};

describe('usePreventPageUnload', () => {
  it('prevents page unload while blocked', () => {
    render(<Harness isBlocked />);

    expect(dispatchBeforeUnload()).toBe(false);
  });

  it('allows page unload when unblocked', () => {
    const { rerender } = render(<Harness isBlocked />);

    rerender(<Harness isBlocked={false} />);

    expect(dispatchBeforeUnload()).toBe(true);
  });

  it('allows page unload when bypassed', () => {
    const BypassHarness = () => {
      usePreventPageUnload(true, { shouldBypass: () => true });
      return null;
    };

    render(<BypassHarness />);

    expect(dispatchBeforeUnload()).toBe(true);
  });
});
