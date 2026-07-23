// @ts-nocheck
import { hasDiagnostic } from './diagnostic-ui.ts';
import {
  COURSE_LABELS, COURSE_AREA_LABELS, UNI_TYPE_LABELS, EXAM_ATTEMPTED_LABELS,
  CONTEST_LEVEL_LABELS, CONTEST_AREA_LABELS, ALREADY_CIVIL_LABELS, WORK_SECTOR_LABELS,
  PROFESSION_LABELS, CAREER_GOAL_LABELS, BODY_GOAL_LABELS, TRAINING_FREQ_LABELS,
  PERSONAL_INTEREST_LABELS, CHALLENGE_LABELS, STUDY_HOURS_LABELS, STUDY_PERIOD_LABELS,
  STUDY_METHOD_LABELS, EDU_LEVEL_LABELS
} from './diagnostic-data.ts';
import { MESSAGE_GENERATORS } from './messages.ts';
import { renderNotificationBadge, openNotificationPanel, closeNotificationPanel, tierName, displayName, avatarUrl } from './ui.ts';

const $n = id => document.getElementById(id);

export const notifState = {
  __notifications: [],
  __unreadCount: 0,
  __panelOpen: false,
  __refreshTimer: null,
  __diagnosticAnswered: false,
  __persistentDiagNotif: null,
  __cachedMatches: [],
  __lastGenTime: 0,
  __NOTIF_STORAGE_KEY: 'neuroflow_notifs_v1',
};

export function __saveNotifs() {
    try {
        localStorage.setItem(notifState.__NOTIF_STORAGE_KEY, JSON.stringify({
            notifications: notifState.__notifications,
            unreadCount: notifState.__unreadCount,
            lastGenTime: notifState.__lastGenTime
        }));
    } catch { /* ignore */ }
}

export function __loadNotifs() {
    try {
        const raw = localStorage.getItem(notifState.__NOTIF_STORAGE_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            notifState.__notifications = data.notifications || [];
            notifState.__unreadCount = data.unreadCount || 0;
            notifState.__lastGenTime = data.lastGenTime || 0;
            return true;
        }
    } catch { /* ignore */ }
    return false;
}

export function calcAgeGroup(birthYear) {
    if (!birthYear) return -1;
    const age = new Date().getFullYear() - Number(birthYear);
    if (isNaN(age) || age < 0) return -1;
    if (age <= 14) return 0;
    if (age <= 16) return 1;
    if (age <= 18) return 2;
    if (age <= 22) return 3;
    if (age <= 27) return 4;
    if (age <= 35) return 5;
    return 6;
}

export function arraysIntersect(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    return a.some(v => b.includes(v));
}

export function calcMatch(myD, otherD) {
    const m = {};
    if (!myD || !otherD) return m;

    if (myD.focusAreas && otherD.focusAreas) {
        const matches = Array.isArray(myD.focusAreas) && Array.isArray(otherD.focusAreas)
            ? myD.focusAreas.filter(v => otherD.focusAreas.includes(v))
            : [];
        if (matches.length > 0) {
            m.focusMatch = true;
            m.focusMatches = matches;
        }
    }

    if (myD.targetCourse && myD.targetCourse === otherD.targetCourse) {
        m.sameCourse = true;
        m.courseLbl = COURSE_LABELS[myD.targetCourse] || myD.targetCourse;
    }
    if (!m.sameCourse && myD.courseArea && myD.courseArea === otherD.courseArea) {
        m.sameCourseArea = true;
        m.courseAreaLbl = COURSE_AREA_LABELS[myD.courseArea] || myD.courseArea;
    }

    if (myD.uniType && myD.uniType === otherD.uniType) {
        m.sameUniType = true;
        m.uniTypeLbl = UNI_TYPE_LABELS[myD.uniType] || myD.uniType;
    }

    if (myD.examAttempted && myD.examAttempted === otherD.examAttempted) {
        m.sameExamStatus = true;
        m.examStatusLbl = EXAM_ATTEMPTED_LABELS[myD.examAttempted] || myD.examAttempted;
    }

    if (myD.contestLevel && myD.contestLevel === otherD.contestLevel) {
        m.sameContestLevel = true;
        m.contestLevelLbl = CONTEST_LEVEL_LABELS[myD.contestLevel] || myD.contestLevel;
    }
    if (myD.contestArea && myD.contestArea === otherD.contestArea) {
        m.sameContestArea = true;
        m.contestAreaLbl = CONTEST_AREA_LABELS[myD.contestArea] || myD.contestArea;
    }
    if (myD.alreadyCivilServant && myD.alreadyCivilServant === otherD.alreadyCivilServant) {
        m.sameCivilStatus = true;
        m.civilStatusLbl = ALREADY_CIVIL_LABELS[myD.alreadyCivilServant] || myD.alreadyCivilServant;
    }

    if (myD.workSector && myD.workSector === otherD.workSector) {
        m.sameWorkSector = true;
        m.workSectorLbl = WORK_SECTOR_LABELS[myD.workSector] || myD.workSector;
    }
    if (myD.targetProfession && myD.targetProfession === otherD.targetProfession) {
        m.sameProfession = true;
        m.professionLbl = PROFESSION_LABELS[myD.targetProfession] || myD.targetProfession;
    }
    if (myD.careerGoal && myD.careerGoal === otherD.careerGoal) {
        m.sameCareerGoal = true;
        m.careerGoalLbl = CAREER_GOAL_LABELS[myD.careerGoal] || myD.careerGoal;
    }

    if (myD.bodyGoal && myD.bodyGoal === otherD.bodyGoal) {
        m.sameBodyGoal = true;
        m.bodyGoalLbl = BODY_GOAL_LABELS[myD.bodyGoal] || myD.bodyGoal;
    }
    if (myD.trainingFreq && myD.trainingFreq === otherD.trainingFreq) {
        m.sameTrainingFreq = true;
        m.trainingFreqLbl = TRAINING_FREQ_LABELS[myD.trainingFreq] || myD.trainingFreq;
    }

    if (myD.personalInterest && myD.personalInterest === otherD.personalInterest) {
        m.sameInterest = true;
        m.interestLbl = PERSONAL_INTEREST_LABELS[myD.personalInterest] || myD.personalInterest;
    }

    if (myD.mainChallenge && myD.mainChallenge === otherD.mainChallenge) {
        m.sameChallenge = true;
        m.challengeLbl = CHALLENGE_LABELS[myD.mainChallenge] || myD.mainChallenge;
    }
    if (myD.studyHours && myD.studyHours === otherD.studyHours) {
        m.sameStudyHours = true;
        m.studyHoursLbl = STUDY_HOURS_LABELS[myD.studyHours] || myD.studyHours;
    }
    if (myD.studyPeriod && myD.studyPeriod === otherD.studyPeriod) {
        m.samePeriod = true;
        m.periodLbl = STUDY_PERIOD_LABELS[myD.studyPeriod] || myD.studyPeriod;
    }
    if (myD.studyMethod && myD.studyMethod === otherD.studyMethod) {
        m.sameMethod = true;
        m.methodLbl = STUDY_METHOD_LABELS[myD.studyMethod] || myD.studyMethod;
    }
    if (myD.eduLevel && myD.eduLevel === otherD.eduLevel) {
        m.sameEduLevel = true;
        m.eduLevelLbl = EDU_LEVEL_LABELS[myD.eduLevel] || myD.eduLevel;
    }

    if (myD.birthYear && otherD.birthYear) {
        const myAge = calcAgeGroup(myD.birthYear);
        const otherAge = calcAgeGroup(otherD.birthYear);
        if (myAge >= 0 && myAge === otherAge) {
            m.ageMatch = true;
        }
    }

    return m;
}

export function calcProximity(myD, otherD) {
    let score = 0;
    if (!myD || !otherD) return score;

    if (myD.focusAreas && otherD.focusAreas && arraysIntersect(myD.focusAreas, otherD.focusAreas)) score += 15;
    if (myD.targetCourse && myD.targetCourse === otherD.targetCourse) score += 30;
    if (myD.courseArea && myD.courseArea === otherD.courseArea) score += 8;
    if (myD.uniType && myD.uniType === otherD.uniType) score += 10;
    if (myD.examAttempted && myD.examAttempted === otherD.examAttempted) score += 5;
    if (myD.contestLevel && myD.contestLevel === otherD.contestLevel) score += 12;
    if (myD.contestArea && myD.contestArea === otherD.contestArea) score += 12;
    if (myD.alreadyCivilServant && myD.alreadyCivilServant === otherD.alreadyCivilServant) score += 5;
    if (myD.workSector && myD.workSector === otherD.workSector) score += 10;
    if (myD.targetProfession && myD.targetProfession === otherD.targetProfession) score += 20;
    if (myD.careerGoal && myD.careerGoal === otherD.careerGoal) score += 12;
    if (myD.bodyGoal && myD.bodyGoal === otherD.bodyGoal) score += 15;
    if (myD.trainingFreq && myD.trainingFreq === otherD.trainingFreq) score += 8;
    if (myD.personalInterest && myD.personalInterest === otherD.personalInterest) score += 8;
    if (myD.mainChallenge && myD.mainChallenge === otherD.mainChallenge) score += 15;
    if (myD.studyHours && myD.studyHours === otherD.studyHours) score += 10;
    if (myD.studyPeriod && myD.studyPeriod === otherD.studyPeriod) score += 5;
    if (myD.studyMethod && myD.studyMethod === otherD.studyMethod) score += 8;
    if (myD.eduLevel && myD.eduLevel === otherD.eduLevel) score += 8;

    if (myD.birthYear && otherD.birthYear) {
        const myAge = calcAgeGroup(myD.birthYear);
        const otherAge = calcAgeGroup(otherD.birthYear);
        if (myAge >= 0 && myAge === otherAge) score += 15;
    }

    return score;
}

export async function refreshNotifications() {
    if (!window.currentUser || !window.fetchPublicProfiles) return;

    const myD = window.state && window.state.diagnostic;
    if (!myD) {
        notifState.__cachedMatches = [];
        return;
    }

    try {
        const profiles = await window.fetchPublicProfiles(80);
        const myXp = window.state.xp || 0;
        const myPts = window.state.pts || 0;
        const myTier = (window.TIERS || []).findIndex(t => myXp >= t.min && myXp <= t.max);
        const myUid = window.currentUser.uid;

        const matches = profiles
            .filter(p => p.uid !== myUid && p.diagnostic)
            .map(p => {
                const xp = p.xp || 0;
                const pts = p.pts || p.pontos || 0;
                const profile = p.profile || {};
                const otherD = p.diagnostic;

                const match = calcMatch(myD, otherD);
                const proximity = calcProximity(myD, otherD);

                const diff = xp - myXp;
                const overtake = diff > 0 && diff < 500;
                const approach = diff > -200 && diff <= 0 && diff > -500;
                const consistent = proximity >= 30 && Math.random() > 0.5;
                const ptsDiff = Math.abs(pts - myPts);
                const ptsAhead = pts > myPts && ptsDiff > 0;
                const ptsBehind = myPts > pts && ptsDiff > 0;
                const sameTier = myTier >= 0 && (() => {
                    const ot = (window.TIERS || []).findIndex(t => xp >= t.min && xp <= t.max);
                    return ot === myTier;
                })();
                const higherTier = !sameTier && xp > myXp;
                const lowerTier = !sameTier && xp < myXp;
                const tierLbl = tierName(xp);

                const slots = p.slots || {};
                const allSlots = Object.values(slots).flat ? Object.values(slots).flat() : [];
                const courses = allSlots.filter(s => s && s.text).map(s => s.text);

                return Object.assign(match, {
                    user: p, name: displayName(profile, "Jogador"),
                    xp, pts, avatar: avatarUrl(p.uid, profile),
                    proximity, diff,
                    overtake, approach, consistent,
                    ptsAhead, ptsBehind, ptsDiff,
                    sameTier, higherTier, lowerTier, tierLbl,
                    course: courses[0] || "",
                    slots,
                    profile
                });
            })
            .sort((a, b) => b.proximity - a.proximity);

        notifState.__cachedMatches = matches;
    } catch (err) {
        console.warn("Notif refresh error:", err);
    }
}

export function generateOneNotification() {
    if (!window.currentUser || !hasDiagnostic()) return;

    let pool = notifState.__cachedMatches;

    if (pool.length === 0) return;

    // Remove notificações não-persistentes anteriores (apenas 1 por vez)
    notifState.__notifications = notifState.__notifications.filter(n => n.persistent);

    const match = pool[Math.floor(Math.random() * pool.length)];
    const shuffled = Array.from({ length: MESSAGE_GENERATORS.length }, (_, i) => i)
        .sort(() => Math.random() - 0.5);

    let text = null;
    for (const ti of shuffled) {
        const gen = MESSAGE_GENERATORS[ti];
        const result = gen(match, match);
        if (result) {
            text = result;
            break;
        }
    }

    if (!text) {
        text = `${match.name} está na comunidade focado em seus objetivos. Inspire-se!`;
    }

    notifState.__notifications.unshift({
        id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: 'general',
        uid: match.user.uid,
        userName: match.name,
        avatar: match.avatar,
        text,
        time: Date.now(),
        seen: false,
        persistent: false
    });
    notifState.__lastGenTime = Date.now();
    notifState.__unreadCount = notifState.__notifications.filter(n => !n.seen).length;
    renderNotificationBadge();
    __saveNotifs();
    if (notifState.__panelOpen && $n("notif-panel")) { $n("notif-panel").remove(); openNotificationPanel(); }
}

/* ---- PERSISTENT DIAGNOSTIC NOTIFICATION ---- */

export function initPersistentDiagNotif() {
    if (!hasDiagnostic() || !window.currentUser) {
        notifState.__persistentDiagNotif = null;
        notifState.__notifications = notifState.__notifications.filter(n => n.id !== 'diag-persistent');
        return;
    }
    const existing = notifState.__notifications.find(n => n.id === 'diag-persistent');
    if (existing) {
        notifState.__persistentDiagNotif = existing;
        return;
    }
    notifState.__persistentDiagNotif = {
        id: 'diag-persistent',
        type: 'diagnosis',
        avatar: '',
        text: '📋 Meu Diagnóstico de Perfil — clique para ver ou editar seus dados',
        time: Date.now(),
        seen: true,
        persistent: true
    };
    notifState.__notifications.push(notifState.__persistentDiagNotif);
}

export function getPersistentDiagNotif() {
    return notifState.__notifications.find(n => n.id === 'diag-persistent') || null;
}

export function markPersistentDiagSeen() {
    const diag = notifState.__notifications.find(n => n.id === 'diag-persistent');
    if (diag) {
        diag.seen = true;
        renderNotificationBadge();
    }
}

export function clearAllNotifications() {
    notifState.__notifications = notifState.__notifications.filter(n => n.persistent);
    notifState.__unreadCount = notifState.__notifications.filter(n => !n.seen).length;
    notifState.__lastGenTime = 0;
    __saveNotifs();
    renderNotificationBadge();
    if (notifState.__panelOpen && $n("notif-panel")) {
        $n("notif-panel").remove();
        openNotificationPanel();
    }
}

/* ---- PERSISTENT REVIEW NOTIFICATION ---- */

export function generateReviewNotif() {
    notifState.__notifications = notifState.__notifications.filter(n => n.id !== 'review-persistent');

    const blocks = window.state?.studyBlocks || [];
    const overdue = blocks.filter(b => b.status === 'overdue');
    const due = blocks.filter(b => b.status === 'due');

    if (overdue.length === 0 && due.length === 0) {
        notifState.__unreadCount = notifState.__notifications.filter(n => !n.seen).length;
        renderNotificationBadge();
        __saveNotifs();
        return;
    }

    let text;
    if (overdue.length > 0) {
        text = `🔴 ${overdue.length} bloco${overdue.length > 1 ? 's' : ''} de estudo atrasado${overdue.length > 1 ? 's' : ''}! Revise agora.`;
        if (due.length > 0) {
            text += ` (+${due.length} pendente${due.length > 1 ? 's' : ''})`;
        }
    } else {
        text = `🟠 ${due.length} bloco${due.length > 1 ? 's' : ''} para revisar hoje.`;
    }

    notifState.__notifications.unshift({
        id: 'review-persistent',
        type: 'review',
        avatar: '',
        text: text,
        time: Date.now(),
        seen: false,
        persistent: true
    });

    notifState.__unreadCount = notifState.__notifications.filter(n => !n.seen).length;
    renderNotificationBadge();
    __saveNotifs();
}

export function onReviewNotifClick() {
    closeNotificationPanel();
    const page = window.getCurrentPage ? window.getCurrentPage() : '';
    if (page !== 'review') {
        window.navigateTo('review.html');
    }
}
