const $ = id => document.getElementById(id);

function toast(msg, fail = false, duration = 3000) {
    const el = document.createElement("div");
    el.className = `toast${fail ? ' fail' : ''}`;
    el.textContent = msg;
    $("tBox").appendChild(el);
    setTimeout(() => el.remove(), duration);
}

window.toast = toast;
