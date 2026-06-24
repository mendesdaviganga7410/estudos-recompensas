const $ = id => document.getElementById(id);

function toast(msg, fail = false) {
    const el = document.createElement("div");
    el.className = `toast${fail ? ' fail' : ''}`;
    el.textContent = msg;
    $("tBox").appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

window.toast = toast;
