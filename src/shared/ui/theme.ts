const THEME_LABELS = {
    "light":           "Padrão Claro",
    "pastel-brown":    "Café com Leite",
    "pastel-pink":     "Flor de Cerejeira",
    "pastel-blue":     "Brisa do Mar",
    "pastel-purple":   "Lavanda Suave",
    "pastel-mint":     "Menta Fresca",
    "solarized-light": "Solarized Light",
    "dark":            "Dark Padrão",
    "dark-industrial": "Dark Industrial",
    "dark-cyberpunk":  "Cyberpunk",
    "dark-ocean":      "Dark Ocean",
    "dark-monochrome": "Monochrome",
    "dark-chocolate":  "Cacau Intenso",
    "dark-forest":     "Floresta Noturna",
    "dark-amber":      "Âmbar Profundo",
    "dark-purple":     "Noite de Vampiro",
    "catppuccin":      "Catppuccin Mocha",
    "nord":            "Nordic Ice",
    "dracula":         "Dracula Sync",
    "github-dark":       "GitHub Premium",
    "outerwilds-dark":   "Fogueira Cósmica",
    "outerwilds-light":  "Lareira Gentil",
};

function persistPrefs(prefs: UserPrefs): void {
    window.state.prefs = prefs;
    if (window.currentUser && window.saveStateToFirestore) {
        window.saveStateToFirestore((window.currentUser as Record<string, string>).uid, window.state)
            .catch((err: unknown) => console.warn("Prefs: sincronização pendente.", err));
    }
}

function applyPrefs(prefs: UserPrefs): void {
    const theme  = prefs.theme  || "light";
    const radius = prefs.radius || "16px";
    const shadow = prefs.shadow || "6px";

    document.body.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty('--base-radius', radius);
    document.documentElement.style.setProperty('--shadow-depth', shadow);

    const rs = $("radiusSlider") as HTMLInputElement | null;
    if (rs) rs.value = String(parseInt(radius));
    const ss = $("shadowSlider") as HTMLInputElement | null;
    if (ss) ss.value = String(parseInt(shadow));
    const rv = $("radiusValue");
    if (rv) rv.textContent = radius;
    const sv = $("shadowValue");
    if (sv) sv.textContent = shadow;
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
    const prefs: UserPrefs = { ...(window.state.prefs || {}), radius: radiusValue, theme: window.state.prefs?.theme || "light", shadow: window.state.prefs?.shadow || "6px" };
    window.state.prefs = prefs;
    persistPrefs(prefs);
    const valEl = $("radiusValue");
    if (valEl) valEl.textContent = radiusValue;
}

function changeShadow(shadowValue: string): void {
    document.documentElement.style.setProperty('--shadow-depth', shadowValue);
    const prefs: UserPrefs = { ...(window.state.prefs || {}), shadow: shadowValue, theme: window.state.prefs?.theme || "light", radius: window.state.prefs?.radius || "16px" };
    window.state.prefs = prefs;
    persistPrefs(prefs);
    const valEl = $("shadowValue");
    if (valEl) valEl.textContent = shadowValue;
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
    applyPrefs({ theme: "light", radius: "16px", shadow: "6px" });
    persistPrefs({ theme: "light", radius: "16px", shadow: "6px" });
    toast("Configurações restauradas para o padrão.");
}

window.applyPrefs       = applyPrefs;
window.changeTheme      = changeTheme;
window.changeRadius     = changeRadius;
window.changeShadow     = changeShadow;
window.openThemeDialog  = openThemeDialog;
window.closeThemeDialog = closeThemeDialog;
window.selectTheme      = selectTheme;
window.resetDefaults    = resetDefaults;

document.addEventListener("DOMContentLoaded", initTheme);
