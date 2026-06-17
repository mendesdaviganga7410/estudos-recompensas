const THEME_LABELS = {
    "light":           "Padrão Claro",
    "pastel-brown":    "Café com Leite",
    "pastel-pink":     "Flor de Cerejeira",
    "pastel-blue":     "Brisa do Mar",
    "pastel-purple":   "Lavanda Suave",
    "pastel-mint":     "Menta Fresca",
    "solarized-light": "Solarized Light",
    "dark":            "Dark Industrial",
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

function persistPrefs(prefs) {
    window.state.prefs = prefs;
    if (window.currentUser && window.saveStateToFirestore) {
        window.saveStateToFirestore(window.currentUser.uid, window.state)
            .catch(err => console.warn("Prefs: sincronização pendente.", err));
    }
}

function applyPrefs(prefs) {
    const theme  = prefs.theme  || "light";
    const radius = prefs.radius || "16px";
    const shadow = prefs.shadow || "6px";

    document.body.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty('--base-radius', radius);
    document.documentElement.style.setProperty('--shadow-depth', shadow);

    if ($("radiusSlider")) $("radiusSlider").value = parseInt(radius);
    if ($("shadowSlider")) $("shadowSlider").value = parseInt(shadow);
    if ($("radiusValue")) $("radiusValue").textContent = radius;
    if ($("shadowValue")) $("shadowValue").textContent = shadow;
    const lbl = $("current-theme-label");
    if (lbl) lbl.textContent = THEME_LABELS[theme] || theme;
}

function changeTheme(themeName) {
    document.body.setAttribute("data-theme", themeName);
    const lbl = $("current-theme-label");
    if (lbl) lbl.textContent = THEME_LABELS[themeName] || themeName;
    const prefs = { ...(window.state.prefs || {}), theme: themeName };
    window.state.prefs = prefs;
    persistPrefs(prefs);
}

function changeRadius(radiusValue) {
    document.documentElement.style.setProperty('--base-radius', radiusValue);
    const prefs = { ...(window.state.prefs || {}), radius: radiusValue };
    window.state.prefs = prefs;
    persistPrefs(prefs);
    const valEl = $("radiusValue");
    if (valEl) valEl.textContent = radiusValue;
}

function changeShadow(shadowValue) {
    document.documentElement.style.setProperty('--shadow-depth', shadowValue);
    const prefs = { ...(window.state.prefs || {}), shadow: shadowValue };
    window.state.prefs = prefs;
    persistPrefs(prefs);
    const valEl = $("shadowValue");
    if (valEl) valEl.textContent = shadowValue;
}

function initTheme() {
    const prefs = window.state.prefs || {};
    applyPrefs(prefs);
}

function openThemeDialog() {
    const dialog = $("theme-dialog");
    if (dialog) dialog.showModal();
}

function closeThemeDialog() {
    const dialog = $("theme-dialog");
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
