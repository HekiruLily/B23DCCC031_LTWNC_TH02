import { describe, it, expect, beforeEach } from 'vitest';
import { useSavedStore } from './useSavedStore';

describe('useSavedStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSavedStore.setState({ ids: [] });
  });

  it('has empty ids initially', () => {
    expect(useSavedStore.getState().ids).toEqual([]);
  });

  it('toggles ids on and off', () => {
    const { toggle } = useSavedStore.getState();

    toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e1']);

    toggle('e2');
    expect(useSavedStore.getState().ids).toEqual(['e1', 'e2']);

    toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e2']);
  });

  it('persists to localStorage with key "workout-saved"', () => {
    const { toggle } = useSavedStore.getState();
    toggle('e1');
    toggle('e3');

    const stored = localStorage.getItem('workout-saved');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.ids).toEqual(['e1', 'e3']);
  });
});

