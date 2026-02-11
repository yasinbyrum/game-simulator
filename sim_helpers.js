
// ==========================================
// SIMULATION & LOGIC HELPERS
// ==========================================

// --- SAFE VARIABLE ACCESS ---
function getSafe(varName) {
    if (!varName) return undefined;
    if (window[varName] !== undefined) return window[varName];
    try {
        let val = eval(varName);
        if (val !== undefined) return val;
    } catch (e) { }
    return undefined;
}

function getUiVal(id, def) {
    const el = document.getElementById(id);
    if (!el) return def;
    if (el.type === 'checkbox') return el.checked;
    const val = parseInt(el.value);
    return isNaN(val) ? def : val;
}

// --- DATA ACCESS HELPERS ---
function getReqForLevel(name, lvl) {
    let d = getSafe('charProgressionData');
    if (d && d[name] && d[name].c) return d[name].c[lvl - 1] || 9999;
    return 9999;
}

function getUpgradeCost(name, lvl) {
    let d = getSafe('charProgressionData');
    if (d && d[name] && d[name].g) return d[name].g[lvl - 1] || 0;
    return 0;
}

function getUpgradeXP(name, lvl) {
    let d = getSafe('charProgressionData');
    if (d && d[name] && d[name].x) return d[name].x[lvl - 1] || 0;
    return 0;
}

// --- STRING FORMATTERS ---
function getArenaName(str) {
    let arenas = getSafe('arenaData');
    let match = str.match(/Arena\s+(\d+)\s+Unlock/);
    if (match && arenas) {
        let id = parseInt(match[1]);
        let a = arenas.find(x => x.id === id);
        if (a) return `${a.n} Unlock`;
    }
    return str;
}

function getRewardName(rText) {
    if (!rText) return "";
    if (rText.includes("Arena") && rText.includes("Unlock")) {
        return getArenaName(rText);
    }
    return rText;
}

function getCleanName(name) {
    if (!name) return "";
    return name.replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
        .replace(/Ç/g, 'c').replace(/Ğ/g, 'g').replace(/İ/g, 'i').replace(/Ö/g, 'o').replace(/Ş/g, 's').replace(/Ü/g, 'u')
        .toLowerCase().replace(/[\.\s]+/g, '_').replace("-_", "_");
}

function getJpgTag(name, size) {
    const path = `img/${getCleanName(name)}.jpg`;
    const imgError = "this.onerror=null;this.src='https://via.placeholder.com/" + size + "?text=?';";
    return `<img src="${path}" ${imgError} style="width:${size}px; height:${size}px; border-radius:8px; border:1px solid #444; background:#111; object-fit:cover; flex-shrink:0;">`;
}

function getPngTag(name, size) {
    // const missingImages = new Set(["paint spray"]); // If needed
    const path = `img/${getCleanName(name)}.png`;
    const imgError = "this.onerror=null;this.src='https://via.placeholder.com/" + size + "?text=?';";
    return `<img src="${path}" ${imgError} style="width:${size}px; height:${size}px; border-radius:8px; border:1px solid #444; background:#111; object-fit:contain; flex-shrink:0;">`;
}

function getAnyImgTag(name, size = 40) {
    if (!name) return "";
    let puData = getSafe('powerUpData');
    if (puData && puData.some(p => p.n === name)) return getPngTag(name, size);
    let chestData = getSafe('chestConfigs');
    if (chestData && Object.keys(chestData).includes(name)) return getPngTag(name, size);

    // Explicit checks for Reward Chests
    if (name === "Gold Chest") return getPngTag("gold_chest", size);
    if (name === "Diamond Chest") return getPngTag("diamond_chest", size);

    let arenaData = getSafe('arenaData');
    let cleanArenaName = name.replace(" Unlock", "");
    if (arenaData && arenaData.some(a => a.n === cleanArenaName)) return getPngTag(cleanArenaName, size);
    return getJpgTag(name, size);
}

// Wrapper for Png/Jpg specific calls - kept for compatibility
function getCharImgTag(name, size) { return getJpgTag(name, size); }
function getPowerUpImgTag(name, size) { return getPngTag(name, size); }


function getSimulationInputs() {
    return {
        // UI Inputs
        days: getUiVal('simDays', 7),
        dailyMatches: getUiVal('simMatches', 10),
        winRate: getUiVal('simWinRate', 85),
        minAds: getUiVal('simAdsMin', 4),
        maxAds: getUiVal('simAdsMax', 4),
        minGoals: getUiVal('simMinGoals', 3),
        maxGoals: getUiVal('simMaxGoals', 8),
        charUpgradeChance: getUiVal('simUpgradeFreq', 80),
        pupUpgradeChance: getUiVal('simPupUpgradeFreq', 80),
        dailyPUChests: getUiVal('simDailyPUChests', 2),
        dailyFreeChests: getUiVal('simDailyFreeChests', 2),
        doWE: getUiVal('simDoWE', true),
        dailyGoldChests: getUiVal('simDailyGoldChests', 2),
        dailyDiamondChests: getUiVal('simDailyDiamondChests', 2),

        // Game Data (Read-only access)
        startCfg: {
            gold: getUiVal('simStartGold', 500),
            diamonds: getUiVal('simStartGems', 0)
        },
        levelData: getSafe('levelData') || [],
        cupRoadData: getSafe('cupRoadData') || [],
        simConfig: getSafe('simConfig') || { lossPenalty: 30 },
        charPool: getSafe('charPoolData') || [],
        winRewardsAll: getSafe('winRewardData') || {}, // Now bucket-based
        chestConfigs: getSafe('chestConfigs'),
        missionDataAll: getSafe('missionData'),
        missionCompAll: getSafe('missionCompletion'),
        loginConfig: getSafe('loginConfig'),
        weConfig: getSafe('weConfig') || [],
        slotUnlockData: getSafe('slotUnlockData') || [],
        powerUpData: getSafe('powerUpData') || [],
        charProgressionData: getSafe('charProgressionData') || {},
        charPowerData: getSafe('charPowerData') || [],
        charStatsData: getSafe('charStatsData') || {},
        arenaData: getSafe('arenaData') || [],
        scriptedChests: getSafe('scriptedChests') || [],
        botData: getSafe('botData') || [],
        matchmakingData: getSafe('matchmakingData') || [],
        shopConfig: getSafe('shopConfig') || { slots: [], priceMultipliers: {} },
        rewardChestConfig: getSafe('rewardChestConfig') || {}
    };
}
