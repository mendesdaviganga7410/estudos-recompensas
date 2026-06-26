import { describe, it, expect } from 'vitest';

import '../shared/templates/templates';
import '../core/state';

describe('createDefaultState', () => {
  const fresh = window.createDefaultState();

  it('returns initial points and xp at 0', () => {
    expect(fresh.pts).toBe(0);
    expect(fresh.xp).toBe(0);
  });

  it('returns empty cooldowns', () => {
    expect(fresh.cd).toEqual({});
  });

  it('returns empty prefs', () => {
    expect(fresh.prefs).toEqual({});
  });

  it('returns profile with default fields', () => {
    expect(fresh.profile).toEqual({
      epicGoal: '',
      bannerUrl: '',
      displayName: '',
      description: '',
      public: false,
    });
  });

  it('returns stats with zeros', () => {
    expect(fresh.stats).toEqual({
      dailiesDone: 0,
      epicsDone: 0,
      purchases: 0,
      currentStreak: 0,
      maxStreak: 0,
    });
  });

  it('returns empty dailyLog, weeklyLog, lastDailyDate', () => {
    expect(fresh.dailyLog).toEqual({});
    expect(fresh.weeklyLog).toEqual({});
    expect(fresh.lastDailyDate).toBe('');
  });

  it('returns onboardingComplete as false', () => {
    expect(fresh.onboardingComplete).toBe(false);
  });

  it('returns slots with all 16 entries when cloneDefaultSlotText is available', () => {
    expect(fresh.slots).toBeDefined();
    expect(fresh.slots.dailies).toBeDefined();
    expect(Object.keys(fresh.slots.dailies).length).toBe(5);
    expect(fresh.slots.epics).toBeDefined();
    expect(Object.keys(fresh.slots.epics).length).toBe(3);
    expect(fresh.slots.shop).toBeDefined();
    expect(Object.keys(fresh.slots.shop).length).toBe(8);
  });
});

describe('window.TIERS', () => {
  it('has 12 tiers', () => {
    expect(window.TIERS.length).toBe(12);
  });

  it('first tier is Bronze with min 0', () => {
    expect(window.TIERS[0].name).toBe('Bronze');
    expect(window.TIERS[0].min).toBe(0);
  });

  it('last tier is Diamante Negro with max Infinity', () => {
    const last = window.TIERS[window.TIERS.length - 1];
    expect(last.name).toBe('Diamante Negro');
    expect(last.max).toBe(Infinity);
  });
});
