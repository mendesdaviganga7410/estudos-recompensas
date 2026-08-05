import"./router-CJE8uMfb.js";/* empty css             */function e(e,t,n,r){t||={intervals:[1,3,7,15,30],easeFactorMultiplier:1};let i=t.intervals,a=t.easeFactorMultiplier||1,o=e.currentIntervalIndex||0,s=(e.repetition||0)+1;switch(n){case`hard`:break;case`medium`:o=Math.min(o+1,i.length-1);break;case`easy`:o=Math.min(o+2,i.length-1);break;default:o=Math.min(o+1,i.length-1)}let c=i[o]||i[i.length-1];c=Math.round(c*a),c=Math.max(1,c);let l=r||Date.now(),u=Date.now(),d=new Date(l);d.setDate(d.getDate()+c);let f,p=new Date;p.setHours(0,0,0,0);let m=new Date(d);return m.setHours(0,0,0,0),f=m<=p?`due`:`pending`,{lastReviewDate:u,nextReviewDate:d.getTime(),currentIntervalIndex:o,repetition:s,status:f}}function t(){let e=window.state.studyBlocks;if(!e||e.length===0)return;let t=new Date;t.setHours(0,0,0,0);let n=t.getTime(),r=!1;e.forEach(e=>{if(e.status===`completed`)return;let t=new Date(e.nextReviewDate);t.setHours(0,0,0,0);let i=t.getTime(),a;a=i<n?`overdue`:i===n?`due`:`pending`,a!==e.status&&(e.status=a,r=!0)}),r&&(window.saveState(),window.generateReviewNotif?.())}window.calculateNextReview=e,window.updateBlocksStatus=t;var n=!1;function r(){let e=document.getElementById(`auth-loading`);e&&(e.style.display=`none`);let t=document.getElementById(`review-content`);t&&(t.style.display=``);let n=document.getElementById(`review-page-content`);n&&(n.innerHTML=`
            <div class="bento-layout">
                <div class="bento-card col-span-3">
                    <div class="status-header-block">
                        <div>
                            <span class="bento-label">📊 Revisão</span>
                        </div>
                        <div id="reviewSettingsHeader"></div>
                    </div>
                    <div class="status-metrics">
                        <div class="status-metrics-row" id="reviewStatsRow">
                            <div class="metric-block">
                                <span class="bento-label">🔴 Atrasados</span>
                                <span class="bento-title stat-overdue" id="rs-overdue">0</span>
                            </div>
                            <div class="metric-block">
                                <span class="bento-label">🟠 Revisar</span>
                                <span class="bento-title stat-due" id="rs-due">0</span>
                            </div>
                            <div class="metric-block">
                                <span class="bento-label">⏳ Pendentes</span>
                                <span class="bento-title" id="rs-pending">0</span>
                            </div>
                            <div class="metric-block">
                                <span class="bento-label">✅ Completos</span>
                                <span class="bento-title stat-done" id="rs-completed">0</span>
                            </div>
                            <div class="metric-block">
                                <span class="bento-label">📦 Total</span>
                                <span class="bento-title" id="rs-total">0</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bento-card col-span-3">
                    <div class="toolbar-row">
                        <div class="toolbar-search">
                            <input type="text" id="reviewSearchInput" placeholder="🔍 Buscar blocos..." oninput="window.applyReviewFilters()" autocomplete="off">
                        </div>
                        <div class="toolbar-filters">
                            <select id="reviewFilterStatus" onchange="window.applyReviewFilters()">
                                <option value="all">📋 Todos</option>
                                <option value="due">🔶 A Revisar</option>
                                <option value="overdue">🔴 Atrasado</option>
                                <option value="pending">⏳ Pendente</option>
                                <option value="completed">✅ Completado</option>
                            </select>
                            <select id="reviewFilterMateria" onchange="window.applyReviewFilters()">
                                <option value="all">📖 Todas</option>
                            </select>
                            <select id="reviewSortOrder" onchange="window.applyReviewFilters()">
                                <option value="nextReview">📅 Data</option>
                                <option value="materia">📖 Matéria</option>
                                <option value="created">🆕 Criação</option>
                            </select>
                            <button class="btn-theme" id="reviewSortToggle" onclick="window.reverseReviewSort()" title="Alternar ordem" style="width:auto;padding:0.65rem 0.85rem;font-size:0.85rem;">↕ <span id="reviewSortDir">↑</span></button>
                        </div>
                    </div>
                </div>
                <div class="bento-card col-span-3">
                    <div style="display:flex;align-items:center;justify-content:space-between;">
                        <h2 style="margin:0;">Seus Blocos de Estudo</h2>
                        <button class="btn-theme" onclick="window.openAddBlockDialog()" style="width:auto;">➕ Adicionar</button>
                    </div>
                    <div id="studyBlocksList" class="study-blocks-list"></div>
                </div>
            </div>
        `,window.renderReviewSettingsRow()),window.populateMateriaFilter(),window.updateReviewStats(),window.renderStudyBlocksList()}function i(){n=!n;let e=document.getElementById(`reviewSortDir`);e&&(e.textContent=n?`↓`:`↑`),window.applyReviewFilters()}function a(){let e=document.getElementById(`reviewSettingsHeader`);e&&(e.innerHTML=`
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.15rem;">
            <span class="bento-label" style="margin:0;">⚙️ Revisão Ativa</span>
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <span class="theme-pill" style="font-size:0.75rem;font-weight:800;padding:0.2rem 0.6rem;">${window.getActiveReviewSettings().intervals.join(`, `)}d</span>
                <button class="btn-theme" onclick="window.openReviewSettingsDialog()" style="width:auto;padding:0.2rem 0.55rem;font-size:0.7rem;background:var(--panel);color:var(--muted);border-width:2px;box-shadow:2px 2px 0px var(--shadow-color);">Trocar</button>
            </div>
        </div>
    `)}function o(){window.updateReviewStats(),window.renderStudyBlocksList()}function s(){let e=document.getElementById(`reviewFilterMateria`);if(!e)return;let t=[...new Set((window.state.studyBlocks||[]).map(e=>e.materia))].sort(),n=e.value;e.innerHTML=`<option value="all">Todas matérias</option>`+t.map(e=>`<option value="${window.escapeHtml(e)}">${window.escapeHtml(e)}</option>`).join(``),n!==`all`&&(e.value=n)}function c(){let e=window.state.studyBlocks||[],t=e.filter(e=>e.status===`overdue`).length,n=e.filter(e=>e.status===`due`).length,r=e.filter(e=>e.status===`pending`).length,i=e.filter(e=>e.status===`completed`).length,a=e=>document.getElementById(e);a(`rs-overdue`)&&(a(`rs-overdue`).textContent=t),a(`rs-due`)&&(a(`rs-due`).textContent=n),a(`rs-pending`)&&(a(`rs-pending`).textContent=r),a(`rs-completed`)&&(a(`rs-completed`).textContent=i),a(`rs-total`)&&(a(`rs-total`).textContent=e.length)}function l(){let e=document.getElementById(`add-block-dialog`);e&&(e.showModal(),document.getElementById(`materiaInput`).focus(),document.getElementById(`materiaInput`).addEventListener(`input`,d),d())}function u(){let e=document.getElementById(`add-block-dialog`);if(!e)return;e.close();let t=document.getElementById(`materiaInput`);t.removeEventListener(`input`,d),t.value=``,document.getElementById(`topicoInput`).value=``,document.getElementById(`conteudoInput`).value=``,document.getElementById(`blockColorInput`).value=`#6a6a6a`}function d(){let e=document.getElementById(`materiaInput`),t=document.getElementById(`blockColorInput`),n=e.value.trim();if(n){let e=window.state.studyBlocks.find(e=>e.materia.toLowerCase()===n.toLowerCase());e&&e.color?t.value=e.color:t.value=`#`+Math.floor(Math.random()*16777215).toString(16).padStart(6,`0`)}else t.value=`#6a6a6a`}function f(){let e=document.getElementById(`materiaInput`),t=document.getElementById(`topicoInput`),n=document.getElementById(`conteudoInput`),r=document.getElementById(`blockColorInput`),i=e.value.trim(),a=t.value.trim(),o=n.value.trim(),s=r.value;if(!i||!a||!o){window.toast?.(`Por favor, preencha todos os campos obrigatórios.`,!0);return}let c=window.getActiveReviewSettings().intervals[0]||1,l=Date.now(),u=new Date(l);u.setDate(u.getDate()+c);let d={id:crypto.randomUUID(),userId:window.currentUser?.uid||`guest`,materia:i,topico:a,conteudo:o,createdAt:l,lastReviewDate:l,nextReviewDate:u.getTime(),status:`pending`,currentIntervalIndex:0,repetition:0,color:s};window.state.studyBlocks.push(d),!window.isGuestMode&&window.currentUser&&window.saveStudyBlock&&window.saveStudyBlock(window.currentUser.uid,d),window.saveState(),window.generateReviewNotif?.(),window.toast?.(`Bloco de estudo adicionado!`),window.closeAddBlockDialog(),window.renderStudyBlocksList(),window.populateMateriaFilter()}function p(){let e=document.getElementById(`studyBlocksList`);if(!e)return;let t=window.state.studyBlocks||[],r=(document.getElementById(`reviewSearchInput`)?.value||``).toLowerCase().trim(),i=document.getElementById(`reviewFilterStatus`)?.value||`all`,a=document.getElementById(`reviewFilterMateria`)?.value||`all`,o=document.getElementById(`reviewSortOrder`)?.value||`nextReview-asc`,s=[...t];r&&(s=s.filter(e=>e.materia.toLowerCase().includes(r)||e.topico.toLowerCase().includes(r)||e.conteudo.toLowerCase().includes(r))),i!==`all`&&(s=s.filter(e=>e.status===i)),a!==`all`&&(s=s.filter(e=>e.materia===a)),s.sort((e,t)=>{let r=o,i=n?-1:1;return r===`materia`?i*(e.materia||``).localeCompare(t.materia||``):r===`created`?i*((e.createdAt||0)-(t.createdAt||0)):i*((e.nextReviewDate||0)-(t.nextReviewDate||0))});let c=window.getActiveReviewSettings(),l=c?c.name:`Mensal`,u=`
        <button class="study-block-item add-block-button" onclick="window.openAddBlockDialog()">
            <i class="fas fa-plus"></i>
            <span>Adicionar Novo Bloco</span>
        </button>
    `;if(s.length===0){e.innerHTML=(t.length===0?`<div class="review-empty-state">Nenhum bloco de estudo adicionado ainda. Clique no + para começar!</div>`:`<div class="review-empty-state">Nenhum bloco encontrado com os filtros atuais.</div>`)+u;return}e.innerHTML=s.map(e=>{let t=e.status===`completed`?`disabled`:``,n=e.status===`pending`?` style="border-left: 5px solid ${window.escapeHtml(e.color||`var(--accent)`)};"`:``;return`
            <div class="study-block-item status-${e.status}"${n}>
                <div class="block-header">
                    <h3>${window.escapeHtml(e.materia)}: ${window.escapeHtml(e.topico)}</h3>
                </div>
                <p>${window.escapeHtml(e.conteudo)}</p>
                <div class="block-meta">
                    <span class="block-settings-badge">${l}</span>
                    <small>Próx: ${new Date(e.nextReviewDate).toLocaleDateString(`pt-BR`)}</small>
                </div>
                <div class="block-actions">
                    <button class="btn-theme review-btn ${t?`completed-btn`:``}" onclick="window.openReviewBlockDialog('${e.id}')" ${t}>
                        ${e.status===`completed`?`✅ Revisado`:`🔁 Revisar`}
                    </button>
                    <button class="btn-theme delete-block-btn" onclick="window.deleteStudyBlockById('${e.id}')">🗑️</button>
                </div>
            </div>
        `}).join(``)+u}function m(e){window._reviewBlockId=e;let t=(window.state.studyBlocks||[]).find(t=>t.id===e);if(!t)return;document.getElementById(`reviewBlockTitle`).textContent=`${t.materia}: ${t.topico}`,document.getElementById(`reviewBlockConteudo`).textContent=t.conteudo,document.querySelectorAll(`#review-feedback-dialog .difficulty-btn`).forEach(e=>{e.disabled=!1});let n=document.getElementById(`review-feedback-dialog`);n&&n.showModal()}function h(e){let t=window._reviewBlockId;if(!t)return;let n=window.state.studyBlocks,r=n.findIndex(e=>e.id===t);if(r===-1)return;let i=n[r],a=window.getActiveReviewSettings(),o=a.intervals,s=i.currentIntervalIndex,c=i.status===`overdue`?i.nextReviewDate:void 0,l=window.calculateNextReview(i,a,e,c);i.lastReviewDate=l.lastReviewDate,i.nextReviewDate=l.nextReviewDate,i.currentIntervalIndex=l.currentIntervalIndex,i.repetition=l.repetition,s>=o.length-1?i.status=`completed`:i.status=l.status,window.saveState();let u=document.getElementById(`review-feedback-dialog`);u&&u.close(),window._reviewBlockId=null,window.generateReviewNotif?.(),window.renderStudyBlocksList(),window.toast?.(`✅ Revisão registrada! (${{easy:`Fácil`,medium:`Médio`,hard:`Difícil`}[e]})`,!1,3e3)}function g(){let e=document.getElementById(`review-feedback-dialog`);e&&e.close(),window._reviewBlockId=null}function _(e){confirm(`Tem certeza que deseja excluir este bloco de estudo?`)&&(window.state.studyBlocks=(window.state.studyBlocks||[]).filter(t=>t.id!==e),!window.isGuestMode&&window.currentUser&&window.deleteStudyBlock&&window.deleteStudyBlock(window.currentUser.uid,e),window.saveState(),window.generateReviewNotif?.(),window.renderStudyBlocksList(),window.toast?.(`Bloco excluído.`))}window.renderReviewPage=r,window.openAddBlockDialog=l,window.closeAddBlockDialog=u,window.addStudyBlock=f,window.renderStudyBlocksList=p,window.applyReviewFilters=o,window.populateMateriaFilter=s,window.updateReviewStats=c,window.renderReviewSettingsRow=a,window.reverseReviewSort=i,window.openReviewBlockDialog=m,window.closeReviewFeedbackDialog=g,window.submitReviewFeedback=h,window.deleteStudyBlockById=_,document.addEventListener(`DOMContentLoaded`,()=>{window.isReviewPage?.()});