import { describe, it, expect, afterEach, vi } from 'vitest';

import '../shared/templates/templates';
import '../core/state';

afterEach(() => {
  vi.useRealTimers();
});

describe('getLocalDateStr', () => {
  it('formats date as YYYY-MM-DD', () => {
    expect(window.getLocalDateStr(new Date(2026, 0, 1))).toBe('2026-01-01');
    expect(window.getLocalDateStr(new Date(2026, 11, 25))).toBe('2026-12-25');
    expect(window.getLocalDateStr(new Date(2026, 5, 5))).toBe('2026-06-05');
  });

  it('pads single-digit months and days', () => {
    expect(window.getLocalDateStr(new Date(2026, 0, 1))).toBe('2026-01-01');
    expect(window.getLocalDateStr(new Date(2026, 8, 3))).toBe('2026-09-03');
  });

  it('handles year boundaries', () => {
    expect(window.getLocalDateStr(new Date(2025, 11, 31))).toBe('2025-12-31');
    expect(window.getLocalDateStr(new Date(2026, 0, 1))).toBe('2026-01-01');
  });
});

describe('getTodayStr', () => {
  it('returns today in YYYY-MM-DD', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 25));
    expect(window.getTodayStr()).toBe('2026-06-25');
  });
});

describe('getYesterdayStr', () => {
  it('returns yesterday in YYYY-MM-DD', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 25));
    expect(window.getYesterdayStr()).toBe('2026-06-24');
  });

  it('handles month boundaries', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1));
    expect(window.getYesterdayStr()).toBe('2025-12-31');
  });

  it('handles year boundaries', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 0, 1));
    expect(window.getYesterdayStr()).toBe('2024-12-31');
  });
});

describe('getWeekStr', () => {
  it('returns ISO week 1 for dates belonging to first week', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1));
    const result = window.getWeekStr(new Date(2026, 0, 1));
    expect(result).toBe('2026-W01');
  });

  it('week belongs to the year of its Thursday', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1));
    const result = window.getWeekStr(new Date(2025, 11, 29));
    expect(result).toBe('2026-W01');
  });

  it('returns correct week for mid-year date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 25));
    const result = window.getWeekStr(new Date(2026, 5, 25));
    expect(result).toBe('2026-W26');
  });

  it('handles December dates in week 53', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 11, 31));
    const result = window.getWeekStr(new Date(2026, 11, 31));
    expect(result).toBe('2026-W53');
  });
});
