const $ = (id: string) => document.getElementById(id);

function toast(msg: string, fail = false, duration = 3000) {
    const el = document.createElement("div");
    el.className = `toast${fail ? ' fail' : ''}`;
    el.textContent = msg;
    const box = document.getElementById("tBox");
    if (box) box.appendChild(el);
    setTimeout(() => el.remove(), duration);
}

window.toast = toast;
