import"./router-Db8uDmXq.js";/* empty css             */import"./onboarding-CUXY82h7.js";var e=e=>document.getElementById(e);function t(e){return TIERS.find(t=>e>=t.min&&e<=t.max)||TIERS[0]}function n(){let n=e(`rPts`),r=e(`rXp`),i=e(`rRank`),a=e(`rNext`),o=e(`rBar`);if(!n)return;n.textContent=state.pts,r.textContent=`${state.xp} XP`;let s=t(state.xp),c=TIERS[TIERS.indexOf(s)+1];if(i.textContent=`${s.i} ${s.name}`,c){a.textContent=`Próximo: ${c.min} XP`;let e=(state.xp-s.min)/(c.min-s.min)*100;o.style.width=`${Math.min(100,Math.max(0,e))}%`}else a.textContent=`Nível Máximo ✨`,o.style.width=`100%`;let l=e(`rStreak`);l&&(l.textContent=`${state.stats.currentStreak||0} dias`);let u=e(`rStreakCalendar`);if(u){let e=state.dailyLog||{},t=new Date,n=[`Dom`,`Seg`,`Ter`,`Qua`,`Qui`,`Sex`,`Sáb`];u.innerHTML=``;for(let r=6;r>=0;r--){let i=new Date(t);i.setDate(i.getDate()-r);let a=window.getLocalDateStr(i),o=e[a],s=o&&o.length>0,c=r===0,l=i.getDay(),d=document.createElement(`div`);d.className=`day${s?` done`:` missed`}${c?` today`:``}`,d.title=`${n[l]} ${a.slice(5)}${s?` ✅`:``}`,d.textContent=n[l][0],u.appendChild(d)}if(state.stats.maxStreak>0){let e=document.createElement(`span`);e.className=`streak-max`,e.textContent=`🔥 Melhor: ${state.stats.maxStreak} dias`,u.appendChild(e)}}}function r(){let t=e(`rShop`);if(!t)return;let{shop:n}=getMergedLists(),r=Date.now();t.innerHTML=n.map(e=>{let t=state.cd[e.id],n=t&&r-t<e.cd,i=state.pts>=e.cost&&!n,a=`Resgatar`;if(n){let n=Math.ceil((e.cd-(r-t))/36e5);a=n>24?`${Math.ceil(n/24)}d`:`${n}h`}else state.pts<e.cost&&(a=`Faltam Pts`);return`
            <div class="shop-node ${n?`cooldown`:``}">
                <div>
                    <div class="node-tag t-${e.type}">${e.label}</div>
                    <div class="node-name">${e.name}</div>
                </div>
                <div>
                    <div class="node-cost">${e.cost} Pts</div>
                    <button class="btn-buy" ${i?``:`disabled`} onclick="buy('${e.id}')">${a}</button>
                </div>
            </div>
        `}).join(``)}function i(e){let t=window.getTodayStr(),n=state.dailyLog[t];return n&&n.includes(e)}function a(e){let t=window.getWeekStr(new Date),n=state.weeklyLog[t];return n&&n.includes(e)}function o(e){if(!e)return;let t=e.getBoundingClientRect(),n=t.left+t.width/2,r=t.top+t.height/2,i=[`var(--accent)`,`var(--success)`,`#ffd700`,`#ff6b6b`,`#48dbfb`,`#ff9ff3`];for(let e=0;e<16;e++){let t=document.createElement(`div`);t.className=`sparkle-particle`;let a=e/16*Math.PI*2+Math.random()*.5,o=40+Math.random()*60;t.style.cssText=`
            left:${n}px; top:${r}px;
            width:${4+Math.random()*6}px; height:${4+Math.random()*6}px;
            background:${i[e%i.length]};
            --x:${Math.cos(a)*o}px; --y:${Math.sin(a)*o}px;
        `,document.body.appendChild(t),setTimeout(()=>t.remove(),600)}}function s(){let t=e(`rDailies`),n=e(`rEpics`);if(!t&&!n)return;let r=window.getMergedLists?window.getMergedLists():{dailies:[],epics:[]};t&&(t.innerHTML=r.dailies.map(e=>{let t=i(e.id);return`
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
        `}).join(``)),n&&(n.innerHTML=r.epics.map(e=>{let t=a(e.id);return`
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
        `}).join(``))}function c(){let e=window.getTodayStr(),t=window.getYesterdayStr();if(state.lastDailyDate===e)return;if(!state.lastDailyDate){state.lastDailyDate=e,u();return}let r=window.getMergedLists?window.getMergedLists().dailies:[],i=!1,a=new Date(state.lastDailyDate),o=new Date(t);a.setDate(a.getDate()+1);for(let e=new Date(a);e<=o;e.setDate(e.getDate()+1)){let t=window.getLocalDateStr(e),n=state.dailyLog[t]||[];for(let e of r)n.includes(e.id)||(state.xp=Math.max(0,state.xp-(e.fXp||0)),i=!0)}i&&(toast(`⏰ Penalidade por missões não concluídas em dias anteriores.`,!0,4e3),n()),state.lastDailyDate=e,u()}function l(){let e=document.getElementById(`auth-loading`),t=document.getElementById(`panel-content`);e&&(e.style.display=`none`),t&&(t.style.display=`block`),c(),n(),r(),s(),window._shopInterval||(window._shopInterval=setInterval(r,3e4))}window.render=l;function u(){if(window.isGuestMode){window.saveGuestState?.();return}!window.currentUser||!window.saveStateToFirestore||window.saveStateToFirestore(window.currentUser.uid,state).catch(e=>console.warn(`Firestore: escrita pendente.`,e))}function d(e,n,r){let{dailies:s,epics:c}=getMergedLists(),d=(n===`d`?s:c).find(t=>t.id===e);if(!d)return;if(n===`d`){if(i(e)){toast(`Missão já concluída hoje! ✅`,!1,2e3);return}let t=window.getTodayStr();state.dailyLog[t]||(state.dailyLog[t]=[]),state.dailyLog[t].push(e)}if(n===`e`&&r){let t=window.getWeekStr(new Date);if(a(e)){toast(`Missão já concluída esta semana! ✅`,!1,2e3);return}state.weeklyLog[t]||(state.weeklyLog[t]=[]),state.weeklyLog[t].push(e)}let f=t(state.xp);if(r)state.pts+=d.pts,state.xp+=d.xp,n===`d`&&(state.stats.dailiesDone=(state.stats.dailiesDone||0)+1),n===`e`&&(state.stats.epicsDone=(state.stats.epicsDone||0)+1),state.stats.currentStreak=window.calcStreak(),state.stats.currentStreak>state.stats.maxStreak&&(state.stats.maxStreak=state.stats.currentStreak),toast(`+${d.xp} XP / +${d.pts} Pts adicionados.`),o(document.querySelector(`.btn-ok[onclick*="'${e}'"]`)||document.querySelector(`.btn-epic[onclick*="'${e}'"]`));else{let e=d.fXp||0;state.xp=Math.max(0,state.xp-e),toast(`Penalidade aplicada: −${e} XP.`,!0)}state.lastDailyDate=window.getTodayStr(),window.momentumActive||l(),u();let p=t(state.xp);f.name!==p.name&&state.xp>f.min&&toast(`👑 Novo ranking alcançado: ${p.name}!`)}function f(e){let{shop:t}=getMergedLists(),n=t.find(t=>t.id===e);if(!n)return;let r=Date.now();state.pts<n.cost||state.cd[n.id]&&r-state.cd[n.id]<n.cd||(state.pts-=n.cost,state.cd[n.id]=r,state.stats.purchases=(state.stats.purchases||0)+1,toast(`Item adquirido: ${n.name} 🎉`),l(),u())}window.task=d,window.buy=f;var p=!1,m=[];window.momentumActive=p;function h(e){let t=document.getElementById(`momentum-overlay`);t||(t=document.createElement(`div`),t.className=`momentum-overlay`,t.id=`momentum-overlay`,t.addEventListener(`keydown`,e=>{e.key===`Escape`&&x()}),document.body.appendChild(t),t.focus()),t.innerHTML=e}function g(){if(p)return;let e=(window.getMergedLists?.()||{dailies:[]}).dailies.filter(e=>!i(e.id));if(e.length===0){window.toast?.(`🎉 Todas as missões do dia já foram concluídas!`);return}p=!0,window.momentumActive=!0,m=e,document.addEventListener(`keydown`,b),_(0)}function _(e){if(e>=m.length){h(`
            <div class="momentum-card">
                <div class="momentum-title" style="font-size:2.5rem;">🎉</div>
                <div class="momentum-done">Todas as missões do dia concluídas!</div>
                <div class="momentum-exit"><button onclick="exitMomentum()">Voltar ao Painel</button></div>
            </div>
        `);return}let t=m[e];h(`
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
    `)}function v(){if(m.length===0)return;let e=m[0];window.task(e.id,`d`,!0),m.shift(),_(0)}function y(){if(m.length===0)return;let e=m[0];window.task(e.id,`d`,!1),m.shift(),_(0)}function b(e){e.key===`Escape`&&x()}function x(){p=!1,window.momentumActive=!1,m=[],document.removeEventListener(`keydown`,b);let e=document.getElementById(`momentum-overlay`);e&&e.remove(),l()}window.enterMomentum=g,window.exitMomentum=x,window.momentumComplete=v,window.momentumFail=y,(window.isPainelPage?.()||document.getElementById(`rDailies`))&&document.addEventListener(`DOMContentLoaded`,()=>{window.updateGuestUI&&window.updateGuestUI()});