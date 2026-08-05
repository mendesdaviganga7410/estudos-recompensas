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

describe('window.LEVELS', () => {
  it('has 80 levels', () => {
    expect(window.LEVELS.length).toBe(80);
  });

  it('first level is Nível 1 with min 0 and Semente rank', () => {
    expect(window.LEVELS[0].name).toBe('Nível 1');
    expect(window.LEVELS[0].min).toBe(0);
    expect(window.LEVELS[0].rank).toBe('Semente');
  });

  it('every level has a reward label', () => {
    window.LEVELS.forEach((lvl, i) => {
      expect(lvl.reward).toBe(`Recompensa ${i + 1}`);
    });
  });

  it('level 40 (antigo máximo de 45.000 XP) começa em ~45.024', () => {
    expect(window.LEVELS[39].min).toBeGreaterThan(44000);
    expect(window.LEVELS[39].min).toBeLessThan(46000);
  });

  it('last level is Nível 80 with max Infinity', () => {
    const last = window.LEVELS[window.LEVELS.length - 1];
    expect(last.name).toBe('Nível 80');
    expect(last.max).toBe(Infinity);
  });

  it('thresholds are strictly increasing', () => {
    for (let i = 1; i < window.LEVELS.length; i++) {
      expect(window.LEVELS[i].min).toBeGreaterThan(window.LEVELS[i - 1].min);
    }
  });

  it('getLevelInfo returns correct level for sample XP', () => {
    expect(window.getLevelInfo(0).level.name).toBe('Nível 1');
    expect(window.getLevelInfo(45024).level.name).toBe('Nível 40');
    expect(window.getLevelInfo(1e9).level.name).toBe('Nível 80');
    expect(window.getLevelInfo(1e9).next).toBeNull();
  });
});
