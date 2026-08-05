import"./router-CJE8uMfb.js";var e=e=>document.getElementById(e),t=[],n=null;function r(){let t=e(`auth-loading`),n=e(`comunidade-content`),r=e(`community-list`);t&&(t.style.display=`none`),n&&(n.style.display=`block`),r&&(r.style.display=`flex`),e(`profile-detail`).style.display=`none`;let o=e(`pd-back-btn`);o&&(o.textContent=`🏠 Hub`,o.onclick=()=>navigateTo(`index.html`));let s=window.currentUser,c=window.state?.profile||{};if(s){let t=c.displayName||s.displayName||s.email?.split(`@`)[0]||`Herói`,n=s.photoURL||c.avatarUrl||`https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(s.email||`hero`)}`,r=e(`user-photo`),i=e(`user-name`);r&&(r.src=n),i&&(i.textContent=t)}i(),a()}function i(){let n=e(`hero-count`),r=e(`xp-total`);if(!n&&!r)return;let i=t;n&&(n.textContent=i.length||`—`);let a=i.reduce((e,t)=>e+(t.xp||0),0);r&&(r.textContent=a?`${a.toLocaleString()} XP`:`—`)}async function a(n){let r=e(`community-grid`),a=e(`community-controls-bar`);if(r){if(a&&(a.style.display=`none`),r.innerHTML=`
        <div class="community-loading">
            ${[,,,,,,].fill(`
                <div class="skeleton-card">
                    <div class="skeleton-banner"></div>
                    <div class="skeleton-body">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line short"></div>
                        <div class="skeleton-line tiny"></div>
                    </div>
                </div>
            `).join(``)}
        </div>
    `,!window.currentUser){r.innerHTML=`
            <div class="community-guest-notice">
                <div style="font-size:3rem;margin-bottom:0.75rem;">🔒</div>
                <strong>Faça login para explorar a comunidade</strong><br>
                <span style="font-size:0.8rem;">Crie uma conta ou entre para descobrir outros heróis.</span><br>
                <button class="btn-theme" onclick="loginGoogle()" style="display:inline-flex;width:auto;">🔑 Entrar com Google</button>
                <button class="btn-theme" onclick="openAuthModal()" style="display:inline-flex;width:auto;">✉️ E-mail</button>
            </div>
        `,a&&(a.style.display=`none`);return}try{t=window.fetchPublicProfiles?await window.fetchPublicProfiles(100):[]}catch(e){console.error(`fetch profiles error:`,e),t=[]}if(i(),a&&(a.style.display=`flex`),!t.length){r.innerHTML=`
            <div class="community-empty">
                <span class="empty-icon">🌐</span>
                <strong>Nenhum perfil público encontrado ainda</strong><br>
                <span style="font-size:0.8rem;">Seja o primeiro! Vá em Configurações > Perfil e marque "Perfil Público".</span>
            </div>
        `;return}o(n)}}function o(n){let r=e(`community-grid`);if(!r)return;let i=[...t],a=(n||s()).toLowerCase().trim();if(a&&(i=i.filter(e=>{let t=(e.profile?.displayName||``).toLowerCase(),n=(e.profile?.epicGoal||``).toLowerCase();return t.includes(a)||n.includes(a)})),c()===`name`?i.sort((e,t)=>(e.profile?.displayName||``).localeCompare(t.profile?.displayName||``)):i.sort((e,t)=>(t.xp||0)-(e.xp||0)),!i.length){r.innerHTML=`
            <div class="community-empty">
                <span class="empty-icon">🔍</span>
                <strong>Nenhum herói encontrado para "${window.escapeHtml(a)}"</strong><br>
                <span style="font-size:0.8rem;">Tente um termo de busca diferente.</span>
            </div>
        `;return}function o(e){let t=window.getLevelInfo?window.getLevelInfo(e):null;return t?t.level:{icon:`🌱`,name:`Nível 1`}}r.innerHTML=i.map((e,t)=>{let n=e.profile||{},r=n.displayName||`Herói`,i=n.epicGoal||``,a=n.avatarUrl||`https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(e.uid)}`,s=n.bannerUrl||``,c=o(e.xp||0);return`
            <div class="player-card" data-idx="${t}">
                <div class="player-banner" style="background-image:${s?`url(${window.escapeHtml(s)})`:`linear-gradient(135deg, var(--panel) 0%, var(--bg) 100%)`};">
                    <div class="player-banner-overlay"></div>
                </div>
                <div class="player-card-body">
                    <img class="player-card-avatar" src="${window.escapeHtml(a)}" alt="" loading="lazy">
                    <div class="player-card-name">${window.escapeHtml(r)}</div>
                    ${i?`<div class="player-card-goal">"${window.escapeHtml(i)}"</div>`:`<div class="player-card-goal">&nbsp;</div>`}
                    <div class="player-card-stats">
                        <span>${c.icon} ${window.escapeHtml(c.name)}</span>
                        <span>${e.xp||0} XP</span>
                        <span>${e.pts||e.pontos||0} Pts</span>
                        <span>🔥 ${e.stats&&e.stats.currentStreak||0} dias</span>
                    </div>
                </div>
            </div>
        `}).join(``),r.querySelectorAll(`.player-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=parseInt(e.dataset.idx);!isNaN(t)&&i[t]&&d(i[t])})})}function s(){let t=e(`community-search`);return t?t.value:``}function c(){let t=e(`community-sort`);return t?t.value:`xp`}function l(){clearTimeout(n),n=setTimeout(()=>o(),200)}function u(){o()}function d(n){let r=n.profile||{},i=n.xp||0,{level:a,next:o}=window.getLevelInfo?window.getLevelInfo(i):{level:{icon:`🌱`,name:`Nível 1`},next:null},s=o?Math.min(1,(i-a.min)/(o.min-a.min)):1,c=r.bannerUrl||``,l=r.avatarUrl||`https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(n.uid)}`;if(e(`pd-banner`)&&(e(`pd-banner`).style.backgroundImage=c?`url(${c})`:`linear-gradient(135deg, var(--panel) 0%, var(--bg) 100%)`),e(`pd-avatar`)&&(e(`pd-avatar`).src=l),e(`pd-name`)&&(e(`pd-name`).textContent=r.displayName||`Herói`),e(`pd-goal`)&&(e(`pd-goal`).textContent=r.epicGoal||`Sem meta épica`),e(`pd-rank`)&&(e(`pd-rank`).textContent=`${a.icon} ${a.name}`),e(`pd-xp`)&&(e(`pd-xp`).textContent=`${i} XP`),e(`pd-pts`)&&(e(`pd-pts`).textContent=`${n.pts||n.pontos||0} Pts`),e(`pd-desc`)&&(e(`pd-desc`).textContent=r.description||`Sem descrição.`),e(`pd-tier-label`)&&(e(`pd-tier-label`).textContent=`${a.icon} ${a.name}`),e(`pd-next-tier-label`)&&(e(`pd-next-tier-label`).textContent=o?`${o.icon} ${o.name}`:`MAX`),e(`pd-tier-fill`)&&(e(`pd-tier-fill`).style.width=`${Math.round(s*100)}%`),e(`pd-rank-desc`)){let r=[...t].sort((e,t)=>(t.xp||0)-(e.xp||0)),i=r.findIndex(e=>e.uid===n.uid)+1;e(`pd-rank-desc`).textContent=i>0?`#${i} de ${r.length} heróis`:`—`}let u=n.stats||{};e(`pd-stat-dailies`)&&(e(`pd-stat-dailies`).textContent=u.dailiesDone??0),e(`pd-stat-epics`)&&(e(`pd-stat-epics`).textContent=u.epicsDone??0),e(`pd-stat-purchases`)&&(e(`pd-stat-purchases`).textContent=u.purchases??0),e(`pd-stat-streak`)&&(e(`pd-stat-streak`).textContent=u.currentStreak??0);let d=e(`pd-back-btn`);d&&(d.textContent=`🌐 Comunidade`,d.onclick=f),e(`community-list`).style.display=`none`,e(`profile-detail`).style.display=`flex`,requestAnimationFrame(()=>window.scrollTo(0,0))}function f(){let t=e(`pd-back-btn`);t&&(t.textContent=`🏠 Hub`,t.onclick=()=>navigateTo(`index.html`)),e(`profile-detail`).style.display=`none`,e(`community-list`).style.display=`flex`,requestAnimationFrame(()=>window.scrollTo(0,0))}window.renderComunidade=r,window.onCommunitySearch=l,window.onCommunitySort=u,window.openProfileDetail=d,window.closeProfileDetail=f;