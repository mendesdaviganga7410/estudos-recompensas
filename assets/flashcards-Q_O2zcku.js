import"./router-D--VN4K0.js";/* empty css             */var e=e=>document.getElementById(e),t=[],n=0,r=!1,i=null;function a(){return typeof crypto<`u`&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2,10)}function o(){let t=e(`auth-loading`);t&&(t.style.display=`none`);let n=e(`flashcards-content`);n&&(n.style.display=``);let r=e(`flashcards-page-content`);if(!r)return;let i=window.state.flashcards||[],a=[...new Set(i.map(e=>e.materia).filter(Boolean))];r.innerHTML=`
        <div class="bento-layout">
            <div class="bento-card col-span-3">
                <div class="status-header-block">
                    <div>
                        <span class="bento-label">🃏 Flashcards</span>
                    </div>
                    <div style="display:flex;gap:0.5rem;">
                        <button class="btn-theme" onclick="window.exportFlashcardTemplate()" style="padding:0.3rem 0.7rem;font-size:0.75rem;width:auto;">📤 Exportar Template</button>
                        <button class="btn-theme" onclick="document.getElementById('flashcardImportInput').click()" style="padding:0.3rem 0.7rem;font-size:0.75rem;width:auto;">📥 Importar</button>
                        <input type="file" id="flashcardImportInput" accept=".json,.csv" style="display:none;" onchange="window.importFlashcards(event)">
                    </div>
                </div>
                <div class="status-metrics">
                    <div class="status-metrics-row">
                        <div class="metric-block">
                            <span class="bento-label">📦 Total</span>
                            <span class="bento-title" id="fc-total">${i.length}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bento-card col-span-3">
                <div class="toolbar-row">
                    <div class="toolbar-search">
                        <input type="text" id="fcSearchInput" placeholder="🔍 Buscar flashcards..." oninput="window.filterFlashcards()" autocomplete="off">
                    </div>
                    <div class="toolbar-filters">
                        <select id="fcFilterMateria" onchange="window.filterFlashcards()">
                            <option value="all">📖 Todas</option>
                            ${a.map(e=>`<option value="${e}">${e}</option>`).join(``)}
                        </select>
                    </div>
                    <button class="btn-theme" onclick="window.openAddFlashcardDialog()" style="padding:0.3rem 0.7rem;font-size:0.75rem;white-space:nowrap;">➕ Adicionar</button>
                </div>
            </div>
            <div class="bento-card col-span-3">
                <div class="status-header-block">
                    <span class="bento-label">📇 Seus Flashcards</span>
                </div>
                <div id="fcGridContainer"></div>
            </div>
        </div>
    `,s()}function s(){let t=e(`fcGridContainer`);if(!t)return;let n=window.state.flashcards||[];if(n.length===0){t.innerHTML=`
            <div style="text-align:center;padding:2rem 1rem;color:var(--muted);">
                <p style="font-size:1.2rem;margin-bottom:0.5rem;">📭 Nenhum flashcard ainda</p>
                <p style="font-size:0.85rem;">Clique em <strong>Adicionar</strong> para criar seu primeiro flashcard, ou use <strong>Importar</strong> para carregar um arquivo JSON ou CSV.</p>
            </div>
        `;return}t.innerHTML=`
        <div class="flashcard-grid">
            ${n.map(e=>{let t=e.color||`var(--accent)`;return`
                    <div class="flashcard-item" onclick="window.openFlashcardStudy('${e.id}')">
                        <div class="flashcard-color-bar" style="background:${t};"></div>
                        <div class="flashcard-front">${window.escapeHtml?window.escapeHtml(e.front):e.front}</div>
                        ${e.materia?`<span class="flashcard-materia-tag">${e.materia}</span>`:``}
                        <div class="flashcard-actions">
                            <button onclick="event.stopPropagation();window.openAddFlashcardDialog('${e.id}')" title="Editar">✏️</button>
                            <button onclick="event.stopPropagation();window.deleteFlashcard('${e.id}')" title="Excluir">🗑️</button>
                        </div>
                    </div>
                `}).join(``)}
        </div>
    `}function c(t){i=t||null;let n=e(`add-flashcard-dialog`);if(!n)return;let r=e(`add-flashcard-dialog`)?.querySelector(`h3`);r&&(r.textContent=t?`✏️ Editar Flashcard`:`➕ Novo Flashcard`);let a=e(`flashcardFrontInput`),o=e(`flashcardBackInput`),s=e(`flashcardMateriaInput`),c=e(`flashcardColorInput`);if(t){let e=(window.state.flashcards||[]).find(e=>e.id===t);e&&(a&&(a.value=e.front),o&&(o.value=e.back),s&&(s.value=e.materia||``),c&&(c.value=e.color||`#6a6a6a`))}else a&&(a.value=``),o&&(o.value=``),s&&(s.value=``),c&&(c.value=`#6a6a6a`);n.showModal()}function l(){let t=e(`add-flashcard-dialog`);t&&t.close(),i=null}function u(){let t=e(`flashcardFrontInput`),n=e(`flashcardBackInput`),r=e(`flashcardMateriaInput`),c=e(`flashcardColorInput`),u=t?.value.trim()||``,d=n?.value.trim()||``;if(!u||!d){window.toast?.(`Preencha a frente e o verso do flashcard.`,!0);return}let f=window.state.flashcards||[];if(i){let e=f.findIndex(e=>e.id===i);e!==-1&&(f[e].front=u,f[e].back=d,f[e].materia=r?.value.trim()||``,f[e].color=c?.value||`#6a6a6a`),window.toast?.(`✅ Flashcard atualizado!`)}else f.push({id:a(),front:u,back:d,materia:r?.value.trim()||``,color:c?.value||`#6a6a6a`,createdAt:Date.now()}),window.toast?.(`✅ Flashcard adicionado!`);window.saveState?.(),l(),s(),o()}function d(e){if(!confirm(`Excluir este flashcard?`))return;let t=window.state.flashcards||[],n=t.findIndex(t=>t.id===e);n!==-1&&(t.splice(n,1),window.saveState?.(),s(),o(),window.toast?.(`🗑️ Flashcard excluído.`))}function f(i){let a=window.state.flashcards||[];if(i){let e=a.findIndex(e=>e.id===i);if(e===-1)return;t=a.slice(e).concat(a.slice(0,e))}else t=[...a];if(t.length===0){window.toast?.(`Nenhum flashcard para estudar.`,!0);return}n=0,r=!1,g();let o=e(`flashcard-study-dialog`);o&&o.showModal()}function p(){let n=e(`flashcard-study-dialog`);n&&n.close(),t=[]}function m(){r=!r,g()}function h(){if(n++,n>=t.length){let t=e(`flashcardStudyContent`);t&&(t.innerHTML=`<p style="font-size:1.5rem;font-weight:900;">🎉 Todos os flashcards revisados!</p>`);let n=e(`flashcardFlipBtn`),r=e(`flashcardNextBtn`);n&&(n.style.display=`none`),r&&(r.style.display=`none`);return}r=!1,g()}function g(){let i=e(`flashcardStudyContent`),a=e(`flashcardFlipBtn`),o=e(`flashcardNextBtn`);if(!i)return;let s=t[n];if(!s)return;let c=t.length,l=n+1;a&&(a.style.display=``),o&&(o.style.display=`none`),r?(i.innerHTML=`
            <span style="font-size:0.7rem;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;">${l} / ${c}</span>
            <div class="flashcard-study-front">${window.escapeHtml?window.escapeHtml(s.front):s.front}</div>
            <div class="flashcard-study-back">${window.escapeHtml?window.escapeHtml(s.back):s.back}</div>
            ${s.materia?`<span class="flashcard-materia-tag" style="margin-top:0.5rem;">${s.materia}</span>`:``}
        `,o&&(o.style.display=``)):i.innerHTML=`
            <span style="font-size:0.7rem;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;">${l} / ${c}</span>
            <div class="flashcard-study-front">${window.escapeHtml?window.escapeHtml(s.front):s.front}</div>
            ${s.materia?`<span class="flashcard-materia-tag" style="margin-top:0.5rem;">${s.materia}</span>`:``}
        `}function _(e){let t=e.target,n=t?.files?.[0];if(!n)return;let r=n.name.split(`.`).pop()?.toLowerCase(),i=new FileReader;i.onload=()=>{let e=i.result,t=[];try{if(r===`json`){let n=JSON.parse(e);if(!Array.isArray(n))throw Error(`JSON deve ser um array`);t=n.map(e=>({front:String(e.front||e.frente||e.Frente||e.pergunta||``),back:String(e.back||e.verso||e.Verso||e.resposta||``),materia:e.materia||e.Materia||e.tag||``}))}else if(r===`csv`){let n=e.split(`
`).map(e=>e.trim()).filter(Boolean),r=n[0]?.toLowerCase().includes(`frente`)||n[0]?.toLowerCase().includes(`front`)?1:0;for(let e=r;e<n.length;e++){let r=n[e].split(`,`).map(e=>e.trim().replace(/^"(.*)"$/,`$1`));r.length>=2&&t.push({front:r[0],back:r[1],materia:r[2]||``})}}else{window.toast?.(`Formato não suportado. Use .json ou .csv.`,!0);return}}catch(e){window.toast?.(`Erro ao ler arquivo. Verifique o formato.`,!0),console.error(`Import error:`,e);return}if(t.length===0){window.toast?.(`Nenhum flashcard encontrado no arquivo.`,!0);return}let n=window.state.flashcards||[];t.forEach(e=>{e.front&&e.back&&n.push({id:a(),front:e.front,back:e.back,materia:e.materia||``,color:`#6a6a6a`,createdAt:Date.now()})}),window.saveState?.(),s(),o(),window.toast?.(`✅ ${t.length} flashcards importados!`)},i.readAsText(n),t.value=``}function v(){let e=[{front:`Qual a capital do Brasil?`,back:`Brasília`,materia:`Geografia`},{front:`O que é HTML?`,back:`HyperText Markup Language`,materia:`Programação`}],t=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`flashcards-template.json`,r.click(),URL.revokeObjectURL(n),window.toast?.(`📤 Template exportado: ${e.length} flashcards de exemplo.`)}function y(){let t=e(`fcSearchInput`)?.value.toLowerCase()||``,n=e(`fcFilterMateria`)?.value||`all`,r=(window.state.flashcards||[]).filter(e=>!(t&&!e.front.toLowerCase().includes(t)&&!(e.back||``).toLowerCase().includes(t)||n!==`all`&&e.materia!==n)),i=e(`fcGridContainer`);if(!i)return;if(r.length===0){i.innerHTML=`<div style="text-align:center;padding:2rem 1rem;color:var(--muted);"><p>🔍 Nenhum flashcard encontrado.</p></div>`;return}i.innerHTML=`
        <div class="flashcard-grid">
            ${r.map(e=>{let t=e.color||`var(--accent)`;return`
                    <div class="flashcard-item" onclick="window.openFlashcardStudy('${e.id}')">
                        <div class="flashcard-color-bar" style="background:${t};"></div>
                        <div class="flashcard-front">${window.escapeHtml?window.escapeHtml(e.front):e.front}</div>
                        ${e.materia?`<span class="flashcard-materia-tag">${e.materia}</span>`:``}
                        <div class="flashcard-actions">
                            <button onclick="event.stopPropagation();window.openAddFlashcardDialog('${e.id}')" title="Editar">✏️</button>
                            <button onclick="event.stopPropagation();window.deleteFlashcard('${e.id}')" title="Excluir">🗑️</button>
                        </div>
                    </div>
                `}).join(``)}
        </div>
    `;let a=e(`fc-total`);a&&(a.textContent=String(r.length))}window.renderFlashcardsPage=o,window.renderFlashcardGrid=s,window.openAddFlashcardDialog=c,window.closeAddFlashcardDialog=l,window.addFlashcard=u,window.deleteFlashcard=d,window.openFlashcardStudy=f,window.closeFlashcardStudy=p,window.flipFlashcard=m,window.nextFlashcardStudy=h,window.importFlashcards=_,window.exportFlashcardTemplate=v,window.filterFlashcards=y;