// ==========================================
// 1. GLOBAL STATE & HELPERS
// ==========================================
console.log("✅ LOGIC.JS LOADED: FINAL GOLD VERSION (v86 - Stats Update)");

const fileMap = {
    'charPoolData': 'data_assets.js',
    'charStatsData': 'data_assets.js', // YENİ EKLENDİ
    'powerUpData': 'data_assets.js',
    'xpGainData': 'data_assets.js',
    'goldCostData': 'data_assets.js',
    'cardReqData': 'data_assets.js',
    'levelData': 'data_progression.js',
    'cupRoadData': 'data_progression.js',
    'arenaData': 'data_progression.js',
    'simConfig': 'data_core.js',
    'missionData': 'data_core.js',
    'winRewardData': 'data_core.js',
    'weConfig': 'data_core.js',
    'rewardChestConfig': 'data_core.js',
    'loginConfig': 'data_core.js',
    'leaderboardConfig': 'data_core.js',
    'chestConfigs': 'data_core.js',
    'scriptedChests': 'data_core.js',
    'missionCompletion': 'data_core.js',
    'startConfig': 'data_core.js',
    'slotUnlockData': 'data_core.js'
};

// Excel Library Loader
if (!window.XLSX) {
    let script = document.createElement('script');
    script.src = "https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js";
    document.head.appendChild(script);
}






// --- IMAGE HELPER FUNCTIONS ---
// (Moved to sim_helpers.js, but keeping Set for now if used locally?)
const missingImages = new Set(["paint spray"]);


window.updateVal = function (pathStr, val) {
    try {
        let finalVal = val;
        if (!isNaN(parseInt(val)) && val !== '' && val !== '-') finalVal = parseInt(val);
        eval(`${pathStr} = ${JSON.stringify(finalVal)}`);

        let rootVar = pathStr.split('.')[0] || pathStr.split('[')[0];
        let allSaveBtns = document.querySelectorAll('.btn-save-sys');
        allSaveBtns.forEach(btn => {
            if (btn.id.includes(rootVar)) {
                btn.innerHTML = "💾 SAVE *";
                btn.style.background = "#ef4444";
            }
        });
    } catch (e) { console.error("Update Error:", e); }
};

let currentDailyBucket = 1, currentXpBucket = 1, currentGoldBucket = 1, currentCardBucket = 1, currentChestTab = "Rookie Chest", currentLBBucket = 1;
let currentMissionBucket = 1;
let currentWinBucket = 1;
let currentWEBucket = 1;
let currentDailyFixedBucket = 1;
let playerInventory = {}, playerPowerUps = {};
const rarityWeight = { "Rookie": 1, "Pro": 2, "Champion": 3, "Legendary": 4, "Exclusive": 5 };

// ==========================================
// DATA ALIASES (FIX FOR MISSING VARIABLES)
// ==========================================
// These variables are referenced in UI (Save/Export) but stored inside charProgressionData or distinct.
// Mapping them ensures buttons work.
try {
    if (typeof charProgressionData !== 'undefined') {
        window.xpGainData = charProgressionData;
        window.goldCostData = charProgressionData;
        window.cardReqData = charProgressionData;
    }
    if (typeof charStatsData === 'undefined') {
        // Fallback if charStatsData is missing in data_assets.js
        window.charStatsData = {};
    }
} catch (e) { console.error("Alias Error:", e); }

// ==========================================
// 2. NAVIGASYON
// ==========================================
window.nav = function (id) {

    // FORCE HIDE ALL first
    document.querySelectorAll('.content-area').forEach(e => {
        e.classList.remove('active');
        e.style.display = 'none';
    });
    document.querySelectorAll('.nav-link').forEach(e => e.classList.remove('active'));

    // FORCE SHOW TARGET
    let el = document.getElementById(id);
    if (el) {
        el.classList.add('active');
        el.style.display = 'flex';
    } else {
        console.error(`  ❌ Element not found: #${id}`);
    }
    // Highlight active link
    if (typeof event !== 'undefined' && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    if (id === 'char-editor') {
        renderCharEditor();
        injectSaveButton('char-editor', 'charStatsData');
        injectExcelButtons('char-editor', ['charPoolData', 'charStatsData']);
    }
    else if (id === 'char-power') {
        renderCharPower();
        attachCharFilters();
        injectSaveButton('char-power', 'charStatsData');
        injectExcelButtons('char-power', ['charPoolData', 'charStatsData']);
    }

    else if (id === 'player-profile') { renderPlayerProfile(); }
    else if (id === 'arenas') { renderArenas(); injectSaveButton('arenas', 'arenaData'); injectExcelButtons('arenas', 'arenaData'); }
    else if (id === 'cup-road') { renderCupRoad(); injectSaveButton('cup-road', 'cupRoadData'); injectExcelButtons('cup-road', 'cupRoadData'); }
    else if (id === 'level-up') { renderLevels(); injectSaveButton('level-up', 'levelData'); injectExcelButtons('level-up', 'levelData'); }
    else if (id === 'inventory') {
        const invBody = document.getElementById('inventoryBody');
        // Always try to render main inventory
        renderInventory();
        // Also ensure PowerUps are rendered
        if (typeof renderPowerUps === 'function') renderPowerUps();
    }
    else if (id === 'xp-gain') { createTabs('xpTabs', 'setXpBucket', currentXpBucket); renderProgressionTable('xpBody', 'x', currentXpBucket); injectSaveButton('xp-gain', 'xpGainData'); injectExcelButtons('xp-gain', 'xpGainData'); }
    else if (id === 'gold-req') { createTabs('goldTabs', 'setGoldBucket', currentGoldBucket); renderProgressionTable('goldBody', 'g', currentGoldBucket); injectSaveButton('gold-req', 'goldCostData'); injectExcelButtons('gold-req', 'goldCostData'); }
    else if (id === 'card-req') { createTabs('cardTabs', 'setCardBucket', currentCardBucket); renderProgressionTable('cardBody', 'c', currentCardBucket); injectSaveButton('card-req', 'cardReqData'); injectExcelButtons('card-req', 'cardReqData'); }
    else if (id === 'leaderboard') { createTabs('lbTabs', 'setLBBucket', currentLBBucket); renderLeaderboard(); injectSaveButton('leaderboard', 'leaderboardConfig'); injectExcelButtons('leaderboard', 'leaderboardConfig'); }
    else if (id === 'daily-login') { renderDaily(); injectSaveButton('daily-login', 'loginConfig'); }
    else if (id === 'watch-earn') { renderWE(); injectSaveButton('watch-earn', 'weConfig'); }
    else if (id === 'reward-chests') { renderRewardChests(); injectSaveButton('reward-chests', 'rewardChestConfig'); }
    else if (id === 'missions') { createTabs('missionTabs', 'setMissionBucket', currentMissionBucket); renderMissions(); injectSaveButton('missions', ['missionData', 'missionCompletion']); injectExcelButtons('missions', 'missionData'); }
    else if (id === 'win-rewards') { renderWinRewards(); injectSaveButton('win-rewards', 'winRewardData'); }
    else if (id === 'chest-config') { renderChestTabs(); renderChestConfigViz(); renderScriptedChestUI(); updateManualBucketOptions(); injectSaveButton('chest-config', ['chestConfigs', 'simConfig']); injectExcelButtons('chest-config', 'chestConfigs'); }
    else if (id === 'power-ups') { renderPowerUps(); renderSlotConfig(); injectSaveButton('power-ups', ['powerUpData', 'slotUnlockData']); injectExcelButtons('power-ups', 'powerUpData'); }
};

function attachCharFilters() {
    ['charBucketSelect', 'charRaritySelect'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.onchange = renderCharPower;
    });
    ['editorBucketSelect', 'editorRaritySelect'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.onchange = renderCharEditor;
    });
}

// ==========================================
// 3. UI HELPER & RENDER (ROBUST)
// ==========================================
function createTabs(cid, fn, active) { const el = document.getElementById(cid); if (el) el.innerHTML = [1, 2, 3, 4, 5].map(i => `<button class="tab-btn ${i === active ? 'active' : ''}" onclick="${fn}(${i})">Bucket ${i}</button>`).join(''); }
window.setLBBucket = function (b) { currentLBBucket = b; renderLeaderboard(); createTabs('lbTabs', 'setLBBucket', currentLBBucket); }
window.setMissionBucket = function (b) { currentMissionBucket = b; renderMissions(); createTabs('missionTabs', 'setMissionBucket', currentMissionBucket); };
window.updateGrandPrizeUI = function (key, val) { let finalVal = val; if (!isNaN(parseInt(val)) && val !== '') finalVal = parseInt(val); let path = `missionCompletion.b${currentMissionBucket}.${key}`; updateVal(path, finalVal); };

function renderMissions() {
    let allData = getSafe('missionData');
    let allComp = getSafe('missionCompletion');
    let el = document.getElementById('missionBody');
    if (!allData) { if (el) el.innerHTML = "<tr><td colspan='6'>Mission Data Missing.</td></tr>"; return; }
    let d = allData['b' + currentMissionBucket];
    if (d && el) {
        el.innerHTML = d.map((x, i) => `<tr style="font-size:1.15rem;"><td>#${i + 1}</td><td><input class="edit" value="${x.task}" onchange="updateVal('missionData.b${currentMissionBucket}[${i}].task',this.value,false)" style="font-size:1.15rem;"></td><td><input class="edit" type="number" value="${x.req}" style="width:50px; font-size:1.15rem;" onchange="updateVal('missionData.b${currentMissionBucket}[${i}].req',this.value)"></td><td><input class="edit" value="${x.type}" onchange="updateVal('missionData.b${currentMissionBucket}[${i}].type',this.value,false)" style="font-size:1.15rem;"></td><td><input class="edit" type="number" value="${x.amt}" style="width:60px; font-size:1.15rem;" onchange="updateVal('missionData.b${currentMissionBucket}[${i}].amt',this.value)"></td><td><input class="edit" type="number" value="${x.xp}" style="width:50px; font-size:1.15rem;" onchange="updateVal('missionData.b${currentMissionBucket}[${i}].xp',this.value)"></td></tr>`).join('');
    }
    if (allComp) {
        let mc = allComp['b' + currentMissionBucket];
        if (mc) {
            if (document.getElementById('mrType1')) document.getElementById('mrType1').value = mc.r1t;
            if (document.getElementById('mrAmt1')) document.getElementById('mrAmt1').value = mc.r1a;
            if (document.getElementById('mrType2')) document.getElementById('mrType2').value = mc.r2t;
            if (document.getElementById('mrAmt2')) document.getElementById('mrAmt2').value = mc.r2a;
        }
    }
}

function renderLeaderboard() {
    let data = getSafe('leaderboardConfig');
    const el = document.getElementById('lbBody');
    if (!data) { if (el) el.innerHTML = "<tr><td colspan='5'>Leaderboard Missing.</td></tr>"; return; }
    let bucketKey = 'b' + currentLBBucket;
    let bucketData = data[bucketKey];
    if (bucketData && el) {
        el.innerHTML = bucketData.map((d, i) => `<tr style="font-size:1.15rem;"><td>${d.rank}</td><td><input class="edit" value="${d.t1}" onchange="updateVal('leaderboardConfig.${bucketKey}[${i}].t1', this.value, false)" style="font-size:1.15rem;"></td><td><input class="edit" value="${d.t1 === '-' ? '-' : d.a1}" onchange="updateVal('leaderboardConfig.${bucketKey}[${i}].a1', this.value)" style="font-size:1.15rem;"></td><td><input class="edit" value="${d.t2}" onchange="updateVal('leaderboardConfig.${bucketKey}[${i}].t2', this.value, false)" style="font-size:1.15rem;"></td><td><input class="edit" value="${d.t2 === '-' ? '-' : d.a2}" onchange="updateVal('leaderboardConfig.${bucketKey}[${i}].a2', this.value)" style="font-size:1.15rem;"></td></tr>`).join('');
    }
}

function renderCupRoad() {
    let data = getSafe('cupRoadData');
    let arenas = getSafe('arenaData');
    const el = document.getElementById('cupBody');
    if (!data || !el) { if (el) el.innerHTML = "<tr><td colspan='9'>No Cup Road Data.</td></tr>"; return; }





    el.innerHTML = data.map((d, i) => `
    <tr style="font-size:1.1rem;">
        <td class="drag-handle">☰</td>
        <td><input class="edit" value="${d.cup !== undefined ? d.cup : ''}" onchange="updateVal('cupRoadData[${i}].cup', this.value)" style="font-size:1.1rem;"></td>
        <td><input class="edit" value="${getRewardName(d.r1 || '')}" onchange="updateVal('cupRoadData[${i}].r1', this.value, false)" title="Internal: ${d.r1}" style="font-size:1.1rem;"></td>
        <td><input class="edit" value="${d.a1 !== undefined && d.a1 !== null ? d.a1 : ''}" onchange="updateVal('cupRoadData[${i}].a1', this.value, false)" style="font-size:1.1rem;"></td>
        <td><input class="edit" value="${getRewardName(d.r2 || '')}" onchange="updateVal('cupRoadData[${i}].r2', this.value, false)" style="font-size:1.1rem;"></td>
        <td><input class="edit" value="${d.a2 !== undefined && d.a2 !== null ? d.a2 : ''}" onchange="updateVal('cupRoadData[${i}].a2', this.value, false)" style="font-size:1.1rem;"></td>
        <td><input class="edit" value="${d.feat || ''}" onchange="updateVal('cupRoadData[${i}].feat', this.value, false)" style="font-size:1.1rem;"></td>
        <td onclick="if(confirm('Delete?')) { cupRoadData.splice(${i},1); renderCupRoad(); }" style="cursor:pointer; text-align:center;">🗑️</td>
    </tr>`).join('');

    try { new Sortable(el, { handle: '.drag-handle', onEnd: (evt) => { const item = cupRoadData.splice(evt.oldIndex, 1)[0]; cupRoadData.splice(evt.newIndex, 0, item); renderCupRoad(); } }); } catch (e) { }
}

function renderLevels() {
    let data = getSafe('levelData');
    const el = document.getElementById('lvlBody');
    if (!data || !el) { if (el) el.innerHTML = "<tr><td colspan='9'>No Level Data.</td></tr>"; return; }

    el.innerHTML = data.map((d, i) => {
        if (d.l === 1) return ''; // User requested to hide Level 1
        return `
    <tr style="font-size:1.1rem;">
        <td class="drag-handle">☰</td>
        <td>${d.l}</td>
        <td><input class="edit" value="${d.req !== undefined ? d.req : 0}" onchange="updateVal('levelData[${i}].req', this.value)" style="font-size:1.1rem;"></td>
        <td><input class="edit" value="${d.r1t || ''}" onchange="updateVal('levelData[${i}].r1t', this.value, false)" style="font-size:1.1rem;"></td>
        <td><input class="edit" value="${d.r1a || ''}" onchange="updateVal('levelData[${i}].r1a', this.value)" style="font-size:1.1rem;"></td>
        <td><input class="edit" value="${d.r2t || ''}" onchange="updateVal('levelData[${i}].r2t', this.value, false)" style="font-size:1.1rem;"></td>
        <td><input class="edit" value="${d.r2a || ''}" onchange="updateVal('levelData[${i}].r2a', this.value)" style="font-size:1.1rem;"></td>
        <td><input class="edit" value="${d.ul || ''}" onchange="updateVal('levelData[${i}].ul', this.value, false)" style="font-size:1.1rem;"></td>
        <td onclick="if(confirm('Delete level?')) { levelData.splice(${i},1); renderLevels(); }" style="cursor:pointer; text-align:center;">🗑️</td>
    </tr>`;
    }).join('');
}

function renderSlotConfig() {
    let data = getSafe('slotUnlockData');
    const el = document.getElementById('slotConfigContainer');
    if (!data || !el) { if (el) el.innerHTML = "No Slot Data."; return; }

    let html = `<div style="display:flex; gap:20px; flex-wrap:wrap; align-items:center;">`;
    data.forEach((d, i) => { html += `<div style="display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.05); padding:8px 15px; border-radius:6px; border:1px solid #444;"><span style="color:var(--accent); font-weight:bold;">Slot ${d.slot}</span><span style="font-size:0.85rem; color:#aaa;">Req:</span><input class="edit" type="number" value="${d.req}" onchange="updateVal('slotUnlockData[${i}].req', this.value)" style="width:60px; font-weight:bold;"></div>`; });
    html += `</div>`;
    el.innerHTML = html;
}

function renderWinRewards() {
    let data = getSafe('winRewardData');
    const el = document.getElementById('winRewardBody');
    const tabsEl = document.getElementById('winRewardTabs');

    if (!data || !el) {
        if (el) el.innerHTML = "<tr><td colspan='5'>No Win Reward Data.</td></tr>";
        return;
    }

    // Create bucket tabs
    if (tabsEl) {
        tabsEl.innerHTML = [1, 2, 3, 4, 5].map(i =>
            `<button class="tab-btn ${i === currentWinBucket ? 'active' : ''}" onclick="setWinBucket(${i})">Bucket ${i}</button>`
        ).join('');
    }

    // Get data for current bucket
    let bucketKey = 'b' + currentWinBucket;
    let bucketData = data[bucketKey];

    if (bucketData && el) {
        el.innerHTML = bucketData.map((x, i) => `
        <tr style="font-size:1.1rem;">
            <td>${x.winCount}</td>
            <td><input class="edit" value="${x.type}" onchange="updateVal('winRewardData.${bucketKey}[${i}].type',this.value,false)" style="font-size:1.1rem;"></td>
            <td><input class="edit" value="${x.amt}" onchange="updateVal('winRewardData.${bucketKey}[${i}].amt',this.value)" style="font-size:1.1rem;"></td>
            <td><input class="edit" value="${x.type2 || ''}" onchange="updateVal('winRewardData.${bucketKey}[${i}].type2',this.value,false)" style="font-size:1.1rem;"></td>
            <td><input class="edit" value="${x.amt2 || ''}" onchange="updateVal('winRewardData.${bucketKey}[${i}].amt2',this.value)" style="font-size:1.1rem;"></td>
        </tr>`).join('');
    }
}

function renderScriptedChestUI() {
    let sc = getSafe('scriptedChests');
    let p = getSafe('charPoolData');

    let s1 = document.getElementById('scChar1');
    let s2 = document.getElementById('scChar2');
    if (p && s1 && s1.options.length === 0) {
        let o = p.map(c => `<option value="${c.n}">${c.n}</option>`).join('');
        s1.innerHTML = o; s2.innerHTML = o;
    }

    if (sc && sc[0]) {
        if (document.getElementById('scGold')) document.getElementById('scGold').value = sc[0].gold;
        if (document.getElementById('scChar1')) document.getElementById('scChar1').value = sc[0].c1n;
        if (document.getElementById('scAmt1')) document.getElementById('scAmt1').value = sc[0].c1a;
        if (document.getElementById('scChar2')) document.getElementById('scChar2').value = sc[0].c2n;
        if (document.getElementById('scAmt2')) document.getElementById('scAmt2').value = sc[0].c2a;
    }
}
window.updateScriptedChest = function () {
    let sc = getSafe('scriptedChests');
    if (sc && sc[0]) {
        sc[0].gold = parseInt(document.getElementById('scGold').value) || 0;
        sc[0].c1n = document.getElementById('scChar1').value;
        sc[0].c1a = parseInt(document.getElementById('scAmt1').value) || 0;
        sc[0].c2n = document.getElementById('scChar2').value;
        sc[0].c2a = parseInt(document.getElementById('scAmt2').value) || 0;
    }
};

function renderInventory() {
    const el = document.getElementById('inventoryBody'), elP = document.getElementById('pupInventoryBody');
    let charProg = getSafe('charProgressionData');
    if (el && charProg) {
        const getReqForLevel = (name, lvl) => {
            if (charProg[name] && charProg[name].c) return charProg[name].c[lvl - 1] || 9999;
            return 9999;
        };
        let validChars = Object.entries(playerInventory);
        el.innerHTML = validChars.length ? validChars.map(([k, v]) => {
            let targetLevel = v.level === 0 ? 1 : v.level + 1, reqNext = getReqForLevel(k, targetLevel), currentCards = v.cards;
            let isUpgradeable = currentCards >= reqNext, progressPct = Math.min(100, (currentCards / reqNext) * 100);
            let barColor = isUpgradeable ? '#22c55e' : '#3b82f6', barText = isUpgradeable ? `UPGRADE (${currentCards}/${reqNext})` : `${currentCards} / ${reqNext}`;
            let statusText = v.level === 0 ? `<span style="color:#f87171; font-weight:800; font-size:1.1rem;">LOCKED</span>` : `Lvl ${v.level}`;
            if (v.level === 0 && isUpgradeable) statusText = `<span style="color:#fbbf24; font-weight:bold;">READY TO UNLOCK!</span>`;
            return `<tr><td style="display:flex; align-items:center; gap:16px;">${getJpgTag(k, 65)}<div style="display:flex; flex-direction:column;"><span style="font-size:1.1rem; font-weight:bold;">${k}</span><span style="font-size:0.85rem; opacity:0.7;">${v.rarity}</span></div></td><td>${v.rarity}</td><td>${statusText}</td><td><div class="progress-bar" style="height:28px; background:#1e293b; border:1px solid #444; border-radius:6px; overflow:hidden; position:relative;"><div class="progress-fill" style="width:${progressPct}%; background:linear-gradient(90deg, ${barColor}, ${barColor}dd); height:100%; box-shadow:0 0 10px ${barColor}66;"></div><div class="progress-text" style="position:absolute; width:100%; text-align:center; font-weight:bold; font-size:0.9rem; line-height:28px; text-shadow:0 1px 2px #000; color:#fff; letter-spacing:0.5px;">${barText}</div></div></td></tr>`;
        }).join('') : '<tr><td colspan="4">No cards found.</td></tr>';
    }
    if (elP) {
        let unlocked = Object.entries(playerPowerUps).filter(([k, v]) => v.unlocked === true), locked = Object.entries(playerPowerUps).filter(([k, v]) => v.unlocked === false && v.amount > 0);
        let html = ""; const renderPuRow = (k, v, isLocked) => `<tr><td style="display:flex; align-items:center; gap:12px; color:${isLocked ? '#94a3b8' : '#fff'};">${getPngTag(k, 50)}<span style="font-weight:bold;">${k}</span></td><td>${v.star}★</td><td>${isLocked ? 'Locked' : 'Lvl ' + v.level}</td><td>x${v.amount}</td></tr>`;
        if (unlocked.length > 0) { html += `<tr><td colspan="4" style="background:#22c55e33; color:#4ade80; font-weight:bold; text-align:center;">🟢 Unlocked PowerUps (Playable)</td></tr>` + unlocked.map(([k, v]) => renderPuRow(k, v, false)).join(''); }
        if (locked.length > 0) { html += `<tr><td colspan="4" style="background:#f8717133; color:#f87171; font-weight:bold; text-align:center;">🔴 Locked PowerUps (Cards Only)</td></tr>` + locked.map(([k, v]) => renderPuRow(k, v, true)).join(''); }
        if (unlocked.length === 0 && locked.length === 0) html = '<tr><td colspan="4">No PowerUps found.</td></tr>';
        elP.innerHTML = html;
    }
}

// ==========================================
// NEW CHARACTER RENDER LOGIC (SPLIT VIEW)
// ==========================================
// ==========================================
// NEW CHARACTER RENDER LOGIC (SPLIT VIEW)
// ==========================================
window.renderCharEditor = function () {
    let pool = getSafe('charPoolData');
    let stats = getSafe('charStatsData');
    const el = document.getElementById('charStatsBody');
    const elHead = document.getElementById('charStatsHead');

    if (!pool || !stats || !el) return;

    // Filters
    let sBucket = document.getElementById('editorBucketSelect') ? document.getElementById('editorBucketSelect').value : "All";
    let sRarity = document.getElementById('editorRaritySelect') ? document.getElementById('editorRaritySelect').value : "All";

    // 1. GENERATE HEADER if empty
    if (elHead && elHead.innerHTML.trim() === "") {
        let hRow1 = "<tr><th rowspan='2' style='background:var(--card-bg); position:sticky; left:0; z-index:10;'>Character Info</th>";
        let hRow2 = "<tr>";
        for (let l = 1; l <= 12; l++) {
            hRow1 += `<th colspan='4' style='text-align:center; border-bottom:1px solid #555; background:${l % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.2)'};'>Level ${l}</th>`;
            hRow2 += `<th title="Size" style="font-size:0.75rem; padding:2px; min-width:35px;">Size</th><th title="Speed" style="font-size:0.75rem; padding:2px; min-width:35px;">Speed</th><th title="Jump" style="font-size:0.75rem; padding:2px; min-width:35px;">Jump</th><th title="Shoot" style="font-size:0.75rem; padding:2px; min-width:35px;">Shoot</th>`;
        }
        hRow1 += "</tr>"; hRow2 += "</tr>";
        elHead.innerHTML = hRow1 + hRow2;
    }

    // 2. FILTER DATA
    let list = pool.map((c, i) => {
        let cStats = stats[c.n] || [];
        return { ...c, stats: cStats, idx: i };
    });

    if (sBucket !== "All") list = list.filter(c => c.b == sBucket);
    if (sRarity !== "All") list = list.filter(c => c.r === sRarity);

    // 3. RENDER ROWS
    el.innerHTML = list.map(c => {
        let cells = "";
        for (let l = 0; l < 12; l++) {  // Level 1 to 12 (Indices 0 to 11)
            let s = c.stats[l] || [0, 0, 0, 0];
            // Ensure data integrity on render if missing
            if (!c.stats[l]) c.stats[l] = [0, 0, 0, 0];

            let bg = (l + 1) % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent';

            cells += `
            <td style="background:${bg}; padding:2px;"><input class="edit" type="number" value="${s[0]}" onchange="updateCharStat('${c.n}', ${l}, 0, this.value)" style="width:35px; text-align:center; padding:2px; font-size:1.0rem;"></td>
            <td style="background:${bg}; padding:2px;"><input class="edit" type="number" value="${s[1]}" onchange="updateCharStat('${c.n}', ${l}, 1, this.value)" style="width:35px; text-align:center; padding:2px; font-size:1.0rem;"></td>
            <td style="background:${bg}; padding:2px;"><input class="edit" type="number" value="${s[2]}" onchange="updateCharStat('${c.n}', ${l}, 2, this.value)" style="width:35px; text-align:center; padding:2px; font-size:1.0rem;"></td>
            <td style="background:${bg}; padding:2px;"><input class="edit" type="number" value="${s[3]}" onchange="updateCharStat('${c.n}', ${l}, 3, this.value)" style="width:35px; text-align:center; padding:2px; font-size:1.0rem;"></td>
            `;
        }

        return `
        <tr class="row-${c.r}">
            <td style="position:sticky; left:0; background:var(--card-bg); z-index:5; border-right:1px solid #444; box-shadow: 2px 0 5px rgba(0,0,0,0.5);">
                <div style="display:flex; align-items:center; gap:8px; padding:5px;">
                    ${getJpgTag(c.n, 90)}
                    <div style="line-height:1.1;">
                        <div style="font-weight:bold; font-size:1.0rem;">${c.n}</div>
                        <div style="font-size:0.85rem; opacity:0.7;">${c.r}</div>
                    </div>
                </div>
            </td>
            ${cells}
        </tr>`;
    }).join('');
}

window.renderCharPower = function () {
    let pool = getSafe('charPoolData');
    let stats = getSafe('charStatsData');
    const el = document.getElementById('charPowerBody');
    if (!pool || !stats || !el) return;

    // Filters
    let sBucket = document.getElementById('charBucketSelect') ? document.getElementById('charBucketSelect').value : "All";
    let sRarity = document.getElementById('charRaritySelect') ? document.getElementById('charRaritySelect').value : "All";

    let list = pool.map((c, i) => ({ ...c, stats: stats[c.n] || [], idx: i }));
    if (sBucket !== "All") list = list.filter(c => c.b == sBucket);
    if (sRarity !== "All") list = list.filter(c => c.r === sRarity);

    el.innerHTML = list.map(c => {
        let powerCols = "";
        for (let l = 0; l < 12; l++) {
            let s = c.stats[l];
            let pwr = "-";
            if (s) {
                pwr = ((s[0] + s[1] + s[2] + s[3]) / 4).toFixed(1);
                if (pwr.endsWith('.0')) pwr = pwr.slice(0, -2);
            }
            powerCols += `<td style="padding:1px; text-align:center; color:${l < c.stats.length ? '#fff' : '#555'}; font-size:0.95rem; width:40px;">${pwr}</td>`;
        }
        return `
        <tr class="row-${c.r}">
            <td style="padding: 2px 5px; white-space: nowrap; width:220px; overflow:hidden; text-overflow:ellipsis;">
                <div style="display:flex; align-items:center; gap:6px;">
                    ${getJpgTag(c.n, 70)} 
                    <span class="char-name" style="font-weight:bold; font-size:0.95rem;">${c.n}</span>
                </div>
            </td>
            <td style="text-align:center; font-size:0.95rem; width:60px;">B${c.b}</td>
            <td class="rar-${c.r}" style="font-size:0.9rem; text-align:center; width:80px;">${c.r}</td>
            ${powerCols}
        </tr>`;
    }).join('');
}

// New Helper to Update Stats
window.updateCharStat = function (charName, levelIdx, statIdx, val) {
    let v = parseInt(val);
    if (isNaN(v)) return;

    let stats = getSafe('charStatsData');
    if (stats && stats[charName]) {
        if (!stats[charName][levelIdx]) stats[charName][levelIdx] = [0, 0, 0, 0];
        stats[charName][levelIdx][statIdx] = v;

        // Re-render editor to update calculated power column
        renderCharEditor();
        // Re-render power curve too if it's visible (optional but good)
        if (document.getElementById('char-power').classList.contains('active')) renderCharPower();

        let allSaveBtns = document.querySelectorAll('.btn-save-sys');
        allSaveBtns.forEach(btn => {
            if (btn.id.includes("char-editor") || btn.id.includes("char-power")) {
                btn.innerHTML = "💾 SAVE *";
                btn.style.background = "#ef4444";
            }
        });
    }
}

function renderPowerUps() {
    let data = getSafe('powerUpData'); const el = document.getElementById('powerUpBody'); if (data && el) {
        // Filter out disabled power-ups (like Triple Goal)
        let activeData = data.filter(d => !d.disabled);
        el.innerHTML = activeData.map((d, i) => {
            // Find original index for correct updateVal path
            let originalIndex = data.findIndex(p => p.n === d.n);
            return `<tr><td><div style="display:flex; align-items:center; gap:12px;">${getPngTag(d.n, 45)}<span style="font-size:1.1rem; font-weight:800; color:#fff;">${d.n}</span></div></td><td style="color:#fbbf24; font-size:1.4rem; font-weight:bold; text-align:center;">${d.s}★</td>${[2, 3, 4, 5].map(l => `<td><div style="display:flex; gap:8px; align-items:center; justify-content:center;"><span style="font-size:1.0rem; font-weight:bold; color:#fbbf24;">G</span><input class="edit" type="number" style="width:70px; padding:4px; text-align:center; font-size:1.0rem;" value="${d['l' + l]}" onchange="updateVal('powerUpData[${originalIndex}].l${l}', this.value)"><span style="font-size:1.0rem; font-weight:bold; color:#60a5fa;">XP</span><input class="edit" type="number" style="width:45px; padding:4px; text-align:center; font-size:1.0rem;" value="${d['xp' + l]}" onchange="updateVal('powerUpData[${originalIndex}].xp${l}', this.value)"></div></td>`).join('')}</tr>`;
        }).join('');
    }
}

function renderWE() {
    let weData = getSafe('weConfig');
    const el = document.getElementById('weBody');
    const tabsEl = document.getElementById('weTabs');
    if (!weData || !el) { if (el) el.innerHTML = "<tr><td colspan='3'>No Watch & Earn Data.</td></tr>"; return; }

    // Render bucket tabs (same style as Win Rewards)
    if (tabsEl) {
        tabsEl.innerHTML = [1, 2, 3, 4, 5].map(b =>
            `<button class="tab-btn ${currentWEBucket === b ? 'active' : ''}" onclick="setWEBucket(${b})">Bucket ${b}</button>`
        ).join('');
    }

    // Get current bucket data
    let d = weData['b' + currentWEBucket] || weData['b1'] || [];

    el.innerHTML = d.map((x, i) => `
    <tr style="font-size:1.15rem;">
        <td>Step ${x.step}</td>
        <td><input class="edit" value="${x.type}" onchange="updateVal('weConfig.b${currentWEBucket}[${i}].type',this.value,false)" style="font-size:1.15rem;"></td>
        <td><input class="edit" type="number" value="${x.amt}" onchange="updateVal('weConfig.b${currentWEBucket}[${i}].amt',this.value)" style="font-size:1.15rem;"></td>
    </tr>`).join('');
}

function renderRewardChests() {
    let data = getSafe('rewardChestConfig');
    const goldEl = document.getElementById('goldChestBody');
    const diamondEl = document.getElementById('diamondChestBody');

    if (!data) {
        if (goldEl) goldEl.innerHTML = "<tr><td colspan='5'>No Reward Chest Data.</td></tr>";
        if (diamondEl) diamondEl.innerHTML = "<tr><td colspan='5'>No Reward Chest Data.</td></tr>";
        return;
    }

    // Render Gold Chest row
    if (goldEl && data.goldChest) {
        let row = "<tr>";
        for (let b = 1; b <= 5; b++) {
            let val = data.goldChest['b' + b] || 0;
            row += `<td><input class="edit" type="number" value="${val}" onchange="updateVal('rewardChestConfig.goldChest.b${b}', this.value)" style="width:80px; font-size:1.2rem; text-align:center;"></td>`;
        }
        row += "</tr>";
        goldEl.innerHTML = row;
    }

    // Render Diamond Chest row
    if (diamondEl && data.diamondChest) {
        let row = "<tr>";
        for (let b = 1; b <= 5; b++) {
            let val = data.diamondChest['b' + b] || 0;
            row += `<td><input class="edit" type="number" value="${val}" onchange="updateVal('rewardChestConfig.diamondChest.b${b}', this.value)" style="width:80px; font-size:1.2rem; text-align:center;"></td>`;
        }
        row += "</tr>";
        diamondEl.innerHTML = row;
    }
}

function renderBotIntelligence() {
    let bots = getSafe('botData');
    const el = document.getElementById('botAiBody');
    if (!bots || !el) { if (el) el.innerHTML = "<tr><td colspan='4'>No Bot Data</td></tr>"; return; }

    el.innerHTML = bots.map((b, i) => `
    <tr>
        <td>${b.id}</td>
        <td><input class="edit" value="${b.name}" onchange="updateVal('botData[${i}].name', this.value)"></td>
        <td><input type="number" class="edit" value="${b.difficulty}" onchange="updateVal('botData[${i}].difficulty', this.value)" style="width:50px;"></td>
        <td><input class="edit" value="${b.desc}" onchange="updateVal('botData[${i}].desc', this.value)"></td>
    </tr>`).join('');
}



function renderArenas() {
    let data = getSafe('arenaData');
    const el = document.getElementById('arenasBody');
    if (!data || !el) return;

    el.innerHTML = data.map((d, i) => {
        let imgHtml = (d.id <= 24) ? getPngTag(d.n, 100) : '';
        return `<tr><td style="font-size:1.25rem;">${d.id}</td><td><div style="display:flex; align-items:center; gap:12px;">${imgHtml}<input class="edit" value="${d.n}" onchange="updateVal('arenaData[${i}].n', this.value)" style="font-size:1.25rem;"></div></td><td><input class="edit" type="number" value="${d.reqLevel || 1}" onchange="updateVal('arenaData[${i}].reqLevel', this.value)" style="width:80px; font-size:1.1rem; text-align:center;"></td></tr>`;
    }).join('');
}

function renderDaily() {
    let d = getSafe('loginConfig');
    const el = document.getElementById('dailyBody');
    const tabsEl = document.getElementById('dailyTabs');
    const bucketTabsEl = document.getElementById('dailyBucketTabs');
    if (!d || !el) return;

    // Main tabs: Onboarding vs Fixed Cycle
    if (tabsEl) {
        tabsEl.innerHTML = `<button class="tab-btn ${currentDailyBucket === 1 ? 'active' : ''}" onclick="currentDailyBucket=1;renderDaily()">Onboarding</button><button class="tab-btn ${currentDailyBucket === 2 ? 'active' : ''}" onclick="currentDailyBucket=2;renderDaily()">Fixed Cycle</button>`;
    }

    // For Fixed Cycle, show bucket tabs
    if (currentDailyBucket === 2 && bucketTabsEl) {
        bucketTabsEl.innerHTML = [1, 2, 3, 4, 5].map(b =>
            `<button class="tab-btn ${currentDailyFixedBucket === b ? 'active' : ''}" onclick="setDailyFixedBucket(${b})">Bucket ${b}</button>`
        ).join('');
        bucketTabsEl.style.display = 'flex';
    } else if (bucketTabsEl) {
        bucketTabsEl.style.display = 'none';
    }

    // Render data
    if (currentDailyBucket === 1) {
        // Onboarding
        if (d.onboarding && Array.isArray(d.onboarding)) {
            el.innerHTML = d.onboarding.map((x, i) => `<tr style="font-size:1.15rem;"><td>Day ${x.day}</td><td><input class="edit" value="${x.type}" onchange="updateVal('loginConfig.onboarding[${i}].type',this.value,false)" style="font-size:1.15rem;"></td><td><input class="edit" value="${x.amt}" onchange="updateVal('loginConfig.onboarding[${i}].amt',this.value)" style="font-size:1.15rem;"></td></tr>`).join('');
        } else {
            el.innerHTML = '<tr><td colspan="3">No onboarding data</td></tr>';
        }
    } else {
        // Fixed Cycle - bucket-based
        if (d.fixed && d.fixed['b' + currentDailyFixedBucket]) {
            let bucketData = d.fixed['b' + currentDailyFixedBucket];
            el.innerHTML = bucketData.map((x, i) => `<tr style="font-size:1.15rem;"><td>Day ${x.day}</td><td><input class="edit" value="${x.type}" onchange="updateVal('loginConfig.fixed.b${currentDailyFixedBucket}[${i}].type',this.value,false)" style="font-size:1.15rem;"></td><td><input class="edit" value="${x.amt}" onchange="updateVal('loginConfig.fixed.b${currentDailyFixedBucket}[${i}].amt',this.value)" style="font-size:1.15rem;"></td></tr>`).join('');
        } else {
            el.innerHTML = '<tr><td colspan="3">No fixed cycle data</td></tr>';
        }
    }
}


window.setXpBucket = function (b) { currentXpBucket = b; renderProgressionTable('xpBody', 'x', b); createTabs('xpTabs', 'setXpBucket', b); }
window.setGoldBucket = function (b) { currentGoldBucket = b; renderProgressionTable('goldBody', 'g', b); createTabs('goldTabs', 'setGoldBucket', b); }
window.setCardBucket = function (b) { currentCardBucket = b; renderProgressionTable('cardBody', 'c', b); createTabs('cardTabs', 'setCardBucket', b); }
window.setWinBucket = function (b) { currentWinBucket = b; renderWinRewards(); }
window.setWEBucket = function (b) { currentWEBucket = b; renderWE(); }
window.setDailyFixedBucket = function (b) { currentDailyFixedBucket = b; renderDaily(); }


function renderProgressionTable(id, typeKey, bucket) {
    const el = document.getElementById(id);
    let pool = getSafe('charPoolData');
    let prog = getSafe('charProgressionData');
    if (!el || !pool || !prog) return;

    // Filter characters by selected bucket
    let chars = pool.filter(x => x.b == bucket);

    // Sort by Rarity (Rookie->Pro->...) then Name
    const rOrder = { "Rookie": 1, "Pro": 2, "Champion": 3, "Legendary": 4, "Exclusive": 5 };
    chars.sort((a, b) => {
        let rd = rOrder[a.r] - rOrder[b.r];
        if (rd !== 0) return rd;
        return a.n.localeCompare(b.n);
    });

    // Find max level to determine columns
    let maxLvl = 12;
    chars.forEach(c => {
        if (prog[c.n] && prog[c.n][typeKey]) maxLvl = Math.max(maxLvl, prog[c.n][typeKey].length);
    });

    // Generate Header (Should be done in HTML or JS once? For now assume table body update.
    // Ideally we need to update THEAD too if level count changes.
    // But existing HTML might have fixed header. Assuming user wants to see values.
    // The previous implementation was Level Rows.
    // Now we want Character Rows. 
    // This requires changing the Table Structure completely.
    // The existing structure in index.html probably expects "Level 1, Level 2" rows?
    // User complaint: "not specific to character".
    // If I keep Level Rows, I would need many columns (one per char). Too wide.
    // Transpose: Rows = Characters. Columns = Levels.
    // I need to inject a Header Row if I can.

    let container = el.parentElement; // table or tbody? 'el' is tbody (e.g. 'xpBody').
    let table = container.parentElement;
    let thead = table.querySelector('thead');

    // Determine start level (Skip Lvl 1 for XP and Gold as it is usually 0/empty)
    let startLvl = (typeKey === 'x' || typeKey === 'g') ? 2 : 1;

    if (thead) {
        let hRow = `<tr><th style="padding:5px;">Character</th><th style="padding:5px;">Rarity</th>`;
        for (let i = startLvl; i <= maxLvl; i++) hRow += `<th style="padding:5px;">Lvl ${i}</th>`;
        hRow += "</tr>";
        thead.innerHTML = hRow;
    }

    let html = "";
    chars.forEach(c => {
        let vals = (prog[c.n] && prog[c.n][typeKey]) ? prog[c.n][typeKey] : [];
        let rowHtml = `<td style="display:flex; align-items:center; gap:5px; white-space:nowrap;">${getJpgTag(c.n, 30)} <span style="font-size:1.1rem;">${c.n}</span></td><td class="rar-${c.r}" style="font-size:1.1rem;">${c.r}</td>`;

        for (let i = startLvl - 1; i < maxLvl; i++) {
            // For Gold/XP/Cards:
            // Arrays are [val1, val2...].
            // If Gold: padded with 0 at index 0 (for Lvl 1? or 1->2 cost at index 1?). 
            // We padded Gold with 0 at start. So index 0 = 0. Index 1 = 100 (Level 2 cost).
            // Logic.js uses g[lvl-2] or similar? No, getUpgradeCost uses g[lvl-1].
            // If we want to show "Level 2 Cost", we show g[1].
            // If typeKey='g', index 0 is irrelevant (0).
            // If typeKey='x', index 0 is irrelevant (0).
            // If typeKey='c', index 0 is Level 1 Req (Unlock).

            // Let's display raw array indices?
            // Column "Lvl 1":
            // If Card Req: Cost to Unlock? (c[0]).
            // If Gold: Cost to Unlock? (g[0]=0).
            // If XP: XP for Level 1? (x[0]=0).

            // Column "Lvl 2": Cost to reach Lvl 2.
            // Card: c[1]. Gold: g[1]. XP: x[1].

            // So iterating i=0 to maxLvl-1 maps to Level i+1.
            let val = vals[i] !== undefined ? vals[i] : "-";
            rowHtml += `<td>${val}</td>`;
        }
        html += `<tr>${rowHtml}</tr>`;
    });
    el.innerHTML = html;
}


window.updateManualBucketOptions = function () { const chestType = document.getElementById('manualChestType').value; const bucketSelect = document.getElementById('manualChestBucket'); if (!bucketSelect) return; let options = ""; if (chestType === "PowerUp Chest") { options = `<option value="1">B1</option><option value="2">B2</option><option value="3">B3</option><option value="4">B4</option><option value="5">B5</option>`; } else { options = `<option value="1">B1-B2</option><option value="3">B3</option><option value="4">B4</option><option value="5">B5</option>`; } bucketSelect.innerHTML = options; };
function renderChestTabs() { const el = document.getElementById('chestTabs'); let d = getSafe('chestConfigs'); if (el && d) el.innerHTML = Object.keys(d).map(k => `<button class="tab-btn ${currentChestTab === k ? 'active' : ''}" onclick="currentChestTab='${k}';renderChestTabs();renderChestConfigViz()">${k}</button>`).join(''); }
function renderChestConfigViz() {
    let d = getSafe('chestConfigs'), el = document.getElementById('chestVizContainer'); if (!el || !d) return; let c = d[currentChestTab]; if (!c) return;
    let chestImgHTML = (currentChestTab !== "PowerUp Chest") ? `<div style="margin-right:15px;">${getPngTag(currentChestTab, 70)}</div>` : "";
    if (currentChestTab === "PowerUp Chest") {
        let poolIn = c.poolSplit ? c.poolSplit.in : 70; let poolOut = c.poolSplit ? c.poolSplit.out : 30; let dailyLim = getSafe('simConfig').dailyPowerUpChestLimit || 2; let html = `<div style="margin-bottom:20px; padding:15px; background:rgba(255,255,255,0.03); border:1px solid #444; border-radius:8px;"><div style="font-weight:bold; color:var(--accent); font-size:1.2rem; margin-bottom:15px; border-bottom:1px solid #444; padding-bottom:5px;">⚡ PowerUp Chest Configuration</div><div style="display:flex; gap:40px; margin-bottom:25px; justify-content:center;"><div><div style="font-weight:bold; color:#fff; margin-bottom:5px;">Drop Pool</div><div style="display:flex; gap:10px;"><div class="sim-input-group"><label style="color:#4ade80; font-size:0.9rem;">Unlocked %</label><input type="number" class="edit" value="${poolIn}" onchange="updateVal('chestConfigs[\\'PowerUp Chest\\'].poolSplit.in', this.value)" style="width:60px;"></div><div class="sim-input-group"><label style="color:#f87171; font-size:0.9rem;">Locked %</label><input type="number" class="edit" value="${poolOut}" onchange="updateVal('chestConfigs[\\'PowerUp Chest\\'].poolSplit.out', this.value)" style="width:60px;"></div></div></div><div><div style="font-weight:bold; color:#fff; margin-bottom:5px;">Daily Limit</div><div class="sim-input-group"><label style="color:#fbbf24; font-size:0.9rem;">Max Claims</label><input type="number" class="edit" value="${dailyLim}" onchange="updateVal('simConfig.dailyPowerUpChestLimit', this.value)" style="width:60px;"></div></div></div><div style="margin-bottom:20px;"><div style="font-weight:bold; color:#a855f7; margin-bottom:5px;">🃏 PowerUp Amounts</div><table style="width:100%; font-size:1.15rem; text-align:center;"><thead><tr style="background:rgba(255,255,255,0.1);"><th style="padding:5px;">Star Rate</th><th>B1</th><th>B2</th><th>B3</th><th>B4</th><th>B5</th></tr></thead><tbody><tr><td>1★ Power</td>${[1, 2, 3, 4, 5].map(b => `<td><input class="edit" type="number" value="${c.amounts.Rookie['b' + b]}" onchange="updateVal('chestConfigs[\\'PowerUp Chest\\'].amounts.Rookie.b${b}',this.value)" style="width:40px; text-align:center;"></td>`).join('')}</tr><tr><td>2★ Power</td>${[1, 2, 3, 4, 5].map(b => `<td><input class="edit" type="number" value="${c.amounts.Pro['b' + b]}" onchange="updateVal('chestConfigs[\\'PowerUp Chest\\'].amounts.Pro.b${b}',this.value)" style="width:40px; text-align:center;"></td>`).join('')}</tr><tr><td>3★ Power</td>${[1, 2, 3, 4, 5].map(b => `<td><input class="edit" type="number" value="${c.amounts.Champion['b' + b]}" onchange="updateVal('chestConfigs[\\'PowerUp Chest\\'].amounts.Champion.b${b}',this.value)" style="width:40px; text-align:center;"></td>`).join('')}</tr></tbody></table></div><div><div style="font-weight:bold; color:var(--accent); margin-bottom:5px;">🎲 Drop Rates (%)</div><table style="width:100%; font-size:1.15rem; text-align:center;"><thead><tr style="background:rgba(255,255,255,0.1);"><th style="padding:5px;"></th><th>B1</th><th>B2</th><th>B3</th><th>B4</th><th>B5</th></tr></thead><tbody><tr><td>1★ Power</td>${[1, 2, 3, 4, 5].map(b => `<td><input class="edit" type="number" value="${c.slotProbs[0]['b' + b].R}" onchange="updateVal('chestConfigs[\\'PowerUp Chest\\'].slotProbs[0].b${b}.R',this.value)" style="width:40px; text-align:center;"></td>`).join('')}</tr><tr><td>2★ Power</td>${[1, 2, 3, 4, 5].map(b => `<td><input class="edit" type="number" value="${c.slotProbs[0]['b' + b].P}" onchange="updateVal('chestConfigs[\\'PowerUp Chest\\'].slotProbs[0].b${b}.P',this.value)" style="width:40px; text-align:center;"></td>`).join('')}</tr><tr><td>3★ Power</td>${[1, 2, 3, 4, 5].map(b => `<td><input class="edit" type="number" value="${c.slotProbs[0]['b' + b].C}" onchange="updateVal('chestConfigs[\\'PowerUp Chest\\'].slotProbs[0].b${b}.C',this.value)" style="width:40px; text-align:center;"></td>`).join('')}</tr></tbody></table></div></div>`; el.innerHTML = html; return;
    }
    let h = `<div style="margin-bottom:15px; padding-bottom:10px; display:flex; align-items:center;">${chestImgHTML}<div><div style="font-weight:bold; color:var(--gold); margin-bottom:5px;">💰 Gold Drops</div><div style="display:flex; gap:10px;">${[1, 3, 4, 5].map(b => `<div class="sim-input-group"><label>${b === 1 ? 'B1-2' : 'B' + b}</label><input type="number" class="edit" value="${c.gold['b' + b] || c.gold['b1']}" onchange="updateVal('chestConfigs[\`' + currentChestTab + '\`].gold.b${b}',this.value)" style="width:60px; font-size:1.15rem;"></div>`).join('')}</div></div></div>`;
    h += `<div style="font-weight:bold; color:#a855f7;">🃏 Card Amounts</div><table style="width:100%; font-size:1.15rem;"><thead><tr><th>Rarity</th><th>B1-B2</th><th>B3</th><th>B4</th><th>B5</th></tr></thead><tbody>${['Rookie', 'Pro', 'Champion', 'Legendary'].map(r => `<tr><td>${r}</td>${[1, 3, 4, 5].map(b => `<td><input type="number" class="edit" value="${c.amounts[r]['b' + b]}" onchange="updateVal('chestConfigs[\`' + currentChestTab + '\`].amounts.${r}.b${b}',this.value)" style="width:50px; font-size:1.15rem;"></td>`).join('')}</tr>`).join('')}</tbody></table>`;
    h += `<div style="font-weight:bold; color:var(--accent); margin-top:15px;">🎲 Slot Probabilities (%)</div><table style="width:100%; font-size:1.15rem;"><thead><tr><th>Slot</th><th>B1-B2 (R-P-C-L)</th><th>B3 (R-P-C-L)</th><th>B4 (R-P-C-L)</th><th>B5 (R-P-C-L)</th></tr></thead><tbody>`; c.slotProbs.forEach((s, i) => { h += `<tr><td style="font-size:1.15rem;">Slot ${s.id}</td>${[1, 3, 4, 5].map(b => `<td><div style="display:flex; gap:2px;"><input class="edit" value="${s['b' + b].R}" onchange="updateVal('chestConfigs[\`' + currentChestTab + '\`].slotProbs[${i}].b${b}.R',this.value)" style="width:40px; font-size:1.2rem;" title="R"><input class="edit" value="${s['b' + b].P}" onchange="updateVal('chestConfigs[\`' + currentChestTab + '\`].slotProbs[${i}].b${b}.P',this.value)" style="width:40px; font-size:1.2rem;" title="P"><input class="edit" value="${s['b' + b].C}" onchange="updateVal('chestConfigs[\`' + currentChestTab + '\`].slotProbs[${i}].b${b}.C',this.value)" style="width:40px; font-size:1.2rem;" title="C"><input class="edit" value="${s['b' + b].L}" onchange="updateVal('chestConfigs[\`' + currentChestTab + '\`].slotProbs[${i}].b${b}.L',this.value)" style="width:40px; font-size:1.2rem;" title="L"></div></td>`).join('')}</tr>`; }); el.innerHTML = h + '</tbody></table>';
}

// ==========================================
// 4. EXCEL IMPORT / EXPORT SYSTEM
window.injectSaveButton = function (containerId, varOrList) {
    const container = document.getElementById(containerId); if (!container) return;
    let header = container.querySelector('.card-header'); if (!header) return;
    let toolbar = header.querySelector('.toolbar');
    if (!toolbar) { toolbar = document.createElement('div'); toolbar.className = 'toolbar'; header.appendChild(toolbar); }

    let btnId = "btnSave_" + (Array.isArray(varOrList) ? varOrList[0] : varOrList);
    if (document.getElementById(btnId)) return;

    const btn = document.createElement('button');
    btn.id = btnId;
    btn.className = 'btn btn-save-sys';
    btn.innerHTML = '💾 SAVE';
    btn.style.cssText = "margin-left:10px; font-weight:bold;";

    btn.onclick = () => {
        let targets = Array.isArray(varOrList) ? varOrList : [varOrList];
        let pending = targets.length;
        btn.innerHTML = "⏳ SAVING...";

        targets.forEach(vName => {
            let data = getSafe(vName);
            if (!data) { pending--; return; }
            let filename = fileMap[vName] || 'data_core.js';

            fetch('/update-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: filename, varName: vName, data: data })
            })
                .then(r => { if (!r.ok) alert(`Save Failed for ${vName}`); })
                .catch(e => console.error(e))
                .finally(() => {
                    pending--;
                    if (pending <= 0) {
                        btn.innerHTML = "✅ SAVED";
                        btn.style.background = "#22c55e";
                        setTimeout(() => { btn.innerHTML = "💾 SAVE"; btn.style.background = "#6366f1"; }, 2000);
                    }
                });
        });
    };
    toolbar.appendChild(btn);
};

// ==========================================
function injectExcelButtons(containerId, varOrList) {
    const container = document.getElementById(containerId); if (!container) return;
    let header = container.querySelector('.card-header'); if (!header) return;
    let toolbar = header.querySelector('.toolbar');
    if (!toolbar) { toolbar = document.createElement('div'); toolbar.className = 'toolbar'; header.appendChild(toolbar); }
    if (toolbar.querySelector('.btn-excel-exp')) return;
    const expBtn = document.createElement('button'); expBtn.className = 'btn btn-excel-exp'; expBtn.innerHTML = '📤 Export XLSX'; expBtn.style.cssText = "margin-left:5px; background:#22c55e; color:white; font-size:0.75rem;"; expBtn.onclick = () => exportToExcel(varOrList); toolbar.appendChild(expBtn);
    const impBtn = document.createElement('button'); impBtn.className = 'btn btn-excel-imp'; impBtn.innerHTML = '📥 Import XLSX'; impBtn.style.cssText = "margin-left:5px; background:#3b82f6; color:white; font-size:0.75rem;";
    const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = '.xlsx, .xls'; fileInput.style.display = 'none';
    fileInput.onchange = (e) => importFromExcel(e, varOrList); impBtn.onclick = () => fileInput.click(); toolbar.appendChild(impBtn); toolbar.appendChild(fileInput);
}

function exportToExcel(varOrList) {
    if (!window.XLSX) { alert("Excel library loading..."); return; }
    let wb = XLSX.utils.book_new(); let targets = Array.isArray(varOrList) ? varOrList : [varOrList];
    targets.forEach(vName => { let data = getSafe(vName); if (!data) return; let sheetName = vName.substring(0, 30); let ws; if (vName === 'missionData' || vName === 'leaderboardConfig') { let flatData = []; for (let bucket in data) { if (Array.isArray(data[bucket])) { data[bucket].forEach(row => { flatData.push({ ...row, Bucket: bucket }); }); } } ws = XLSX.utils.json_to_sheet(flatData); } else { ws = XLSX.utils.json_to_sheet(data); } XLSX.utils.book_append_sheet(wb, ws, sheetName); });
    XLSX.writeFile(wb, "GameData_Export.xlsx");
}

function importFromExcel(event, varOrList) {
    if (!window.XLSX) return; let file = event.target.files[0]; if (!file) return; let reader = new FileReader();
    reader.onload = function (e) {
        let data = new Uint8Array(e.target.result); let wb = XLSX.read(data, { type: 'array' }); let targets = Array.isArray(varOrList) ? varOrList : [varOrList];
        targets.forEach(vName => { let sheetName = vName.substring(0, 30); let ws = wb.Sheets[sheetName]; if (!ws) return; let jsonData = XLSX.utils.sheet_to_json(ws); if (vName === 'missionData' || vName === 'leaderboardConfig') { let reconstructed = {}; jsonData.forEach(row => { let bucket = row.Bucket || "b1"; if (!reconstructed[bucket]) reconstructed[bucket] = []; let cleanRow = { ...row }; delete cleanRow.Bucket; reconstructed[bucket].push(cleanRow); }); updateVal(vName, reconstructed); } else { updateVal(vName, jsonData); } });
        alert("✅ Data Imported! Please refresh."); location.reload();
    }; reader.readAsArrayBuffer(file);
}

// ==========================================
// 5. SIMULATION LOGIC
// ==========================================
// Render Inventory Wrapper (for simple_nav.js)
window.renderInventory = function () {
    if (window.lastSimState && window.lastSimState.inventory) {
        if (typeof renderSimInventory === 'function') renderSimInventory(window.lastSimState.inventory);
    } else {
        // Fallback or empty
        console.warn("No simulation state found for inventory.");
    }
};

window.simulateManualChestOpen = function () {
    let type = document.getElementById('manualChestType').value;
    let b = parseInt(document.getElementById('manualChestBucket').value);
    let count = parseInt(document.getElementById('manualChestCount').value);
    let logEl = document.getElementById('manualChestLog');
    let configs = getSafe('chestConfigs');
    let conf = configs ? (configs[type] || configs["Rookie Chest"]) : null;
    if (!conf) return (logEl.innerHTML = "Chest Configs not loaded.");

    // Ensure State Exists
    if (!window.lastSimState) {
        window.lastSimState = { gold: 0, diamonds: 0, inventory: {}, powerUps: {} };
    }
    let state = window.lastSimState;

    let report = `Opener: ${count}x ${type} (B${b})\n`;
    for (let i = 0; i < count; i++) {
        let chestGold = conf.gold['b' + b] || conf.gold['b1'] || 0;
        state.gold = (state.gold || 0) + chestGold; // Update Gold

        let chestItems = [];
        if (conf.customType === "PowerUp") {
            // PowerUp Chest
            let probs = conf.slotProbs[0]['b' + b] || conf.slotProbs[0]['b1'];
            let roll = Math.random() * 100;
            let star = (roll < probs.R) ? 1 : (roll < probs.R + probs.P) ? 2 : 3;
            let amtKey = (star === 1) ? "Rookie" : (star === 2) ? "Pro" : "Champion";
            let amt = conf.amounts[amtKey]['b' + b] || conf.amounts[amtKey]['b1'];
            let pupPool = getSafe('powerUpData');

            let candidates = pupPool.filter(p => p.s === star && !p.disabled);
            if (candidates.length > 0) {
                let chosen = candidates[Math.floor(Math.random() * candidates.length)];

                // Update PowerUp State
                if (!state.powerUps[chosen.n]) state.powerUps[chosen.n] = { amount: 0, level: 0, star: chosen.s, unlocked: false };
                state.powerUps[chosen.n].amount += amt;
                if (!state.powerUps[chosen.n].unlocked) state.powerUps[chosen.n].unlocked = true; // Auto unlock on first drop? Or separate logic? Assuming unlock.

                chestItems.push(`(${star}★) ${chosen.n} x${amt}`);
            }
        } else {
            // Character Chest
            conf.slotProbs.forEach(slot => {
                let probs = slot['b' + b] || slot['b1']; let roll = Math.random() * 100;
                let r = (roll < probs.R) ? "Rookie" : (roll < probs.R + probs.P) ? "Pro" : (roll < probs.R + probs.P + probs.C) ? "Champion" : "Legendary";
                let amt = conf.amounts[r]['b' + b] || conf.amounts[r]['b1'];
                let pool = getSafe('charPoolData');
                if (pool) {
                    let filtered = pool.filter(c => c.b <= b).filter(c => c.r === r);
                    if (filtered.length > 0 && amt > 0) {
                        let char = filtered[Math.floor(Math.random() * filtered.length)];

                        // Update Character State
                        if (!state.inventory[char.n]) state.inventory[char.n] = { cards: 0, level: 1, rarity: char.r };
                        state.inventory[char.n].cards += amt;

                        chestItems.push(`${char.n} x${amt}`);
                    }
                }
            });
        }
        let goldStr = chestGold > 0 ? `${chestGold} Gold, ` : "";
        report += `Chest #${i + 1}: ${goldStr}${chestItems.join(', ')}\n`;
    }

    // Update UI
    if (typeof renderSimInventory === 'function') renderSimInventory(state.inventory);
    if (typeof renderSimPowerUps === 'function') renderSimPowerUps(state.powerUps);

    // Update Dashboard
    if (document.getElementById('resGold')) document.getElementById('resGold').innerText = state.gold;

    logEl.innerHTML = report;
}

// runSimulation moved to logic_sim.js

// --- CHART RENDERER ---
function renderCharts(stats) {
    const chartIds = ['chartGoldSource', 'chartGemSource', 'chartGoldSink', 'chartChestSource', 'chartXpSource'];

    // Destroy old charts
    if (window.myCharts) {
        chartIds.forEach(id => {
            if (window.myCharts[id]) { window.myCharts[id].destroy(); window.myCharts[id] = null; }
        });
    } else {
        window.myCharts = {};
    }

    const colors = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#ec4899', '#f97316'];

    // 0. AGGREGATE DATA for Gold Sources
    let aggrGold = {};
    Object.keys(stats.goldSources).forEach(k => {
        if (k.includes("Chest")) {
            aggrGold["Chests"] = (aggrGold["Chests"] || 0) + stats.goldSources[k];
        } else {
            aggrGold[k] = stats.goldSources[k];
        }
    });

    // 1. Gold Sources (Bar)
    let ctx1 = document.getElementById('chartGoldSource');
    if (ctx1) {
        window.myCharts['chartGoldSource'] = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: Object.keys(aggrGold),
                datasets: [{ label: 'Gold Sources', data: Object.values(aggrGold), backgroundColor: '#fbbf24' }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }

    // 2. Diamond Sources (Bar)
    let ctx2 = document.getElementById('chartGemSource');
    if (ctx2) {
        window.myCharts['chartGemSource'] = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Object.keys(stats.gemSources),
                datasets: [{ label: 'Diamond Sources', data: Object.values(stats.gemSources), backgroundColor: '#a855f7' }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }

    // 3. XP Sources (Bar) - NEW
    let ctxXp = document.getElementById('chartXpSource');
    if (ctxXp) {
        window.myCharts['chartXpSource'] = new Chart(ctxXp, {
            type: 'bar',
            data: {
                labels: Object.keys(stats.xpSources),
                datasets: [{ label: 'XP Sources', data: Object.values(stats.xpSources), backgroundColor: '#3b82f6' }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }

    // 4. Income vs Spend (Bar)
    let ctx3 = document.getElementById('chartGoldSink');
    let totalIncome = Object.values(stats.goldSources).reduce((a, b) => a + b, 0);
    if (ctx3) {
        window.myCharts['chartGoldSink'] = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: ['Total Income', 'Char Upgrades', 'PowerUp Upgrades'],
                datasets: [{
                    label: 'Gold',
                    data: [totalIncome, stats.goldSinks['Char Upgrade'] || 0, stats.goldSinks['PowerUp Upgrade'] || 0],
                    backgroundColor: ['#22c55e', '#ef4444', '#f97316']
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    // 5. Chest Sources (Bar)
    let ctx4 = document.getElementById('chartChestSource');
    if (ctx4) {
        window.myCharts['chartChestSource'] = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: Object.keys(stats.chestSources),
                datasets: [{
                    label: 'Chests',
                    data: Object.values(stats.chestSources),
                    backgroundColor: '#a855f7'
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                plugins: { legend: { display: false } }
            }
        });
    }
}

// DEFAULT INVENTORY RENDERER (Restores "It used to work" functionality)
function renderInitialInventory() {
    const el = document.getElementById('inventoryBody');
    let pool = getSafe('charPoolData');
    if (!el || !pool) return;

    // Sort by Bucket then Rarity then Name for clean initial view
    let sorted = [...pool].sort((a, b) => {
        if (a.b !== b.b) return a.b - b.b;
        const rOrder = { "Rookie": 1, "Pro": 2, "Champion": 3, "Legendary": 4 };
        if (a.r !== b.r) return rOrder[a.r] - rOrder[b.r];
        return a.n.localeCompare(b.n);
    });

    el.innerHTML = sorted.map(c => {
        let n = c.n;
        let img = getCharImgTag(n, 40);
        return `<tr style="border-bottom:1px solid rgba(255,255,255,0.1); opacity:0.7;">
            <td style="display:flex; align-items:center; gap:10px; padding:5px;">${img} <span style="font-weight:bold;">${n}</span> <span style="font-size:0.8rem; color:#aaa;">(B${c.b})</span></td>
            <td style="padding:5px;">${c.r}</td>
            <td style="text-align:center; padding:5px;">-</td>
            <td style="text-align:center; padding:5px;">-</td>
        </tr>`;
    }).join('');
}

function renderInitialPowerUps() {
    const el = document.getElementById('pupInventoryBody');
    let pool = getSafe('powerUpData');
    if (!el || !pool) return;

    // Sort by Star
    let sorted = [...pool].sort((a, b) => a.s - b.s);

    el.innerHTML = sorted.map(p => {
        let n = p.n;
        let img = getPngTag(n, 35);
        return `<tr style="border-bottom:1px solid rgba(255,255,255,0.1); opacity:0.7;">
            <td style="display:flex; align-items:center; gap:10px; padding:5px;">${img} <span style="font-weight:bold;">${n}</span></td>
            <td style="text-align:center; padding:5px;">${p.s}★</td>
            <td style="text-align:center; padding:5px;">-</td>
            <td style="text-align:center; padding:5px;">-</td>
        </tr>`;
    }).join('');
}

window.toggleAdminMode = function () {
    const body = document.body;
    const btn = document.getElementById('lockBtn');
    if (body.classList.contains('read-only')) {
        let pass = window.prompt("Enter Admin Password:");
        if (pass === null) return;
        if (pass === 'yasinbyrum') { body.classList.remove('read-only'); btn.innerHTML = "🔓"; btn.style.color = "var(--success)"; btn.style.borderColor = "var(--success)"; } else { alert("❌ Wrong Password"); }
    } else { body.classList.add('read-only'); btn.innerHTML = "🔒"; btn.style.color = "inherit"; btn.style.borderColor = "var(--border)"; }
}

// REMOVED LEGACY ONLOAD TO PREVENT RACE CONDITIONS
// window.onload moved to direct init at end of file.

// ==========================================
// PLAYER PROFILES SYSTEM
// ==========================================
let defaultProfiles = [
    {
        name: "The Tourist (F2P Casual)",
        matches: 3,
        winRate: 50,
        ads: 0,
        freeChests: 2,
        puChests: 2,
        puFreq: 0, // Doesn't upgrade much
        charFreq: 20,
        startGold: 450,
        startDiamonds: 0
    },
    {
        name: "The Grinder (F2P Hardcore)",
        matches: 10,
        winRate: 65,
        ads: 10, // Max
        freeChests: 2,
        puChests: 2,
        puFreq: 50,
        charFreq: 80, // Upgrades everything possible
        startGold: 450,
        startDiamonds: 0
    },
    {
        name: "The Dolphin (Low Spender)",
        matches: 8,
        winRate: 75,
        ads: 3,
        freeChests: 2,
        puChests: 2,
        puFreq: 80,
        charFreq: 90,
        startGold: 10000, // Starter Pack
        startDiamonds: 500
    },
    {
        name: "The Whale (High Spender)",
        matches: 20, // Max Refresh
        winRate: 95,
        ads: 0, // Skips ads
        freeChests: 2,
        puChests: 2,
        puFreq: 100, // Insta max
        charFreq: 100, // Insta max
        startGold: 1000000,
        startDiamonds: 50000
    },
    {
        name: "The Speedrunner (Skill Based)",
        matches: 10,
        winRate: 90,
        ads: 5,
        freeChests: 2,
        puChests: 2,
        puFreq: 20, // Only essential upgrades
        charFreq: 40, // Selective
        startGold: 450,
        startDiamonds: 0
    }
];

let playerProfiles = JSON.parse(localStorage.getItem('myPlayerProfiles')) || JSON.parse(JSON.stringify(defaultProfiles));

function renderPlayerProfile() {
    const el = document.getElementById('player-profile');
    if (!el) return;

    let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <h3>Player Profiles</h3>
        <div style="display:flex; gap:10px;">
            <button onclick="addProfile()" class="primary-btn">+ New Profile</button>
            <button onclick="resetProfiles()" style="background:#555;">Reset to Defaults</button>
        </div>
    </div>
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:15px;">
    `;

    playerProfiles.forEach((p, i) => {
        html += `
        <div class="card" style="border:1px solid #444;">
            <div class="card-header" style="justify-content:space-between;">
                <span class="edit-field" onclick="editProfileName(${i})">${p.name} <small>✎</small></span>
                <div>
                     <button onclick="loadProfile(${i})" style="background:#22c55e; padding:3px 8px; font-size:0.8rem; border-radius:4px; margin-right:5px;">LOAD</button>
                     <button onclick="deleteProfile(${i})" style="background:#ef4444; padding:3px 8px; font-size:0.8rem; border-radius:4px;">🗑️</button>
                </div>
            </div>
            <div style="padding:10px; font-size:0.9rem; display:flex; flex-direction:column; gap:5px;">
                <div class="sim-input-group"><label>Matches/Day:</label><input type="number" class="edit" value="${p.matches}" onchange="updateProfileVal(${i}, 'matches', this.value)" style="width:50px"></div>
                <div class="sim-input-group"><label>Win Rate (%):</label><input type="number" class="edit" value="${p.winRate}" onchange="updateProfileVal(${i}, 'winRate', this.value)" style="width:50px"></div>
                <div class="sim-input-group"><label>Ads/Day:</label><input type="number" class="edit" value="${p.ads}" onchange="updateProfileVal(${i}, 'ads', this.value)" style="width:50px"></div>
                
                <div style="display:flex; gap:10px; margin-top:5px; border-top:1px solid #333; padding-top:5px;">
                     <div style="flex:1;">
                        <small style="color:#aaa;">Upgrade Freq</small><br>
                        Char: <input type="number" class="edit" value="${p.charFreq}" onchange="updateProfileVal(${i}, 'charFreq', this.value)" style="width:40px">%
                        PU: <input type="number" class="edit" value="${p.puFreq}" onchange="updateProfileVal(${i}, 'puFreq', this.value)" style="width:40px">%
                     </div>
                     <div style="flex:1;">
                        <small style="color:#aaa;">Start Res</small><br>
                        Gold: <input type="number" class="edit" value="${p.startGold}" onchange="updateProfileVal(${i}, 'startGold', this.value)" style="width:60px">
                     </div>
                </div>
            </div>
        </div>
        `;
    });
    html += `</div>`;
    el.innerHTML = html;
}

window.loadProfile = function (idx) {
    let p = playerProfiles[idx];
    if (!p) return;

    // Set Dashboard Inputs
    if (document.getElementById('simDailyMatches')) document.getElementById('simDailyMatches').value = p.matches;
    if (document.getElementById('simWinRate')) document.getElementById('simWinRate').value = p.winRate;
    if (document.getElementById('simCharUpgradeChance')) document.getElementById('simCharUpgradeChance').value = p.charFreq;
    if (document.getElementById('simPupUpgradeFreq')) document.getElementById('simPupUpgradeFreq').value = p.puFreq;

    // Ads
    if (document.getElementById('simMaxAds')) document.getElementById('simMaxAds').value = p.ads;
    if (document.getElementById('simMinAds')) document.getElementById('simMinAds').value = Math.max(0, p.ads - 2);

    // Start Config
    if (typeof startConfig !== 'undefined') {
        startConfig.gold = parseInt(p.startGold) || 450;
        startConfig.diamonds = parseInt(p.startDiamonds) || 0;
    }

    addLog("SYSTEM", `Loaded Profile: ${p.name}`, "Settings applied to Dashboard.");
    nav('dashboard');
};

window.addProfile = function () {
    playerProfiles.push({
        name: "New Profile",
        matches: 5, winRate: 50, ads: 5,
        charFreq: 50, puFreq: 50,
        startGold: 450, startDiamonds: 0,
        freeChests: 2, puChests: 2
    });
    saveProfiles();
    renderPlayerProfile();
};

// Duplicate removed

window.deleteProfile = function (idx) {
    if (confirm("Delete this profile?")) {
        playerProfiles.splice(idx, 1);
        saveProfiles();
        renderPlayerProfile();
    }
};

window.updateProfileVal = function (idx, key, val) {
    playerProfiles[idx][key] = parseInt(val) || 0;
    saveProfiles();
};

window.editProfileName = function (idx) {
    let newName = prompt("Enter Profile Name:", playerProfiles[idx].name);
    if (newName) {
        playerProfiles[idx].name = newName;
        saveProfiles();
        renderPlayerProfile();
    }
};

window.resetProfiles = function () {
    if (confirm("Reset all profiles to default?")) {
        playerProfiles = JSON.parse(JSON.stringify(defaultProfiles));
        saveProfiles();
        renderPlayerProfile();
    }
};



// ==========================================
// DATA LOADING
// ==========================================

// ==========================================
// DATA LOADING
// ==========================================
function loadGame() {
    console.log("📂 Loading Game Data...");

    // 1. Initialize Inventory from Pool
    // Try explicit window access first, then getSafe
    let pool = (typeof window.charPoolData !== 'undefined') ? window.charPoolData : getSafe('charPoolData');
    if (!pool || pool.length === 0) {
        console.error("❌ CRITICAL: charPoolData is missing or empty!");
        // Final fallback: try to re-read from script tag? No, can't.
        // Alert user if needed, or check if data_assets.js loaded.
    } else {
        pool.forEach(c => {
            if (!playerInventory[c.n]) {
                playerInventory[c.n] = {
                    level: 1,
                    cards: 0,
                    rarity: c.r
                };
            }
        });
    }

    // 2. Initialize PowerUps
    let pups = (typeof window.powerUpData !== 'undefined') ? window.powerUpData : getSafe('powerUpData');
    if (pups) {
        pups.forEach(p => {
            if (!playerPowerUps[p.n]) {
                playerPowerUps[p.n] = {
                    level: 1,
                    amount: 0,
                    unlocked: (p.b === 1), // Unlock Bucket 1 by default
                    star: p.star || 1
                };
            }
        });
    }

    // 3. Render Initial State
    if (typeof renderInventory === 'function') renderInventory();
    if (typeof renderPowerUps === 'function') renderPowerUps();
    console.log("✅ Game Data Loaded. Pool Size:", (pool ? pool.length : 0));
}

// ==========================================
// INITIALIZATION
// ==========================================
function initApp() {
    console.log("🚀 App Initialized (vFixed)");
    try {
        loadGame(); // LOAD DATA NOW
        nav('dashboard');
        if (typeof renderPlayerProfile === 'function') renderPlayerProfile();
        console.log("✅ Initialization Complete");
        document.body.classList.add('read-only');
    } catch (e) {
        console.error("❌ CRTICAL INIT ERROR:", e);
    }
}

// PREVENT MULTIPLE INITIALIZATION
let appInitialized = false;
function safeInitApp() {
    if (appInitialized) {
        console.log("⚠️ initApp already ran, skipping duplicate call");
        return;
    }
    appInitialized = true;
    initApp();
}

// Call once when script loads
if (document.readyState === 'loading') {
    // Scripts loading, wait for DOM
    window.addEventListener('DOMContentLoaded', safeInitApp);
} else {
    // DOM already ready
    safeInitApp();
}