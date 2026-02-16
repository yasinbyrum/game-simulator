
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

// Returns cumulative card requirement: sum of c[0..lvl-1]
// e.g. getCumulativeCardReq("Axel", 1) = c[0] = 60 (unlock)
//      getCumulativeCardReq("Axel", 2) = c[0]+c[1] = 150 (Level 2)
//      getCumulativeCardReq("Axel", 3) = c[0]+c[1]+c[2] = 290 (Level 3)
function getCumulativeCardReq(name, lvl) {
    let d = getSafe('charProgressionData');
    if (!d || !d[name] || !d[name].c) return 9999;
    let total = 0;
    for (let i = 0; i < lvl && i < d[name].c.length; i++) {
        total += d[name].c[i];
    }
    return total || 9999;
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


// Editable Player Profiles (Global State)
const DEFAULT_PROFILES = {
    "hardcore1": { name: "Hardcore 1", match: 20, win: 75, charRate: 50, pupRate: 50, actDays: 7, ads: 4, freeChest: 2, goldChest: 2, diaChest: 2, pupChest: 2 },
    "hardcore2": { name: "Hardcore 2", match: 20, win: 75, charRate: 100, pupRate: 0, actDays: 7, ads: 4, freeChest: 2, goldChest: 2, diaChest: 2, pupChest: 2 },
    "dedicated": { name: "Dedicated", match: 25, win: 45, charRate: 50, pupRate: 50, actDays: 7, ads: 4, freeChest: 2, goldChest: 2, diaChest: 2, pupChest: 2 },
    "midcore1": { name: "Midcore 1", match: 8, win: 45, charRate: 50, pupRate: 50, actDays: 7, ads: 2, freeChest: 2, goldChest: 2, diaChest: 2, pupChest: 2 },
    "midcore2": { name: "Midcore 2", match: 8, win: 45, charRate: 50, pupRate: 50, actDays: 3, ads: 2, freeChest: 2, goldChest: 2, diaChest: 2, pupChest: 2 },
    "casual": { name: "Casual", match: 2, win: 40, charRate: 50, pupRate: 50, actDays: 2, ads: 1, freeChest: 2, goldChest: 2, diaChest: 2, pupChest: 2 }
};

// Load from LocalStorage or use Defaults
try {
    const saved = localStorage.getItem('playerProfiles');
    let parsed = saved ? JSON.parse(saved) : null;

    // Validate: Must be an object and have keys (e.g. "hardcore1")
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        window.playerProfiles = parsed;
    } else {
        // saved data was empty, null, or invalid structure
        console.warn("Saved profiles invalid or empty. Using defaults.");
        window.playerProfiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
    }
} catch (e) {
    console.warn("Failed to load profiles:", e);
    window.playerProfiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
}

function getSimulationInputs() {
    // defaults
    let days = getUiVal('simDays', 7);

    // Profile Logic
    let profileKey = "hardcore1"; // Default
    let el = document.getElementById('simProfile');
    if (el) profileKey = el.value;

    // Fallback
    let profiles = window.playerProfiles || {};
    let p = profiles[profileKey] || profiles["hardcore1"] || {};

    let actDays = parseInt(p.actDays) || 7;

    return {
        // UI Inputs - Driven by Profile
        days: days,
        dailyMatches: parseInt(p.match) || 0,
        winRate: parseInt(p.win) || 50,
        minAds: parseInt(p.ads) || 0,
        maxAds: parseInt(p.ads) || 0,

        // Activity Chance (0-1)
        activityChance: actDays / 7.0,

        // Defaults for removed inputs
        minGoals: 3,
        maxGoals: 8,

        // Upgrade Ratios
        charUpgradeChance: parseInt(p.charRate) || 50,
        pupUpgradeChance: parseInt(p.pupRate) || 50,

        // Chests (Driven by Profile)
        dailyFreeChests: parseInt(p.freeChest) !== undefined ? parseInt(p.freeChest) : 2,
        dailyGoldChests: parseInt(p.goldChest) !== undefined ? parseInt(p.goldChest) : 2,
        dailyDiamondChests: parseInt(p.diaChest) !== undefined ? parseInt(p.diaChest) : 2,
        dailyPUChests: parseInt(p.pupChest) !== undefined ? parseInt(p.pupChest) : 2,

        // Flags
        doWE: getUiVal('simDoWE', false), // User Toggle
        doMissions: getUiVal('simDoMissions', false),
        doLeaderboard: getUiVal('simDoLeaderboard', false),

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
