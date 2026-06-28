/* eslint-disable */

/* Augment DOM to match our project's non-strict usage pattern */
interface Document {
    getElementById(elementId: string): any;
}

interface Tier {
  name: string;
  min: number;
  max: number;
  i: string;
}

interface SlotEconomicsItem {
  id: string;
  name?: string;
  xp?: number;
  pts?: number;
  fXp?: number;
  cost?: number;
  cd?: number;
  type?: string;
  label?: string;
}

interface SlotEconomicsData {
  dailies: readonly SlotEconomicsItem[];
  epics: readonly SlotEconomicsItem[];
  shop: readonly SlotEconomicsItem[];
}

type SlotType = 'dailies' | 'epics' | 'shop';

interface SlotText {
  name: string;
  desc: string;
}

interface Slots {
  dailies: Record<string, SlotText>;
  epics: Record<string, SlotText>;
  shop: Record<string, SlotText>;
}

interface UserProfile {
  epicGoal?: string;
  displayName?: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  public?: boolean;
}

interface UserStats {
  dailiesDone: number;
  epicsDone: number;
  purchases: number;
  currentStreak: number;
  maxStreak: number;
}

interface UserPrefs {
  theme: string;
  radius?: string;
  shadow?: string;
  isAdmin?: boolean;
}

interface StudyBlock {
  id: string; // UUID
  userId: string;
  materia: string;
  topico: string;
  conteudo: string;
  createdAt: number;
  lastReviewDate: number;
  nextReviewDate: number;
  status: 'pending' | 'due' | 'overdue' | 'completed';
  reviewSettingsId?: string;
  currentIntervalIndex: number;
  repetition: number;
  color: string; // Adicionado: Cor associada ao bloco
}

interface ActiveReviewSetting {
  id: string;
  name: string;
  intervals: number[];
  easeFactorMultiplier: number;
}

interface AppState {
  pontos: number;
  pts: number;
  xp: number;
  cd: Record<string, number>;
  prefs: UserPrefs;
  profile: UserProfile;
  stats: UserStats;
  slots: Slots;
  diagnostic?: Record<string, unknown>;
  dailyLog: Record<string, string[]>;
  weeklyLog: Record<string, string[]>;
  lastDailyDate: string;
  activeReviewSetting: ActiveReviewSetting | null;
  onboardingComplete: boolean;
  updatedAt: number;
  studyBlocks: StudyBlock[];
}

interface MergedSlot {
  id: string;
  name: string;
  desc?: string;
  type?: string;
  label?: string;
  pts?: number;
  xp?: number;
  fXp?: number;
  cost?: number;
  cd?: number;
}

interface MergedLists {
  dailies: MergedSlot[];
  epics: MergedSlot[];
  shop: MergedSlot[];
}

interface Window {
  state: AppState;
  TIERS: Tier[];
  GUEST_STORAGE_KEY: string;
  isGuestMode: boolean;
  isAdmin: boolean;
  currentUser: Record<string, unknown> | null;
  DAILIES: MergedSlot[];
  EPICS: MergedSlot[];
  SHOP: MergedSlot[];
  SLOT_ECONOMICS: SlotEconomicsData;
  DEFAULT_SLOT_TEXT: Record<string, Record<string, { name: string; desc?: string }>>;
  SLOT_PRESETS: Record<string, Array<{ profile: string; name: string; desc?: string }>>;
  STARTER_PACKAGES: Record<string, Record<string, unknown>>;

  createDefaultState(): AppState;
  applyRemoteState(data: Partial<AppState>): void;
  saveState(): Promise<void> | void;
  getLocalDateStr(d: Date): string;
  saveGuestState(): void;
  loadGuestState(): AppState | null;
  getMergedLists(): MergedLists;
  ativarAdmin(): void;
  desativarAdmin(): void;
  getTodayStr(): string;
  getYesterdayStr(): string;
  getWeekStr(date: Date): string;
  calcStreak(): number;

  toast(msg: string, fail?: boolean, duration?: number): void;
  $(id: string): any;
  escapeHtml(str: string): string;

  openAuthModal(): void;
  closeAuthModal(): void;
  openSettingsModal(): void;
  openQuickDialog(id: string): void;
  closeQuickDialog(id: string): void;
  openQuickAvatarDialog(): void;
  openQuickBannerDialog(): void;

  applyPrefs(prefs: UserPrefs): void;
  changeTheme(name: string): void;
  changeRadius(val: string): void;
  changeShadow(val: string): void;
  selectTheme(name: string): void;
  openThemeDialog(): void;
  closeThemeDialog(): void;
  resetDefaults(): void;

  saveCroppedPhoto(): void;
  cancelCrop(): void;
  saveCroppedBanner(): void;
  cancelBannerCrop(): void;

  loginGoogle(): void;
  loginEmailAndPassword(email: string, password: string): void;
  registerEmailAndPassword(email: string, password: string): void;
  logoutGoogle(): void;
  updateUserProfileName(name: string): void;
  updateUserProfilePhoto(file: File): void;
  updateProfilePhotoUrl(url: string): void;
  updateUserProfileBanner(url: string): void;
  updateUserEmail(email: string): void;
  updateUserPassword(pass: string): void;
  sendPasswordReset(email: string): void;
  sendVerification(): void;

  syncUserData(uid: string): Promise<void>;
  saveStateToFirestore(uid: string, state: AppState, partial?: boolean): Promise<void>;
  completeOnboarding(uid: string, data: Partial<AppState>): Promise<void>;
  fetchPublicProfiles(max?: number): Promise<Record<string, unknown>[]>;
  saveStudySession(uid: string, session: Record<string, unknown>): Promise<void>;
  loadStudySessions(uid: string, max?: number): Promise<Record<string, unknown>[]>;
  deleteAllStudySessions(uid: string): Promise<void>;
  migrateStudySessions(uid: string): Promise<void>;
  saveStudyBlock(uid: string, block: StudyBlock): Promise<void>;
  loadStudyBlocks(uid: string): Promise<StudyBlock[]>;
  deleteStudyBlock(uid: string, blockId: string): Promise<void>;
  getActiveReviewSettings(): ActiveReviewSetting;
  renderReviewSettingsRow(): void;
  onPresetChange(): void;
  applyReviewSettings(): void;

  ROUTES: Record<string, string>;
  navigateTo(url: string): void;
  handleAuthRouting(): void;
  setGuestMode(bool: boolean): void;
  updateGuestUI(): void;
  renderGuestLanding(): void;
  enterGuestMode(): void;
  enterHeroHub(): void;
  enterPanel(): void;
  getCurrentPage(): string;
  isHubPage(): boolean;
  isPainelPage(): boolean;
  isStudyPage(): boolean;
        isComunidadePage(): boolean;
        isReviewPage(): boolean;

  renderHeroHub(): void;
  render(): void;
  task(id: string, type: SlotType, success: boolean): void;
  buy(id: string): void;
  enterMomentum(): void;
  exitMomentum(): void;
  momentumComplete(): void;
  momentumFail(): void;
  momentumActive: boolean;
  renderComunidade(): void;
  onCommunitySearch(): void;
  onCommunitySort(): void;
  renderReviewPage(): void;
  openAddBlockDialog(): void;
  closeAddBlockDialog(): void;
  addStudyBlock(): void;
  renderStudyBlocksList(): void;
  applyReviewFilters(): void;
  populateMateriaFilter(): void;
  updateReviewStats(): void;
  openReviewBlockDialog(blockId: string): void;
  closeReviewFeedbackDialog(): void;
  submitReviewFeedback(difficulty: string): void;
  deleteStudyBlockById(blockId: string): void;
  _reviewBlockId: string | null;
  calculateNextReview(block: StudyBlock, settings: ActiveReviewSetting, difficulty: string): Record<string, unknown>;
  updateBlocksStatus(): void;
  studyTimer: Record<string, unknown>;
  startOnboarding(): void;
  closeOnboarding(): void;

  buildMergedSlots(slots: Record<string, unknown>): MergedLists;
  cloneDefaultSlotText(): Record<string, unknown>;
  mergeSlotText(base: Record<string, unknown>, remote?: Record<string, unknown> | null): Record<string, unknown>;
  getWizardSteps(): unknown[];
  getDefaultText(category: string, id: string): { name: string; desc?: string };
  getSlotPresets(id: string): Array<{ profile: string; name: string; desc?: string }>;

  initNotifications(): void;
  refreshNotifications(): void;
  openNotificationPanel(): void;
  closeNotificationPanel(): void;
  clearAllNotifications(): void;
  deleteAllNotifications(): void;
  generateOneNotification(): void;
  generateReviewNotif(): void;
  onReviewNotifClick(): void;
  scheduleDiagReminder(): void;
  openDiagnosticDialog(): void;
  closeDiagnosticDialog(): void;
  submitDiagnostic(): void;
  resetAllDiagnostics(): void;
  openProfileModal(uid: string): void;
  closeProfileModal(): void;
  studyConfig: Record<string, unknown>;
  loadStudyConfig(): void;
  saveStudyConfig(): void;
  openStudyConfigDialog(): void;
  closeStudyConfigDialog(): void;
  renderStudyConfigDialog(): void;
  applyPomoPreset(focus: number, brk: number, cycles: number): void;
  applyTimerSize(): void;
  clearStudyHistory(): void;
  soundConfig: Record<string, unknown>;
  SOUND_PRESETS: Record<string, unknown>;
  saveSoundConfig(): void;
  playSound(group: string): void;
  _shopInterval: number | undefined;
  initQuickAvatarPicker(): void;
  initQuickBannerPicker(): void;
  adminAddPts(): void;
  adminAddXp(): void;
  adminSetPts(): void;
  adminSetXp(): void;
  adminResetAllCd(): void;
  adminResetCdType(): void;
  adminCompleteAllDailies(): void;
  adminFailAllDailies(): void;
  adminCompleteAllEpics(): void;
  adminFreeItem(): void;
  adminUnlockAllItems(): void;
  adminClearStudyHistory(): void;
  adminAddFakeSession(): void;
  adminResetDiag(): void;
  adminOpenDiag(): void;
  adminMarkDiagSeen(): void;
  adminGenNotif(): void;
  adminClearNotifs(): void;
  adminRefreshNotifs(): void;
  adminLogState(): void;
  adminForceSave(): void;
  adminForceReload(): void;
  adminResetState(): void;
  adminLogout(): void;
  adminResetTheme(): void;
  adminRandomTheme(): void;
  adminReopenOnboarding(): void;
  adminTogglePublic(): void;
  adminFetchProfiles(): void;
}
declare var Cropper: any;
