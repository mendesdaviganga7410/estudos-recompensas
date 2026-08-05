// @ts-nocheck
const $ = (id) => document.getElementById(id);
const THEME_LABELS = {
    "pastel-blue":      "Modo Claro",
    "pastel-blue-dark": "Modo Escuro",
};

const VALID_THEMES = Object.keys(THEME_LABELS);

const STYLE_PRESETS = {
    radius: { flat: "0px", balanced: "16px", cozy: "22px" },
    shadow: { flat: "0px", balanced: "6px",  cozy: "10px" },
} as const;

type StyleDimension = keyof typeof STYLE_PRESETS;
type StylePresetKey = keyof typeof STYLE_PRESETS.radius;

const PRESET_BUTTON_IDS = {
    radius: { flat: "radiusPresetFlat", balanced: "radiusPresetBalanced", cozy: "radiusPresetCozy" },
    shadow: { flat: "shadowPresetFlat", balanced: "shadowPresetBalanced", cozy: "shadowPresetCozy" },
} as const;

function syncPresetGroup(dim: StyleDimension, value: string): void {
    const presets = STYLE_PRESETS[dim];
    let active: StylePresetKey = "balanced";
    for (const key of Object.keys(presets) as StylePresetKey[]) {
        if (presets[key] === value) active = key;
    }
    const ids = PRESET_BUTTON_IDS[dim];
    Object.keys(ids).forEach((key) => {
        const btn = $(ids[key as StylePresetKey]);
        if (btn) btn.classList.toggle("active", key === active);
    });
}

function syncPresetButtons(): void {
    const radius = getComputedStyle(document.documentElement).getPropertyValue('--base-radius').trim() || "16px";
    const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-depth').trim() || "6px";
    syncPresetGroup("radius", radius);
    syncPresetGroup("shadow", shadow);
}

function persistPrefs(prefs: UserPrefs): void {
    window.state.prefs = prefs;
    if (window.currentUser && window.saveStateToFirestore) {
        window.saveStateToFirestore((window.currentUser as Record<string, string>).uid, window.state)
            .catch((err: unknown) => console.warn("Prefs: sincronização pendente.", err));
    }
}

function applyPrefs(prefs: UserPrefs): void {
    const theme  = (prefs.theme && VALID_THEMES.includes(prefs.theme)) ? prefs.theme : "pastel-blue";
    const radius = prefs.radius || "16px";
    const shadow = prefs.shadow || "6px";

    document.body.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty('--base-radius', radius);
    document.documentElement.style.setProperty('--shadow-depth', shadow);

    syncPresetButtons();
    const lbl = $("current-theme-label");
    if (lbl) lbl.textContent = THEME_LABELS[theme] || theme;
}

function changeTheme(themeName: string): void {
    document.body.setAttribute("data-theme", themeName);
    const lbl = $("current-theme-label");
    if (lbl) lbl.textContent = (THEME_LABELS as Record<string, string>)[themeName] || themeName;
    const prefs: UserPrefs = { ...(window.state.prefs || {}), theme: themeName, radius: window.state.prefs?.radius || "16px", shadow: window.state.prefs?.shadow || "6px" };
    window.state.prefs = prefs;
    persistPrefs(prefs);
}

function changeRadius(radiusValue: string): void {
    document.documentElement.style.setProperty('--base-radius', radiusValue);
    const prefs: UserPrefs = { ...(window.state.prefs || {}), radius: radiusValue, theme: window.state.prefs?.theme || "pastel-blue", shadow: window.state.prefs?.shadow || "6px" };
    window.state.prefs = prefs;
    persistPrefs(prefs);
    syncPresetButtons();
}

function changeShadow(shadowValue: string): void {
    document.documentElement.style.setProperty('--shadow-depth', shadowValue);
    const prefs: UserPrefs = { ...(window.state.prefs || {}), shadow: shadowValue, theme: window.state.prefs?.theme || "pastel-blue", radius: window.state.prefs?.radius || "16px" };
    window.state.prefs = prefs;
    persistPrefs(prefs);
    syncPresetButtons();
}

function initTheme(): void {
    const prefs = window.state.prefs || {};
    applyPrefs(prefs as UserPrefs);
}

function openThemeDialog(): void {
    const dialog = $("theme-dialog") as HTMLDialogElement | null;
    if (dialog) dialog.showModal();
}

function closeThemeDialog(): void {
    const dialog = $("theme-dialog") as HTMLDialogElement | null;
    if (dialog) dialog.close();
}

function selectTheme(themeName) {
    changeTheme(themeName);
    closeThemeDialog();
}

function resetDefaults() {
    applyPrefs({ theme: "pastel-blue", radius: "16px", shadow: "6px" });
    persistPrefs({ theme: "pastel-blue", radius: "16px", shadow: "6px" });
    toast("Configurações restauradas para o padrão.");
}

window.applyPrefs       = applyPrefs;
window.syncPresetButtons = syncPresetButtons;
window.changeTheme      = changeTheme;
window.changeRadius     = changeRadius;
window.changeShadow     = changeShadow;
window.openThemeDialog  = openThemeDialog;
window.closeThemeDialog = closeThemeDialog;
window.selectTheme      = selectTheme;
window.resetDefaults    = resetDefaults;

document.addEventListener("DOMContentLoaded", initTheme);
