import"./router-BBePKEXI.js";/* empty css             */import"./onboarding-CUXY82h7.js";function e(e){return TIERS.find(t=>e>=t.min&&e<=t.max)||TIERS[0]}function t(){let t=$(`rPts`),n=$(`rXp`),r=$(`rRank`),i=$(`rNext`),a=$(`rBar`);if(!t)return;t.textContent=state.pts,n.textContent=`${state.xp} XP`;let o=e(state.xp),s=TIERS[TIERS.indexOf(o)+1];if(r.textContent=`${o.i} ${o.name}`,s){i.textContent=`Próximo: ${s.min} XP`;let e=(state.xp-o.min)/(s.min-o.min)*100;a.style.width=`${Math.min(100,Math.max(0,e))}%`}else i.textContent=`Nível Máximo ✨`,a.style.width=`100%`;let c=$(`rStreak`);c&&(c.textContent=`${state.stats.currentStreak||0} dias`);let l=$(`rStreakCalendar`);if(l){let e=state.dailyLog||{},t=new Date,n=[`Dom`,`Seg`,`Ter`,`Qua`,`Qui`,`Sex`,`Sáb`];l.innerHTML=``;for(let r=6;r>=0;r--){let i=new Date(t);i.setDate(i.getDate()-r);let a=window.getLocalDateStr(i),o=e[a],s=o&&o.length>0,c=r===0,u=i.getDay(),d=document.createElement(`div`);d.className=`day${s?` done`:` missed`}${c?` today`:``}`,d.title=`${n[u]} ${a.slice(5)}${s?` ✅`:``}`,d.textContent=n[u][0],l.appendChild(d)}if(state.stats.maxStreak>0){let e=document.createElement(`span`);e.className=`streak-max`,e.textContent=`🔥 Melhor: ${state.stats.maxStreak} dias`,l.appendChild(e)}}}function n(){let e=$(`rShop`);if(!e)return;let{shop:t}=getMergedLists(),n=Date.now();e.innerHTML=t.map(e=>{let t=state.cd[e.id],r=t&&n-t<e.cd,i=state.pts>=e.cost&&!r,a=`Resgatar`;if(r){let r=Math.ceil((e.cd-(n-t))/36e5);a=r>24?`${Math.ceil(r/24)}d`:`${r}h`}else state.pts<e.cost&&(a=`Faltam Pts`);return`
            <div class="shop-node ${r?`cooldown`:``}">
                <div>
                    <div class="node-tag t-${e.type}">${e.label}</div>
                    <div class="node-name">${e.name}</div>
                </div>
                <div>
                    <div class="node-cost">${e.cost} Pts</div>
                    <button class="btn-buy" ${i?``:`disabled`} onclick="buy('${e.id}')">${a}</button>
                </div>
            </div>
        `}).join(``)}function r(e){let t=window.getTodayStr(),n=state.dailyLog[t];return n&&n.includes(e)}function i(e){let t=window.getWeekStr(new Date),n=state.weeklyLog[t];return n&&n.includes(e)}function a(e){if(!e)return;let t=e.getBoundingClientRect(),n=t.left+t.width/2,r=t.top+t.height/2,i=[`var(--accent)`,`var(--success)`,`#ffd700`,`#ff6b6b`,`#48dbfb`,`#ff9ff3`];for(let e=0;e<16;e++){let t=document.createElement(`div`);t.className=`sparkle-particle`;let a=e/16*Math.PI*2+Math.random()*.5,o=40+Math.random()*60;t.style.cssText=`
            left:${n}px; top:${r}px;
            width:${4+Math.random()*6}px; height:${4+Math.random()*6}px;
            background:${i[e%i.length]};
            --x:${Math.cos(a)*o}px; --y:${Math.sin(a)*o}px;
        `,document.body.appendChild(t),setTimeout(()=>t.remove(),600)}}function o(){let e=$(`rDailies`),t=$(`rEpics`);if(!e&&!t)return;let n=window.getMergedLists?window.getMergedLists():{dailies:[],epics:[]};e&&(e.innerHTML=n.dailies.map(e=>{let t=r(e.id);return`
            <div class="task-item ${t?`completed`:``}">
                <div class="task-info">
                    <span class="task-t">${e.name}</span>
                    <span class="task-d">${e.desc}</span>
                    <div class="badges">
                        <span class="badge badge-highlight">+${e.pts} Pts</span>
                        <span class="badge">+${e.xp} XP</span>
                        <span class="badge">-${e.fXp} XP penalidade</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn-ctrl btn-del" onclick="task('${e.id}','d',false)" title="Falhou" ${t?`disabled`:``}>−</button>
                    <button class="btn-ctrl btn-ok"  onclick="task('${e.id}','d',true)"  title="Concluído" ${t?`disabled`:``}>${t?`✓`:`+`}</button>
                </div>
            </div>
        `}).join(``)),t&&(t.innerHTML=n.epics.map(e=>{let t=i(e.id);return`
            <div class="task-item ${t?`completed`:``}">
                <div class="task-info">
                    <span class="task-t">${e.name}</span>
                    <span class="task-d">${e.desc}</span>
                    <div class="badges">
                        <span class="badge badge-highlight">+${e.pts} Pts</span>
                        <span class="badge">+${e.xp} XP</span>
                    </div>
                </div>
                <button class="btn-ctrl btn-epic" onclick="task('${e.id}','e',true)" ${t?`disabled`:``}>${t?`✓ Concluída`:`Concluir`}</button>
            </div>
        `}).join(``))}function s(){let e=window.getTodayStr(),n=window.getYesterdayStr();if(state.lastDailyDate===e)return;if(!state.lastDailyDate){state.lastDailyDate=e,l();return}let r=window.getMergedLists?window.getMergedLists().dailies:[],i=!1,a=new Date(state.lastDailyDate),o=new Date(n);a.setDate(a.getDate()+1);for(let e=new Date(a);e<=o;e.setDate(e.getDate()+1)){let t=window.getLocalDateStr(e),n=state.dailyLog[t]||[];for(let e of r)n.includes(e.id)||(state.xp=Math.max(0,state.xp-(e.fXp||0)),i=!0)}i&&(toast(`⏰ Penalidade por missões não concluídas em dias anteriores.`,!0,4e3),t()),state.lastDailyDate=e,l()}function c(){let e=document.getElementById(`auth-loading`),r=document.getElementById(`panel-content`);e&&(e.style.display=`none`),r&&(r.style.display=`block`),s(),t(),n(),o(),window._shopInterval||(window._shopInterval=setInterval(n,3e4))}window.render=c;function l(){if(window.isGuestMode){window.saveGuestState?.();return}!window.currentUser||!window.saveStateToFirestore||window.saveStateToFirestore(window.currentUser.uid,state).catch(e=>console.warn(`Firestore: escrita pendente.`,e))}function u(t,n,o){let{dailies:s,epics:u}=getMergedLists(),d=(n===`d`?s:u).find(e=>e.id===t);if(!d)return;if(n===`d`){if(r(t)){toast(`Missão já concluída hoje! ✅`,!1,2e3);return}let e=window.getTodayStr();state.dailyLog[e]||(state.dailyLog[e]=[]),state.dailyLog[e].push(t)}if(n===`e`&&o){let e=window.getWeekStr(new Date);if(i(t)){toast(`Missão já concluída esta semana! ✅`,!1,2e3);return}state.weeklyLog[e]||(state.weeklyLog[e]=[]),state.weeklyLog[e].push(t)}let f=e(state.xp);if(o)state.pts+=d.pts,state.xp+=d.xp,n===`d`&&(state.stats.dailiesDone=(state.stats.dailiesDone||0)+1),n===`e`&&(state.stats.epicsDone=(state.stats.epicsDone||0)+1),state.stats.currentStreak=window.calcStreak(),state.stats.currentStreak>state.stats.maxStreak&&(state.stats.maxStreak=state.stats.currentStreak),toast(`+${d.xp} XP / +${d.pts} Pts adicionados.`),a(document.querySelector(`.btn-ok[onclick*="'${t}'"]`)||document.querySelector(`.btn-epic[onclick*="'${t}'"]`));else{let e=d.fXp||0;state.xp=Math.max(0,state.xp-e),toast(`Penalidade aplicada: −${e} XP.`,!0)}state.lastDailyDate=window.getTodayStr(),window.momentumActive||c(),l();let p=e(state.xp);f.name!==p.name&&state.xp>f.min&&toast(`👑 Novo ranking alcançado: ${p.name}!`)}function d(e){let{shop:t}=getMergedLists(),n=t.find(t=>t.id===e);if(!n)return;let r=Date.now();state.pts<n.cost||state.cd[n.id]&&r-state.cd[n.id]<n.cd||(state.pts-=n.cost,state.cd[n.id]=r,state.stats.purchases=(state.stats.purchases||0)+1,toast(`Item adquirido: ${n.name} 🎉`),c(),l())}window.task=u,window.buy=d;var f=!1,p=[];window.momentumActive=f;function m(e){let t=document.getElementById(`momentum-overlay`);t||(t=document.createElement(`div`),t.className=`momentum-overlay`,t.id=`momentum-overlay`,t.addEventListener(`keydown`,e=>{e.key===`Escape`&&b()}),document.body.appendChild(t),t.focus()),t.innerHTML=e}function h(){if(f)return;let e=(window.getMergedLists?.()||{dailies:[]}).dailies.filter(e=>!r(e.id));if(e.length===0){window.toast?.(`🎉 Todas as missões do dia já foram concluídas!`);return}f=!0,window.momentumActive=!0,p=e,document.addEventListener(`keydown`,y),g(0)}function g(e){if(e>=p.length){m(`
            <div class="momentum-card">
                <div class="momentum-title" style="font-size:2.5rem;">🎉</div>
                <div class="momentum-done">Todas as missões do dia concluídas!</div>
                <div class="momentum-exit"><button onclick="exitMomentum()">Voltar ao Painel</button></div>
            </div>
        `);return}let t=p[e];m(`
        <div class="momentum-card">
            <span class="momentum-label">🚀 Modo Momentum</span>
            <div class="momentum-title">${window.escapeHtml(t.name)}</div>
            <div class="momentum-desc">${window.escapeHtml(t.desc)}</div>
            <div class="momentum-badges">
                <span class="badge badge-highlight">+${t.pts} Pts</span>
                <span class="badge">+${t.xp} XP</span>
                <span class="badge">-${t.fXp} XP penalidade</span>
            </div>
            <div class="momentum-actions">
                <button class="btn-ctrl btn-del" onclick="momentumFail()" title="Falhou">−</button>
                <button class="btn-ctrl btn-ok" onclick="momentumComplete()" title="Concluído">+</button>
            </div>
            <div class="momentum-exit"><button onclick="exitMomentum()">Sair</button></div>
        </div>
    `)}function _(){if(p.length===0)return;let e=p[0];window.task(e.id,`d`,!0),p.shift(),g(0)}function v(){if(p.length===0)return;let e=p[0];window.task(e.id,`d`,!1),p.shift(),g(0)}function y(e){e.key===`Escape`&&b()}function b(){f=!1,window.momentumActive=!1,p=[],document.removeEventListener(`keydown`,y);let e=document.getElementById(`momentum-overlay`);e&&e.remove(),c()}window.enterMomentum=h,window.exitMomentum=b,window.momentumComplete=_,window.momentumFail=v,(window.isPainelPage?.()||document.getElementById(`rDailies`))&&document.addEventListener(`DOMContentLoaded`,()=>{window.updateGuestUI&&window.updateGuestUI()});