// @ts-nocheck

function calculateNextReview(block, reviewSettings, difficulty, referenceDate) {
    if (!reviewSettings) {
        reviewSettings = { intervals: [1, 3, 7, 15, 30], easeFactorMultiplier: 1.0 };
    }

    const intervals = reviewSettings.intervals;
    const ease = reviewSettings.easeFactorMultiplier || 1.0;
    let currentIndex = block.currentIntervalIndex || 0;
    let repetition = (block.repetition || 0) + 1;

    // Avança o índice baseado na dificuldade
    switch (difficulty) {
        case 'hard':
            // Repete o mesmo intervalo
            break;
        case 'medium':
            // Avança 1 intervalo
            currentIndex = Math.min(currentIndex + 1, intervals.length - 1);
            break;
        case 'easy':
            // Avança 2 intervalos (se disponível)
            currentIndex = Math.min(currentIndex + 2, intervals.length - 1);
            break;
        default:
            currentIndex = Math.min(currentIndex + 1, intervals.length - 1);
    }

    // Calcula os dias até a próxima revisão
    let daysUntilNext = intervals[currentIndex] || intervals[intervals.length - 1];

    // Aplica o multiplicador de facilidade
    daysUntilNext = Math.round(daysUntilNext * ease);

    // Garante no mínimo 1 dia
    daysUntilNext = Math.max(1, daysUntilNext);

    // Para blocos atrasados, usa a data originalmente agendada como referência
    // para calcular o próximo intervalo (não a data atual)
    const baseDate = referenceDate || Date.now();
    const lastReviewDate = Date.now();
    const nextReviewDate = new Date(baseDate);
    nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilNext);

    // Determina o status baseado na data da próxima revisão
    let status;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextDate = new Date(nextReviewDate);
    nextDate.setHours(0, 0, 0, 0);

    if (nextDate <= today) {
        status = 'due';
    } else {
        status = 'pending';
    }

    return {
        lastReviewDate: lastReviewDate,
        nextReviewDate: nextReviewDate.getTime(),
        currentIntervalIndex: currentIndex,
        repetition: repetition,
        status: status
    };
}

function updateBlocksStatus() {
    const blocks = window.state.studyBlocks;
    if (!blocks || blocks.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    let changed = false;
    blocks.forEach(block => {
        if (block.status === 'completed') return;

        const nextDate = new Date(block.nextReviewDate);
        nextDate.setHours(0, 0, 0, 0);
        const nextMs = nextDate.getTime();

        let newStatus;
        if (nextMs < todayMs) {
            newStatus = 'overdue';
        } else if (nextMs === todayMs) {
            newStatus = 'due';
        } else {
            newStatus = 'pending';
        }

        if (newStatus !== block.status) {
            block.status = newStatus;
            changed = true;
        }
    });

    if (changed) {
        window.saveState();
        window.generateReviewNotif?.();
    }
}

window.calculateNextReview = calculateNextReview;
window.updateBlocksStatus = updateBlocksStatus;
