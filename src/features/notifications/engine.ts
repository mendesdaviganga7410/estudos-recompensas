// @ts-nocheck
let __notifications = [];
let __unreadCount = 0;
let __panelOpen = false;
let __refreshTimer = null;
let __diagnosticAnswered = false;
let __persistentDiagNotif = null;
let __cachedMatches = [];
let __lastGenTime = 0;
const __NOTIF_STORAGE_KEY = 'neuroflow_notifs_v1';

function __saveNotifs() {
    try {
        localStorage.setItem(__NOTIF_STORAGE_KEY, JSON.stringify({
            notifications: __notifications,
            unreadCount: __unreadCount,
            lastGenTime: __lastGenTime
        }));
    } catch { /* ignore */ }
}

function __loadNotifs() {
    try {
        const raw = localStorage.getItem(__NOTIF_STORAGE_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            __notifications = data.notifications || [];
            __unreadCount = data.unreadCount || 0;
            __lastGenTime = data.lastGenTime || 0;
            return true;
        }
    } catch { /* ignore */ }
    return false;
}

function calcAgeGroup(birthYear) {
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

function arraysIntersect(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    return a.some(v => b.includes(v));
}

function calcMatch(myD, otherD) {
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

function calcProximity(myD, otherD) {
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

async function refreshNotifications() {
    if (!window.currentUser || !window.fetchPublicProfiles) return;

    const myD = window.state && window.state.diagnostic;
    if (!myD) {
        __cachedMatches = [];
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

        __cachedMatches = matches;
    } catch (err) {
        console.warn("Notif refresh error:", err);
    }
}

function generateOneNotification() {
    if (!window.currentUser || !hasDiagnostic()) return;

    let pool = __cachedMatches;

    if (pool.length === 0) return;

    // Remove notificações não-persistentes anteriores (apenas 1 por vez)
    __notifications = __notifications.filter(n => n.persistent);

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

    __notifications.unshift({
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
    __lastGenTime = Date.now();
    __unreadCount = __notifications.filter(n => !n.seen).length;
    renderNotificationBadge();
    __saveNotifs();
    if (__panelOpen && $n("notif-panel")) { $n("notif-panel").remove(); openNotificationPanel(); }
}

/* ---- PERSISTENT DIAGNOSTIC NOTIFICATION ---- */

function initPersistentDiagNotif() {
    if (!hasDiagnostic() || !window.currentUser) {
        __persistentDiagNotif = null;
        __notifications = __notifications.filter(n => n.id !== 'diag-persistent');
        return;
    }
    const existing = __notifications.find(n => n.id === 'diag-persistent');
    if (existing) {
        __persistentDiagNotif = existing;
        return;
    }
    __persistentDiagNotif = {
        id: 'diag-persistent',
        type: 'diagnosis',
        avatar: '',
        text: '📋 Meu Diagnóstico de Perfil — clique para ver ou editar seus dados',
        time: Date.now(),
        seen: true,
        persistent: true
    };
    __notifications.push(__persistentDiagNotif);
}

function getPersistentDiagNotif() {
    return __notifications.find(n => n.id === 'diag-persistent') || null;
}

function markPersistentDiagSeen() {
    const diag = __notifications.find(n => n.id === 'diag-persistent');
    if (diag) {
        diag.seen = true;
        renderNotificationBadge();
    }
}

function clearAllNotifications() {
    __notifications = __notifications.filter(n => n.persistent);
    __unreadCount = __notifications.filter(n => !n.seen).length;
    __lastGenTime = 0;
    __saveNotifs();
    renderNotificationBadge();
    if (__panelOpen && $n("notif-panel")) {
        $n("notif-panel").remove();
        openNotificationPanel();
    }
}
