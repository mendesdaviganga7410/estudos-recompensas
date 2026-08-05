import"./router-CJE8uMfb.js";/* empty css             */var e=e=>document.getElementById(e);function t(e){return e.toLocaleString(`pt-BR`)}function n(){let n=e(`auth-loading`);n&&(n.style.display=`none`);let i=e(`trilha-content`);i&&(i.style.display=``);let a=e(`trilha-page-content`);if(!a)return;let o=window.LEVELS||[],s=window.state.xp||0,c=window.getLevelInfo?window.getLevelInfo(s):null,l=c?c.level:o[0]||{name:`Nível 1`,rank:`Semente`,icon:`🌱`,min:0},u=c?c.next:null,d=u?Math.min(100,Math.max(0,(s-l.min)/(u.min-l.min)*100)):100;a.innerHTML=`
        <div class="bento-card trilha-hero">
            <div class="trilha-hero-title">🗺️ Trilha da Evolução</div>
            <div class="trilha-hero-rank">${l.icon} <strong>${l.name}</strong> <span class="trilha-hero-rank-tag">${l.rank}</span></div>
            <div class="trilha-hero-xp">${t(s)} XP acumulados</div>
            <div class="trilha-progress-wrap">
                <div class="trilha-progress-labels">
                    <span>${l.icon} ${l.name}</span>
                    <span>${u?`Próximo: ${u.icon} ${u.name}`:`Nível Máximo ✨`}</span>
                </div>
                <div class="trilha-progress-track"><div class="trilha-progress-fill" style="width:${d}%"></div></div>
                ${u?`<div class="trilha-progress-xp">${t(s)} / ${t(u.min)} XP para ${u.name}</div>`:`<div class="trilha-progress-xp">Você atingiu o topo da trilha. 👑</div>`}
            </div>
        </div>
    `+r(o,s,c);let f=a.querySelector(`.trilha-node.current`);f&&f.scrollIntoView({behavior:`smooth`,block:`center`})}function r(e,n,r){let i=r?r.index:0;return`
        <div class="trilha-track">
            <div class="trilha-line"></div>
            <div class="trilha-line-fill" style="height:${e.length>1?Math.min(100,i/(e.length-1)*100):0}%"></div>
            ${e.map((e,r)=>{let a=r+1,o=a%8==1,s=n>=e.min,c=r===i,l=a%2==1,u=`
            <div class="trilha-marker-wrap">
                <div class="trilha-marker${c?` current`:``}${s?` reached`:``}">${e.icon}</div>
                ${c?`<div class="trilha-current-tag">Você está aqui</div>`:``}
            </div>
        `,d=`
            <div class="trilha-cell trilha-cell-level ${l?`left`:`right`}">
                <div class="trilha-level-name">${e.icon} ${e.name}</div>
                <div class="trilha-rank-name">${e.rank}</div>
                <div class="trilha-level-min">${t(e.min)} XP</div>
            </div>
        `,f=`
            <div class="trilha-cell trilha-cell-reward ${s?`unlocked`:`locked`} ${l?`right`:`left`}">
                <div class="trilha-reward-label">🎁 ${e.reward}</div>
                <div class="trilha-reward-status">${s?`🔓 Desbloqueada`:`🔒 Bloqueada`}</div>
            </div>
        `;return(o?`
                <div class="trilha-section">
                    <span class="trilha-section-line"></span>
                    <span class="trilha-section-label">${e.icon} ${e.rank} · Níveis ${a}-${a+7}</span>
                    <span class="trilha-section-line"></span>
                </div>
            `:``)+`
            <div class="trilha-node${s?` reached`:``}${c?` current`:``}" data-level="${a}">
                ${l?d:f}
                ${u}
                ${l?f:d}
            </div>
        `}).join(``).reverse().join(``)}
        </div>
    `}window.renderTrilha=n;