import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import '../shared/templates/templates';
import '../core/state';

beforeEach(() => {
  vi.useFakeTimers();
  window.state.dailyLog = {};
});

afterEach(() => {
  vi.useRealTimers();
});

describe('calcStreak', () => {
  it('returns 0 when no dailyLog entries exist', () => {
    vi.setSystemTime(new Date(2026, 5, 25));
    expect(window.calcStreak()).toBe(0);
  });

  it('counts today as part of streak if completed', () => {
    vi.setSystemTime(new Date(2026, 5, 25));
    window.state.dailyLog['2026-06-25'] = ['d1'];
    expect(window.calcStreak()).toBe(1);
  });

  it('counts consecutive days from today backward', () => {
    vi.setSystemTime(new Date(2026, 5, 25));
    window.state.dailyLog['2026-06-25'] = ['d1'];
    window.state.dailyLog['2026-06-24'] = ['d1'];
    window.state.dailyLog['2026-06-23'] = ['d1'];
    expect(window.calcStreak()).toBe(3);
  });

  it('does not break when today is empty but yesterday has entries', () => {
    vi.setSystemTime(new Date(2026, 5, 25));
    window.state.dailyLog['2026-06-24'] = ['d1'];
    window.state.dailyLog['2026-06-23'] = ['d1'];
    expect(window.calcStreak()).toBe(2);
  });

  it('breaks when a day in the middle has no entries', () => {
    vi.setSystemTime(new Date(2026, 5, 25));
    window.state.dailyLog['2026-06-25'] = ['d1'];
    window.state.dailyLog['2026-06-23'] = ['d1'];
    expect(window.calcStreak()).toBe(1);
  });

  it('breaks when a day in the middle has empty array', () => {
    vi.setSystemTime(new Date(2026, 5, 25));
    window.state.dailyLog['2026-06-25'] = ['d1'];
    window.state.dailyLog['2026-06-24'] = [];
    window.state.dailyLog['2026-06-23'] = ['d1'];
    expect(window.calcStreak()).toBe(1);
  });

  it('handles month boundaries correctly', () => {
    vi.setSystemTime(new Date(2026, 0, 2));
    window.state.dailyLog['2026-01-02'] = ['d1'];
    window.state.dailyLog['2026-01-01'] = ['d1'];
    window.state.dailyLog['2025-12-31'] = ['d1'];
    expect(window.calcStreak()).toBe(3);
  });

  it('stops at 365 days max', () => {
    vi.setSystemTime(new Date(2026, 5, 25));
    for (let i = 0; i < 400; i++) {
      const d = new Date(2026, 5, 25);
      d.setDate(d.getDate() - i);
      const key = window.getLocalDateStr(d);
      window.state.dailyLog[key] = ['d1'];
    }
    expect(window.calcStreak()).toBe(365);
  });
});
