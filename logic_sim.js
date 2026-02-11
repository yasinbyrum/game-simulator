// LOGIC_SIM.JS - Core Simulation Engine

// getSimulationInputs() is now in sim_helpers.js

/**
 * Core Simulation Engine - Pure(ish) Function
 * @param {Object} inputs - The configuration object from getSimulationInputs()
 * @param {Boolean} isMonteCarlo - If true, suppresses logs for performance
 */
function simulateGame(inputs) {
    // 1. Initialize State
    let state = {
        gold: inputs.startCfg.gold,
        diamonds: inputs.startCfg.diamonds,
        xp: 0,
        level: 1,
        cups: 0,
        maxAchievedCups: 0,
        totalAds: 0,
        totalMissions: 0,
        totalUpgrades: 1,
        totalPupUpgrades: 0,
        logs: "",
        inventory: {},
        powerUps: {},
        stats: { goldSources: {}, gemSources: {}, goldSinks: { "Char Upgrade": 0, "PowerUp Upgrade": 0 }, chestSources: {}, xpSources: {} },
        loginDay: 0, // Total login days (0 means first login will be day 1)
        loginCycleBucket: 1 // Bucket for current fixed cycle (set when cycle starts)
    };

    // Helper: Track Stats
    const track = (cat, src, val) => {
        if (!state.stats[cat][src]) state.stats[cat][src] = 0;
        state.stats[cat][src] += val;
    };

    // Helper: Add Log
    const addLog = (type, msg, det, imgName = null) => {
        if (type === "DAY HEADER") {
            state.logs += `<div class="log-event-row evt-day-header" style="text-align:center; font-size:1.4rem; font-weight:bold; margin:30px 0 15px 0; color:var(--accent); border-bottom:2px solid #444; padding-bottom:5px; text-shadow:0 0 10px rgba(0,0,0,0.5);">📊 ${msg} 📊</div>`;
            return;
        }

        let icon = type === 'WIN' ? '✅' : type === 'LOSS' ? '❌' : type === 'LEVEL UP' ? '⭐' : type === 'UPGRADE' ? '⬆️' : type === 'TUTORIAL' ? '🎓' : type === 'SUMMARY' ? '📊' : type === 'GOALS' ? '🎯' : type === 'AD' ? '📺' : type === 'MILESTONE' ? '🏆' : type === 'CHEST' ? '🔸' : type === 'UNLOCK' ? '🔓' : type === 'LOGIN' ? '📅' : type === 'WIN REWARD' ? '🔸' : '🔸';
        if (type === "MATCH") icon = "⚽";
        if (type === "WIN") icon = "✅";
        if (type === "LOSS") icon = "❌";
        let imgHTML = (typeof getAnyImgTag === 'function') ? getAnyImgTag(imgName, 45) : '';
        state.logs += `<div class="log-event-row evt-${type.toLowerCase().replace(/ /g, '-')}"><div class="log-header">${icon} ${imgHTML} ${msg}</div><div class="log-detail">${det || ''}</div></div>`;
    };

    // Helper: Add Resource
    const addRes = (type, amt, source = "Unknown") => {
        if (source === "Cup Road" && type === "Gold") console.log(`💰 Adding Cup Road Gold: ${amt}`);
        if (type === 'Gold') { state.gold += amt; track('goldSources', source, amt); }
        else if (type === 'Diamonds') { state.diamonds += amt; track('gemSources', source, amt); }
        else if (type === 'XP') { state.xp += amt; track('xpSources', source, amt); }
    };

    // Initialize PowerUps (skip disabled ones like Triple Goal)
    inputs.powerUpData.forEach(p => {
        if (p.disabled) return; // Skip disabled power-ups
        let isStarter = p.n === "Rocket Gun" || p.n === "Giant Player";
        state.powerUps[p.n] = { star: p.s, level: 1, amount: 0, unlocked: isStarter };
    });

    // Initialize Inventory (Rookie Bucket 1)
    inputs.charPool.forEach(c => {
        if (c.r === "Rookie" && c.b === 1) { state.inventory[c.n] = { rarity: c.r, level: 1, cards: 0, bucket: c.b }; }
    });
    if (state.powerUps["Rocket Gun"]) { state.powerUps["Rocket Gun"].unlocked = true; state.powerUps["Rocket Gun"].amount = 3; }
    if (state.powerUps["Giant Player"]) { state.powerUps["Giant Player"].unlocked = true; state.powerUps["Giant Player"].amount = 3; }

    addLog("TUTORIAL", "Tutorial Reward", "Unlocked: (2★) Rocket Gun x3, (2★) Giant Player x3. 2 Slots Unlocked.");

    // Tutorial Force Upgrade
    if (state.gold >= 300) {
        let cost = 300; let oldG = state.gold; state.gold -= cost; state.xp += 20; state.totalUpgrades++;
        if (state.powerUps["Rocket Gun"]) state.powerUps["Rocket Gun"].level = 2;
        addLog("UPGRADE", "Onboarding First Step", `Rocket Gun Force Upgrade to Lvl 2. Gold: ${oldG}-${cost} = ${state.gold} Gold. XP +20`);
    }

    // INTERNAL HELPERS
    const getBucket = (c) => { let b = 1; for (let i = 0; i < inputs.cupRoadData.length; i++) { if (c >= inputs.cupRoadData[i].cup && inputs.cupRoadData[i].feat && inputs.cupRoadData[i].feat.includes("Bucket")) { let p = inputs.cupRoadData[i].feat.split(' '); if (p[1]) b = Math.max(b, parseInt(p[1])); } } return b; };
    // Use global versions from sim_helpers.js

    // --- NEW MATCHMAKING HELPERS ---
    const getOpponent = (currentCups) => {
        let range = inputs.matchmakingData.find(r => currentCups >= r.min && currentCups <= r.max);
        if (!range) range = inputs.matchmakingData[inputs.matchmakingData.length - 1]; // Fallback to last
        if (!range || !range.dist) return { name: "Unknown Bot", difficulty: 0 };

        let rand = Math.random() * 100;
        let sum = 0;
        let selectedId = "training_dummy"; // Default
        for (let botId in range.dist) {
            sum += range.dist[botId];
            if (rand <= sum) { selectedId = botId; break; }
        }

        // Find Bot Data
        let bot = inputs.botData.find(b => b.id === selectedId);
        return bot || { name: "Generic Bot", difficulty: 0 };
    };

    const calculateWinChance = (playerSkill, botDifficulty) => {
        // Find Best Char Power: (Size+Spd+Jmp+Sht)/4
        let bestPower = 0;

        // Find highest level char in inventory
        let bestChar = null;
        let maxLvl = 0;
        Object.keys(state.inventory).forEach(k => {
            if (state.inventory[k].level > maxLvl) { maxLvl = state.inventory[k].level; bestChar = k; }
        });

        if (bestChar && inputs.charStatsData[bestChar]) {
            let s = inputs.charStatsData[bestChar];
            let avgBase = (s.size + s.speed + s.jump + s.shoot) / 4;
            // Assume 10% stats increase per level
            bestPower = avgBase * (1 + (maxLvl - 1) * 0.1);
        } else {
            bestPower = 50; // Base weak power
        }

        // Formula: (Skill + (Power/3)) - BotDiff
        let powerFactor = bestPower / 3;
        let chance = (playerSkill + powerFactor) - botDifficulty;

        // Cap
        return Math.max(5, Math.min(98, chance));
    };





    // --- DAILY SHOP HELPERS ---
    const generateDailyShop = (currentBucket) => {
        let shop = { items: [] };
        let cfg = inputs.shopConfig;
        if (!cfg || !cfg.slots) return shop;

        let mult = cfg.priceMultipliers['b' + currentBucket] || 1;

        cfg.slots.forEach(slot => {
            let item = { id: slot.id, type: slot.type, currency: slot.currency, name: "Unknown", amt: 1, cost: Math.floor(slot.baseCost * mult) };

            if (slot.type === "Free") {
                item.name = "Free Gift"; item.amt = 1; item.cost = 0; item.currency = "Gold"; item.resType = "Gold"; item.resAmt = 50;
            } else if (slot.type === "Card") {
                // Pick Random Char based on bucket
                let pool = inputs.charPool.filter(c => {
                    if (c.b > currentBucket) return false;
                    // SPECIAL LOCK: Taiga (Day 2/4 Login)
                    // Ensure state is accessible or pass it. 
                    // Assuming state is in scope (inside runSimulation)
                    if (c.n === "Taiga" && (!state.inventory[c.n] || state.inventory[c.n].level === 0)) return false;
                    return true;
                });
                if (pool.length > 0) {
                    let c = pool[Math.floor(Math.random() * pool.length)];
                    item.name = c.n; item.cost = Math.floor(slot.baseCost * mult);
                    item.amt = (c.r === "Legendary" ? 1 : c.r === "Champion" ? 2 : c.r === "Pro" ? 5 : 20);
                }
            } else if (slot.type === "PowerUp") {
                let pu = inputs.powerUpData[Math.floor(Math.random() * inputs.powerUpData.length)];
                if (pu) { item.name = pu.n; item.amt = 5; }
            } else if (slot.type === "Chest") {
                item.name = "Shop Chest";
            }
            shop.items.push(item);
        });
        return shop;
    };

    const buyShopItem = (item) => {
        let bought = false;
        // Purchase Logic
        if (item.currency === "Gold" && state.gold >= item.cost) {
            state.gold -= item.cost;
            track('goldSinks', 'Shop Spend', item.cost);
            bought = true;
        } else if (item.currency === "Diamonds" && state.diamonds >= item.cost) {
            state.diamonds -= item.cost;
            track('gemSources', 'Shop Spend', -item.cost); // Negative source? Or track sink? Using gemSources for now.
            bought = true;
        } else if (item.cost === 0) {
            bought = true;
        }

        if (bought) {
            addLog("SHOP", `Bought ${item.name}`, `Cost: ${item.cost} ${item.currency}`);
            if (item.type === "Free") { addRes(item.resType, item.resAmt, "Shop Free"); }
            else if (item.type === "Card") {
                if (state.inventory[item.name]) state.inventory[item.name].cards += item.amt;
                else {
                    let meta = inputs.charPool.find(c => c.n === item.name);
                    state.inventory[item.name] = { rarity: meta ? meta.r : "Rookie", level: 1, cards: item.amt, bucket: 1 };
                }
            } else if (item.type === "PowerUp") {
                if (state.powerUps[item.name]) state.powerUps[item.name].amount += item.amt;
            } else if (item.type === "Chest") {
                openChest("Pro Chest", "Shop Purchase");
            }
        }
    };

    // ACTIONS
    // ACTIONS
    const openChest = (type, source) => {
        let conf = inputs.chestConfigs;
        // FIX: Allow Scripted Chest to pass even if not in conf
        if ((!conf || !conf[type]) && type !== "Scripted Chest" && type !== "PowerUp Chest") return;

        track('chestSources', type, 1);
        let c = conf ? conf[type] : null;
        // Use centralized helper that checks CUP ROAD FEATS (Bucket X)
        let bucket = getBucket(state.cups);

        let lootLog = [];
        // Scripted Chest Logic
        if (type === "Scripted Chest") {
            let sc = inputs.scriptedChests.find(s => s.id === type); // Or match by name if needed
            // If data uses specific ID like "Scripted Chest" but variable is array.
            // Use the first one for now or match ID?
            sc = inputs.scriptedChests[0];

            if (sc) {
                // Gold
                if (sc.gold > 0) {
                    let oldG = state.gold;
                    addRes("Gold", sc.gold, "Chest: " + type);
                    lootLog.push(`Gold x${sc.gold} (${oldG} -> ${state.gold})`);
                }
                // Char 1
                if (sc.c1n && sc.c1a > 0) {
                    if (!state.inventory[sc.c1n]) {
                        state.inventory[sc.c1n] = { rarity: "Rookie", level: 1, cards: sc.c1a, bucket: 1 }; // Defaulting
                        lootLog.push(`${sc.c1n} (New!) x${sc.c1a}`);
                    } else {
                        state.inventory[sc.c1n].cards += sc.c1a;
                        lootLog.push(`${sc.c1n} x${sc.c1a}`);
                    }
                }
                // Char 2
                if (sc.c2n && sc.c2a > 0) {
                    if (!state.inventory[sc.c2n]) {
                        state.inventory[sc.c2n] = { rarity: "Rookie", level: 1, cards: sc.c2a, bucket: 1 };
                        lootLog.push(`${sc.c2n} (New!) x${sc.c2a}`);
                    } else {
                        state.inventory[sc.c2n].cards += sc.c2a;
                        lootLog.push(`${sc.c2n} x${sc.c2a}`);
                    }
                }
            } else {
                lootLog.push("Scripted Chest Data Missing");
            }
        }

        // PowerUp Chest Logic
        else if (type === "PowerUp Chest" || (c && c.customType === "PowerUp")) {
            let available = Object.keys(state.powerUps);
            if (available.length > 0) {
                let chosen = available[Math.floor(Math.random() * available.length)];
                let amt = 5;
                if (c && c.amounts && c.amounts.Rookie) {
                    amt = c.amounts.Rookie['b' + bucket] || 5;
                }
                state.powerUps[chosen].amount += amt;
                lootLog.push(`${chosen} x${amt}`);
            } else {
                addRes("Gold", 50, "PowerUp Fallback");
                lootLog.push(`50 Gold (Fallback)`);
            }
        } else {
            // SMART DROP LOGIC (User Request)
            // 1. Determine Rate based on Player Bucket (already done via c.slotProbs selection if generic)
            // Actually, slotProbs usually defines R/P/C/L chances.
            // 2. Filter Pool:
            //    - Candidates must be <= Current Bucket.
            //    - Priorities:
            //      If Bucket 5: Try B1..B5.
            //      BUT: "B1..B4 maxed -> B5 comes out".
            //      This implies: If I pick a B1 char and it's maxed, I should try to pick a non-maxed char.
            //      Ideally, from the same bucket? Or upgrade to next bucket?
            //      User: "B1 maxed -> B2 comes out".
            //      This implies UPGRADE the drop's "Source Bucket"?
            //      Or just "Don't drop B1".
            //      If I filter out ALL Maxed B1 chars, the random selection naturally picks from B2 if available?
            //      YES. If B1_Unmaxed is empty, pool is [B2_Unmaxed]. 
            //      So random pick gives B2.
            //      This satisfies "When B1 maxed, B2 comes out".

            c.slotProbs.forEach(slot => {
                let probs = slot['b' + bucket] || slot['b1'];
                if (!probs) return;
                let roll = Math.random() * 100;
                let r = (roll < probs.R) ? "Rookie" : (roll < probs.R + probs.P) ? "Pro" : (roll < probs.R + probs.P + probs.C) ? "Champion" : "Legendary";
                let amt = c.amounts[r]['b' + bucket] || c.amounts[r]['b1'];

                // FIX: If amount is 0 (e.g. empty slot prob like Rookie Chest Slot 4 in B1), skip
                if (!amt || amt <= 0) return;

                if (inputs.charPool) {
                    // Filter Logic:
                    // 1. Match Rarity & Bucket Cap
                    // 2. Exclude "Event Locked" (Taiga)
                    // 3. Exclude MAXED chars (Level >= 12)
                    let validChars = inputs.charPool.filter(ch => {
                        if (ch.b > bucket || ch.r !== r) return false;

                        // Taiga Check: If not in inventory OR level is 0, she's locked.
                        if (ch.n === "Taiga" && (!state.inventory[ch.n] || state.inventory[ch.n].level === 0)) return false;

                        // Maxed Check (Level >= 12)
                        // If the character exists in inventory and its level is 12 or higher, it's maxed.
                        if (state.inventory[ch.n] && state.inventory[ch.n].level >= 12) return false;

                        return true;
                    });

                    // Start Logic
                    if (validChars.length > 0) {
                        let char = validChars[Math.floor(Math.random() * validChars.length)];
                        // Give cards logic...
                        if (!state.inventory[char.n]) {
                            state.inventory[char.n] = { rarity: char.r, level: 1, cards: 0, bucket: char.b };
                            lootLog.push(`${char.n} (New!) x${amt}`);
                        } else {
                            state.inventory[char.n].cards += amt;
                            lootLog.push(`${char.n} x${amt}`);
                        }
                    } else {
                        // DISTINGUISH FALLBACK REASON
                        // 1. None existed in pool for this Bucket/Rarity?
                        // 2. All were maxed?
                        let initialCandidates = inputs.charPool.filter(ch => ch.b <= bucket && ch.r === r);
                        if (initialCandidates.length === 0) {
                            addRes("Gold", 50, "No Char Available (Fallback)");
                            lootLog.push(`50 Gold (No ${r} in B${bucket})`);
                        } else {
                            // They existed but were filtered out (Maxed or Locked)
                            addRes("Gold", 50, "Maxed Char Fallback");
                            lootLog.push(`50 Gold (Duplicate)`);
                        }
                    }
                }
            });
        }

        // Gold (Generic Chests Only)
        if (c) {
            let gMin = 0, gMax = 0;
            // Support both old 'goldMin/Max' and new 'gold' fixed value
            if (c.goldMin) {
                gMin = c.goldMin['b' + bucket] || c.goldMin['b1'] || 0;
                gMax = c.goldMax['b' + bucket] || c.goldMax['b1'] || 0;
            } else if (c.gold) {
                gMin = c.gold['b' + bucket] || c.gold['b1'] || 0;
                gMax = gMin; // Fixed amount
            }

            if (gMax > 0) {
                let amt = Math.floor(Math.random() * (gMax - gMin + 1)) + gMin;
                let oldG = state.gold;
                addRes("Gold", amt, "Chest: " + type);
                lootLog.push(`Gold x${amt} (${oldG} -> ${state.gold})`);
            }
        }


        // Final Log Construction
        if (source && source !== "Unknown") {
            addLog("CHEST", `${source}: ${type}`, "");
        }
        addLog("CHEST", `${type} Opened`, lootLog.join(', '));
    };

    const checkLevelUp = () => {
        let nxt = inputs.levelData.find(l => l.l === state.level + 1);
        while (nxt && state.xp >= nxt.req) {
            state.level = nxt.l; state.xp -= nxt.req;

            let rewardLog = [];

            // Rewards
            const give = (type, amt) => {
                if (type === "Gold") {
                    addRes("Gold", amt, "Level Reward");
                    rewardLog.push(`+${amt} Gold`);
                }
                else if (type === "Diamonds") {
                    addRes("Diamonds", amt, "Level Reward");
                    rewardLog.push(`+${amt} Diamonds`);
                }
                else if (type.includes("Chest")) {
                    openChest(type, "Level Reward");
                    rewardLog.push(`Opened ${type}`);
                }
                else if (type.includes("Power")) {
                    // Logic to add powerup cards
                    let unlocked = Object.keys(state.powerUps).filter(k => state.powerUps[k].unlocked);
                    if (unlocked.length > 0) {
                        let chosen = unlocked[Math.floor(Math.random() * unlocked.length)];
                        state.powerUps[chosen].amount += amt;
                        rewardLog.push(`PowerUp: ${chosen} x${amt}`);
                    }
                }
            };

            if (nxt.r1t) give(nxt.r1t, nxt.r1a);
            if (nxt.r2t) give(nxt.r2t, nxt.r2a);

            // Unlocks
            if (nxt.ul && nxt.ul.includes("Unlock")) {
                let starMatch = nxt.ul.match(/(\d+)★/);
                if (starMatch) {
                    let star = parseInt(starMatch[1]);
                    let cands = Object.keys(state.powerUps).filter(k => state.powerUps[k].star === star && !state.powerUps[k].unlocked && k !== "Triple Goal");
                    if (cands.length > 0) {
                        let chosen = cands[Math.floor(Math.random() * cands.length)];
                        state.powerUps[chosen].unlocked = true;
                        rewardLog.push(`🔓 Unlocked NEW PowerUp: ${chosen} (${star}★)`);
                    }
                }
            }

            addLog("LEVEL UP", `Reached Level ${state.level}`, rewardLog.join('\n'));
            nxt = inputs.levelData.find(l => l.l === state.level + 1);
        }
    };

    const checkMilestones = () => {
        inputs.cupRoadData.forEach(m => {
            if (state.cups >= m.cup && !m.collected) {
                m.collected = true; // Warning: This modifies dirty data? No, inputs.cupRoadData is REF.
                // WE MUST NOT MODIFY inputs.cupRoadData directly if we want pure runs!
                // FIX: use a local Set for collected milestones
            }
        });
    };
    // Re-writing checkMilestones to be safer
    let collectedMilestones = new Set(); // This needs to be reset per sim run!

    const safeCheckMilestones = () => {
        inputs.cupRoadData.forEach(m => {
            if (state.cups >= m.cup && !collectedMilestones.has(m.cup)) {
                collectedMilestones.add(m.cup);
                let arenaName = getArenaName("Arena 1 Unlock").replace("Unlock", "").trim();
                let rwTxt = (m.cup === 0) ? `${arenaName} and Bucket 1 characters unlocked.` : `${getArenaName(m.r1)} x${m.a1}`;
                addLog("MILESTONE", `${m.cup} Cups`, rwTxt);

                // DATA_FIX: Ensure Cup Road Gold is tracked
                if (m.r1 === "Gold") {
                    let val = (m.a1 === '-' ? 0 : m.a1);
                    addRes("Gold", val, "Cup Road");
                }
                else if (m.r1 === "Diamonds") addRes("Diamonds", m.a1, "Cup Road");
                else if (m.r1 && m.r1.includes("Chest")) openChest(m.r1, "Cup Road");
            }
        });
    };

    const attemptCharUpgrade = () => {
        if (Math.random() * 100 > inputs.charUpgradeChance) return;
        let cands = [];
        for (let n in state.inventory) {
            let ch = state.inventory[n];
            let nxtL = ch.level + 1;
            let cost = getUpgradeCost(n, nxtL);
            let req = getReqForLevel(n, nxtL);
            if (ch.cards >= req && state.gold >= cost) cands.push({ n, cost, req, nxtL });
        }
        if (cands.length > 0) {
            let c = cands[Math.floor(Math.random() * cands.length)];
            let oldGold = state.gold;
            state.inventory[c.n].cards -= c.req;
            state.gold -= c.cost;
            state.inventory[c.n].level = c.nxtL;
            let newGold = state.gold;

            track('goldSinks', 'Char Upgrade', c.cost);
            let xp = getUpgradeXP(c.n, c.nxtL);
            addRes("XP", xp, "Char Upgrade");

            // Detailed Log: Lvl X -> Y | Cost | Gold Rem | XP
            let nxt = c.nxtL;
            let prev = nxt - 1;
            addLog("UPGRADE", `${c.n} Lvl ${prev} -> Lvl ${nxt}`, `Cost: ${c.cost} Gold (Rem: ${newGold}) | +${xp} XP`);
            checkLevelUp();
        }
    };

    const attemptPowerUpUpgrade = () => {
        if (Math.random() * 100 > inputs.pupUpgradeChance) return;
        let cands = [];
        for (let n in state.powerUps) {
            let p = state.powerUps[n];
            if (!p.unlocked || p.level >= 5) continue;
            let meta = inputs.powerUpData.find(x => x.n === n);
            let nxt = p.level + 1;
            let cost = meta['l' + nxt] || 99999;
            let req = 1;
            if (p.amount >= req && state.gold >= cost) cands.push({ n, cost, req, nxt, xp: meta['xp' + nxt] || 0 });
        }
        if (cands.length > 0) {
            let c = cands[Math.floor(Math.random() * cands.length)];
            let oldLevel = state.powerUps[c.n].level;
            state.powerUps[c.n].amount -= c.req;
            state.gold -= c.cost;
            state.powerUps[c.n].level = c.nxt;
            track('goldSinks', 'PowerUp Upgrade', c.cost);
            addRes("XP", c.xp, "PowerUp Upgrade");
            addLog("UPGRADE", `⬆️ PowerUp ${c.n} Lvl ${oldLevel} -> Lvl ${c.nxt}`, `Cost: ${c.cost}`);
            state.totalUpgrades++;
            state.totalPupUpgrades++;
            checkLevelUp();
        }
    };

    // DAY LOOP
    if (state.level === 1) checkLevelUp(); // Initial Check
    safeCheckMilestones(); // Initial Check (Cup 0)

    for (let d = 1; d <= inputs.days; d++) {
        addLog("DAY HEADER", `DAY ${d}`, "");
        let missionsToday = 0;
        let dailyMissionIndices = new Set();
        let adsToday = 0; let freeChestsToday = 0; let cupsToday = 0; let puUsedToday = 0; let wins = 0; let goals = 0;

        // Missions Helper
        const checkMissionsNow = (matchesPlayed = 0) => {
            if (!inputs.doMissions) return;
            let currentBucket = getBucket(state.maxAchievedCups);
            // Safety check for empty mission data
            if (!inputs.missionDataAll) return;

            let missions = inputs.missionDataAll['b' + currentBucket] || inputs.missionDataAll['b1'];
            if (!missions) return;

            missions.forEach((task, idx) => {
                if (dailyMissionIndices.has(idx)) return;
                let completed = false;
                if (task.task.includes("Play") && matchesPlayed >= task.req) completed = true;
                if (task.task.includes("Score") && goals >= task.req) completed = true;
                if (task.task.includes("Cup") && cupsToday >= task.req) completed = true;
                if (task.task.includes("Win") && wins >= task.req) completed = true;
                if (task.task.includes("Open Free Case") && freeChestsToday >= task.req) completed = true;
                if (task.task.includes("Watch Ads") && adsToday >= task.req) completed = true;
                if (task.task.includes("Use Super Powers") && puUsedToday >= task.req) completed = true;

                if (completed) {
                    dailyMissionIndices.add(idx); missionsToday++; state.totalMissions++;
                    let rText = "";
                    if (task.type === "Gold") {
                        let oldG = state.gold;
                        addRes("Gold", task.amt, "Mission");
                        rText = `+${task.amt} Gold (${oldG} -> ${state.gold})`;
                    }
                    else if (task.type === "Diamonds") {
                        let oldD = state.diamonds;
                        addRes("Diamonds", task.amt, "Mission");
                        rText = `+${task.amt} Diamonds (${oldD} -> ${state.diamonds})`;
                    }
                    addRes("XP", task.xp, "Mission"); rText += `, +${task.xp} XP`;
                    let progressStr = `(${task.req}/${task.req})`;
                    addLog("MISSION", `MISSION: ${task.task} ${progressStr}`, rText);
                }
            });
            checkLevelUp();
        };

        // 1. Daily Login - Onboarding (days 1-7) then Fixed Cycle (bucket-locked per 7 days)
        if (inputs.loginConfig) {
            state.loginDay++; // Increment login day
            let rew = null;
            let rewardSource = "";

            if (state.loginDay <= 7) {
                // Onboarding phase (days 1-7)
                if (inputs.loginConfig.onboarding && inputs.loginConfig.onboarding[state.loginDay - 1]) {
                    rew = inputs.loginConfig.onboarding[state.loginDay - 1];
                    rewardSource = `Onboarding Day ${state.loginDay}`;
                }
            } else {
                // Fixed cycle phase (days 8+)
                // Determine which day within the current 7-day cycle (1-7)
                let cycleDay = ((state.loginDay - 8) % 7) + 1;

                // At the start of a new cycle (day 1 of cycle), determine and lock bucket
                if (cycleDay === 1) {
                    state.loginCycleBucket = getBucket(state.maxAchievedCups);
                }

                // Use the locked bucket for this cycle
                if (inputs.loginConfig.fixed && inputs.loginConfig.fixed['b' + state.loginCycleBucket]) {
                    let bucketFixedWeek = inputs.loginConfig.fixed['b' + state.loginCycleBucket];
                    if (bucketFixedWeek[cycleDay - 1]) {
                        rew = bucketFixedWeek[cycleDay - 1];
                        rewardSource = `Fixed Cycle Day ${cycleDay} (Bucket ${state.loginCycleBucket})`;
                    }
                }
            }

            // Process the reward
            if (rew) {
                if (rew.type === "Gold") {
                    let oldG = state.gold;
                    addRes("Gold", rew.amt, "Daily Login");
                    addLog("LOGIN", rewardSource, `+${rew.amt} Gold (${oldG} -> ${state.gold})`);
                }
                else if (rew.type === "Diamonds") {
                    let oldD = state.diamonds;
                    addRes("Diamonds", rew.amt, "Daily Login");
                    addLog("LOGIN", rewardSource, `+${rew.amt} Diamonds`);
                }
                else if (rew.type.includes("Chest")) {
                    openChest(rew.type, "Daily Login");
                    addLog("LOGIN", rewardSource, `Opened ${rew.amt}x ${rew.type}`);
                }
                else if (rew.type.includes("Card")) {
                    // Handle "Card Taiga" or "Random Power Card"
                    if (rew.type.includes("Random Power Card")) {
                        // Give random powerup cards
                        let unlocked = Object.keys(state.powerUps).filter(k => state.powerUps[k].unlocked);
                        if (unlocked.length > 0) {
                            let chosen = unlocked[Math.floor(Math.random() * unlocked.length)];
                            state.powerUps[chosen].amount += rew.amt;
                            addLog("LOGIN", rewardSource, `PowerUp: ${chosen} x${rew.amt}`);
                        }
                    } else {
                        // "Card Taiga" -> Extract Name
                        let charName = rew.type.replace("Card ", "").trim();
                        if (state.inventory[charName]) {
                            state.inventory[charName].cards += rew.amt;
                            addLog("LOGIN", rewardSource, `${charName} x${rew.amt}`);
                        } else {
                            // If unlocked or allowing unlock (Check pool)
                            let inPool = inputs.charPool.find(c => c.n === charName);
                            if (inPool) {
                                state.inventory[charName] = { rarity: inPool.r, level: 0, cards: rew.amt, bucket: inPool.b || 1 };
                                addLog("LOGIN", rewardSource, `${charName} (New!) x${rew.amt}`);
                            }
                        }
                    }
                }
            }
        }

        // 2. Matches (Moved up as requested)
        for (let m = 1; m <= inputs.dailyMatches; m++) {
            let myG = Math.floor(Math.random() * (inputs.maxGoals - inputs.minGoals + 1)) + inputs.minGoals;
            let oppG = Math.floor(Math.random() * (inputs.maxGoals - inputs.minGoals + 1)) + inputs.minGoals;

            let puInfo = "";
            // Power Up Usage (Simulated) - Use up to unlockedSlots (max 2 for start)
            if (puUsedToday < 5) { // Daily limit
                let availablePups = Object.keys(state.powerUps).filter(k => state.powerUps[k].unlocked && state.powerUps[k].amount > 0);
                let slots = 2; // Default
                if (inputs.slotUnlockData && Array.isArray(inputs.slotUnlockData)) {
                    inputs.slotUnlockData.forEach(s => {
                        if (state.totalPupUpgrades >= s.req) slots = Math.max(slots, s.slot);
                    });
                }
                let useCount = Math.min(slots, availablePups.length, 5 - puUsedToday);
                useCount = Math.min(useCount, 2);

                if (useCount > 0) {
                    // Primitive shuffle
                    availablePups.sort(() => Math.random() - 0.5);

                    let usedList = [];
                    for (let i = 0; i < useCount; i++) {
                        let pName = availablePups[i];
                        state.powerUps[pName].amount--;
                        state.totalPowerUpsUsed++; puUsedToday++;
                        usedList.push(pName);
                    }
                    if (usedList.length > 0) {
                        puInfo = ` | Used: ${usedList.join(' & ')}`;
                        // Removed standalone log
                    }
                }
            }

            let win = Math.random() * 100 < inputs.winRate;
            let matchLog = `Score: ${myG}-${oppG}${puInfo}`;
            if (win) {
                myG = Math.max(myG, oppG + 1);
                matchLog = `Win (${myG}-${oppG})${puInfo}`;
                wins++; state.cups += 30; cupsToday += 30; state.maxAchievedCups = Math.max(state.maxAchievedCups, state.cups);

                // LOG MATCH RESULT FIRST
                addLog("WIN", `Match ${m} Won`, matchLog);

                // CHECK MILESTONES
                safeCheckMilestones();

                // Win Reward - Bucket-based
                let currentBucket = getBucket(state.maxAchievedCups);
                let bucketWinRewards = inputs.winRewardsAll['b' + currentBucket] || inputs.winRewardsAll['b1'] || [];
                let wr = bucketWinRewards.find(w => w.winCount === wins);
                if (wr) {
                    if (wr.type === "Gold") {
                        let oldG = state.gold;
                        addRes("Gold", wr.amt, "Win Reward");
                        addLog("WIN REWARD", `Win Reward (${wins}. Win)`, `+${wr.amt} Gold (${oldG} -> ${state.gold})`);
                    }
                    else if (wr.type.includes("Chest")) openChest(wr.type, "Win Reward");

                    if (wr.type2 === "Gold") {
                        let oldG = state.gold;
                        addRes("Gold", wr.amt2, "Win Reward");
                        addLog("WIN REWARD", `Win Reward (${wins}. Win)`, `+${wr.amt2} Gold (${oldG} -> ${state.gold})`);
                    }
                }
            } else {
                state.cups = Math.max(0, state.cups - inputs.simConfig.lossPenalty);
                matchLog = `Loss (${myG}-${oppG})${puInfo}`;
                addLog("LOSS", `Match ${m} Lost`, matchLog);
            }
            goals += myG;
            checkMissionsNow(m); // Check missions after each match
            attemptCharUpgrade(); // Attempt upgrades after match
            attemptPowerUpUpgrade();
        }

        // 3. Watch & Earn - Bucket-based (determined at start of day)
        let currentDayBucket = getBucket(state.maxAchievedCups);
        let adsCount = Math.floor(Math.random() * (inputs.maxAds - inputs.minAds + 1)) + inputs.minAds;
        if (inputs.weConfig && inputs.weConfig['b' + currentDayBucket] && inputs.doWE) {
            let bucketWERewards = inputs.weConfig['b' + currentDayBucket];
            for (let a = 1; a <= adsCount; a++) {
                let stepReward = bucketWERewards[(a - 1) % bucketWERewards.length];
                let headerStr = `W&E Step ${a}`;

                if (stepReward.type === "Gold") {
                    addRes("Gold", stepReward.amt, "Watch & Earn");
                    addLog("AD", headerStr, `+${stepReward.amt} Gold`);
                } else if (stepReward.type === "Diamonds") {
                    addRes("Diamonds", stepReward.amt, "Watch & Earn");
                    addLog("AD", headerStr, `+${stepReward.amt} Diamonds`);
                } else if (stepReward.type === "Random Power Card") {
                    // Handle Random Power Card (1★ PowerUp)
                    addRes("Random Power Card", stepReward.amt, "Watch & Earn");
                    addLog("AD", headerStr, `+${stepReward.amt} Random Power Card`);
                } else {
                    openChest(stepReward.type, "Watch & Earn");
                }
                state.totalAds++; adsToday++;
            }
            checkMissionsNow(); // Check for "Watch Ads" missions immediately
        }

        // 4. Free Chests
        if (inputs.dailyFreeChests > 0) {
            for (let i = 0; i < Math.min(inputs.dailyFreeChests, 2); i++) {
                openChest("Free Chest", "Daily Free");
                state.totalAds++; adsToday++; freeChestsToday++;
            }
            checkMissionsNow(); // Check for Free Chest missions
        }

        // 5. PU Chests
        for (let i = 0; i < inputs.dailyPUChests; i++) {
            openChest("PowerUp Chest", "Daily PU");
            state.totalAds++; adsToday++;
        }
        checkMissionsNow();

        // 6. Reward Chests (Gold & Diamond) - Bucket-based
        if (inputs.rewardChestConfig) {
            // Gold Chest
            if (inputs.dailyGoldChests > 0 && inputs.rewardChestConfig.goldChest) {
                let goldChestReward = inputs.rewardChestConfig.goldChest['b' + currentDayBucket] || 0;
                for (let i = 0; i < Math.min(inputs.dailyGoldChests, 2); i++) {
                    if (goldChestReward > 0) {
                        let oldG = state.gold;
                        addRes("Gold", goldChestReward, "Gold Chest");
                        addLog("CHEST", `Gold Chest Claimed (${i + 1}/${inputs.dailyGoldChests})`, `+${goldChestReward} Gold (${oldG} → ${state.gold}) [Bucket ${currentDayBucket}]`, "Gold Chest");
                        state.totalAds++; adsToday++;
                    }
                }
            }

            // Diamond Chest
            if (inputs.dailyDiamondChests > 0 && inputs.rewardChestConfig.diamondChest) {
                let diamondChestReward = inputs.rewardChestConfig.diamondChest['b' + currentDayBucket] || 0;
                for (let i = 0; i < Math.min(inputs.dailyDiamondChests, 2); i++) {
                    if (diamondChestReward > 0) {
                        let oldD = state.diamonds;
                        addRes("Diamonds", diamondChestReward, "Diamond Chest");
                        addLog("CHEST", `Diamond Chest Claimed (${i + 1}/${inputs.dailyDiamondChests})`, `+${diamondChestReward} Diamonds (${oldD} → ${state.diamonds}) [Bucket ${currentDayBucket}]`, "Diamond Chest");
                        state.totalAds++; adsToday++;
                    }
                }
            }
        }



        // 6. Grand Prize (Mission Completion)
        if (inputs.missionCompAll && missionsToday >= inputs.missionCompAll.req) {
            let cb = getBucket(state.maxAchievedCups);
            let mc = inputs.missionCompAll['b' + cb] || inputs.missionCompAll['b1'];
            if (mc) {
                addLog("GRAND PRIZE", "All Missions Done!", "Claiming Big Reward");
                if (mc.r1t && mc.r1t.includes("Chest")) openChest(mc.r1t, "Grand Prize");
                if (mc.r2t === "Gold") { addRes("Gold", mc.r2a, "Grand Prize"); }
                if (mc.r2t === "Diamonds") { addRes("Diamonds", mc.r2a, "Grand Prize"); }
            }
        }

        // End of Day Upgrades (Last ditch effort)
        attemptCharUpgrade();
        attemptPowerUpUpgrade();
    } // END DAY LOOP

    // ----------------------------------------------------
    // POST-SIMULATION ANALYSIS (Inside function now)
    // ----------------------------------------------------

    // Calculate Best Char (Highest Total Power)
    let best = { n: "-", p: 0, lvl: 0 };
    Object.keys(state.inventory).forEach(n => {
        let c = state.inventory[n];
        let totalPower = 0;

        // Calculate Total Power from stats if level > 0
        if (c.level > 0 && inputs.charStatsData && inputs.charStatsData[n]) {
            let statsForLevel = inputs.charStatsData[n][c.level - 1]; // Level 1 = index 0
            if (statsForLevel && Array.isArray(statsForLevel)) {
                // statsForLevel = [Size, Speed, Jump, Shoot]
                let sum = statsForLevel.reduce((s, val) => s + val, 0);
                totalPower = Math.round(sum / 4);
            }
        }
        // Fallback for Locked Chars or missing data => 0
        if (totalPower > best.p) best = { n: n, p: totalPower, lvl: c.level };
    });

    // Store best char details for rendering
    state.bestCharName = best.n;
    state.bestCharLevel = best.lvl;
    state.bestCharPower = best.p;
    state.bestChar = best.n !== "-" ? `${best.n} (Lvl ${best.lvl}, Power ${best.p})` : "-";

    // Calculate XP Next
    let nextLvl = inputs.levelData.find(l => l.l === state.level + 1);
    state.xpNext = nextLvl ? (nextLvl.req - state.xp) : "MAX";
    if (typeof state.xpNext === 'number' && state.xpNext < 0) state.xpNext = 0;

    // Calculate Avg Missions
    state.avgMissions = (inputs.days > 0) ? (state.totalMissions / inputs.days).toFixed(1) : "0.0";

    // Calculate Unlocked Slots (Deck Capacity)
    let slots = 2; // Base
    if (inputs.slotUnlockData && Array.isArray(inputs.slotUnlockData)) {
        inputs.slotUnlockData.forEach(s => {
            if (state.totalPupUpgrades >= s.req) slots = Math.max(slots, s.slot);
        });
    }
    state.unlockedSlots = slots;

    // DEBUG: Commented out to fix SyntaxError. 
    // If 'Illegal return' happens, it means we are global.
    // return state; 
    // console.log("Sim Finished State:", state);
    // Setting global for debug if needed
    window.lastSimState = state;
    return state;
}

// ==========================================
// MAIN SIMULATION CONTROLLER (RESTORED)
// ==========================================
window.runSimulation = function () {

    // 1. Gather Inputs
    let inputs = getSimulationInputs();

    // 2. Run Core Simulation
    let finalState = simulateGame(inputs);

    // 3. PERSIST STATE (User Request: "Garip bir durum oluyor" fix)
    // Update global state so navigation doesn't reset Top Bar
    if (!window.playerResources) window.playerResources = {};
    window.playerResources.gold = finalState.gold;
    window.playerResources.diamonds = finalState.diamonds;
    window.playerResources.xp = finalState.xp || 0;

    // Also sync inventory for consistency if manual tools are used
    window.playerInventory = finalState.inventory;
    window.playerPowerUps = finalState.powerUps;

    // 4. Render Results
    renderSimulationResults(finalState, inputs);
};

function renderSimulationResults(state, inputs) {
    // Update Dashboard Stats (removed guard that was blocking updates)

    // Update Dashboard Stats
    if (document.getElementById('resCups')) document.getElementById('resCups').innerText = state.maxAchievedCups || state.cups || 0;
    if (document.getElementById('resGold')) document.getElementById('resGold').innerText = state.gold || 0;
    if (document.getElementById('resGems')) document.getElementById('resGems').innerText = state.diamonds || 0;
    if (document.getElementById('resXP')) document.getElementById('resXP').innerText = state.xp || 0;
    if (document.getElementById('resLevel')) document.getElementById('resLevel').innerText = state.level || 1;
    if (document.getElementById('resChests')) document.getElementById('resChests').innerText = state.totalChestsOpened || 0;
    if (document.getElementById('resCards')) document.getElementById('resCards').innerText = state.totalCardsEarned || 0;
    if (document.getElementById('resWins')) document.getElementById('resWins').innerText = state.totalWins || 0;
    if (document.getElementById('resLosses')) document.getElementById('resLosses').innerText = state.totalLosses || 0;
    if (document.getElementById('resMissions')) document.getElementById('resMissions').innerText = state.totalMissions || 0;
    if (document.getElementById('resSlots')) document.getElementById('resSlots').innerText = state.unlockedSlots || 2;

    // Extended Stats
    if (document.getElementById('resNextXp')) document.getElementById('resNextXp').innerText = state.xpNext !== undefined ? state.xpNext : "-";

    // Best Char - Enhanced Display with Image
    let bestCharEl = document.getElementById('resBestChar');
    if (bestCharEl) {
        if (state.bestCharName && state.bestCharName !== "-") {
            let charImg = (typeof getAnyImgTag === 'function') ? getAnyImgTag(state.bestCharName, 80) : '';
            bestCharEl.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="transform:scale(1.0);">${charImg}</div>
                    <div style="flex:1;">
                        <div style="font-size:1.1rem; font-weight:bold; color:#ffd700;">${state.bestCharName}</div>
                        <div style="margin-top:4px; font-size:0.85rem;">
                            <div style="color:#4ade80;">Level ${state.bestCharLevel}</div>
                            <div style="color:#60a5fa;">Power ${state.bestCharPower}</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            bestCharEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">-</div>';
        }
    }
    if (document.getElementById('resAds')) document.getElementById('resAds').innerText = state.totalAds || 0;
    if (document.getElementById('resPupUpgrades')) document.getElementById('resPupUpgrades').innerText = state.totalPupUpgrades || 0;
    if (document.getElementById('resUnlockedSlots')) document.getElementById('resUnlockedSlots').innerText = state.unlockedSlots || 2;
    if (document.getElementById('resAvgMissions')) document.getElementById('resAvgMissions').innerText = state.avgMissions || "0.0";

    // Update Log View
    let logEl = document.getElementById('simLogs');
    if (logEl) logEl.innerHTML = state.logs;

    // Update Charts Area visibility
    let chartArea = document.getElementById('charts-area');
    if (chartArea) chartArea.style.display = 'flex';

    // Update Legacy Charts if function exists
    if (typeof renderCharts === 'function') renderCharts(state.stats);

    // Update Inventory UIs
    if (typeof renderSimInventory === 'function') renderSimInventory(state.inventory);
    if (typeof renderSimPowerUps === 'function') renderSimPowerUps(state.powerUps);
}

// WRAPPER: Single Run
// (Already defined above as window.runSimulation, removing duplicates if any)

// HELPERS: Render Sim Results to Real UI
function renderSimInventory(inv) {
    const el = document.getElementById('inventoryBody');
    let progData = getSafe('charProgressionData');
    if (!el) return;

    // Convert to array and sort
    let chars = Object.keys(inv).map(n => ({ ...inv[n], n: n }));

    // Sort: Upgradable First, then Rarity, then Name
    // To do Upgradable sort, we need reqs.
    chars.forEach(c => {
        c.req = 9999;
        if (progData && progData[c.n] && progData[c.n].c) {
            // If Level 0 (Locked), target is Level 1 (idx 0).
            // If Level 1, target is Level 2 (idx 1).
            let targetLvl = c.level === 0 ? 1 : c.level + 1;
            let idx = targetLvl - 1;
            if (idx >= 0 && idx < progData[c.n].c.length) c.req = progData[c.n].c[idx];
        }
        c.canUpgrade = c.cards >= c.req;
    });

    chars.sort((a, b) => {
        if (a.canUpgrade !== b.canUpgrade) return b.canUpgrade ? 1 : -1; // Upgradable first
        const rOrder = { "Rookie": 1, "Pro": 2, "Champion": 3, "Legendary": 4 };
        if (a.rarity !== b.rarity) return rOrder[a.rarity] - rOrder[b.rarity];
        return a.n.localeCompare(b.n);
    });

    let html = "";
    chars.forEach(c => {
        let img = (typeof getCharImgHTML === 'function') ? getCharImgHTML(c.n) : '';
        if (!img && typeof getAnyImgTag === 'function') img = getAnyImgTag(c.n, 65);

        let progressHtml = "";
        let rowClass = "";

        // Calculate Total Power from stats
        // Calculate Total Power from stats
        let totalPower = 0;
        // Fix: Use window.charStatsData directly if available, else inputs.charStatsData (if passed)
        // Since we are in renderSimInventory, we might not have 'inputs' in scope if called from outside?
        // Actually, renderSimInventory is a helper, but logic_sim has access to window.
        let statsData = window.charStatsData || (typeof getSafe === 'function' ? getSafe('charStatsData') : null);

        if (c.level > 0 && statsData && statsData[c.n]) {
            let statsForLevel = statsData[c.n][c.level - 1];
            if (statsForLevel && Array.isArray(statsForLevel)) {
                let sum = statsForLevel.reduce((s, val) => s + val, 0);
                totalPower = Math.round(sum / 4);
            }
        }

        if (c.req !== 9999) {
            let pct = Math.min(100, Math.floor((c.cards / c.req) * 100));
            let infoText = `${c.cards} / ${c.req}`;
            let btnHtml = "";

            // CUMULATIVE DISPLAY LOGIC (User Request)
            if (progData && progData[c.n] && progData[c.n].c) {
                let costList = progData[c.n].c;
                let prevCost = 0;
                let limit = c.level - 1;
                for (let i = 0; i < limit; i++) {
                    if (costList[i]) prevCost += costList[i];
                }

                let totalCollected = prevCost + c.cards;
                let totalReq = prevCost + c.req;

                infoText = `${totalCollected} / ${totalReq}`;
                pct = Math.min(100, Math.floor((totalCollected / totalReq) * 100));
            }

            let barColor = "#3b82f6";
            if (c.canUpgrade) {
                barColor = "#22c55e";
                btnHtml = `<button class="btn btn-green" style="padding:4px 12px; margin-top:5px; width:100%; font-size:0.85rem;" onclick="upgradeCharacter('${c.n}')">⬆ Upgrade</button>`;
            } else {
                // infoText already set
            }

            progressHtml = `
            <div style="display:flex; flex-direction:column; gap:4px;">
                <div style="width:100%; height:18px; background:#1e293b; border:1px solid #444; border-radius:4px; position:relative; overflow:hidden;">
                    <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, ${barColor}, ${barColor}dd); box-shadow:0 0 10px ${barColor}66;"></div>
                    <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:bold; color:#fff; text-shadow:0 1px 2px #000; letter-spacing:0.5px;">${infoText}</div>
                </div>
                ${btnHtml}
            </div>`;
        } else {
            progressHtml = `<div style="width:100%; padding:4px; text-align:center; background:rgba(255,255,255,0.05); border-radius:4px; font-weight:bold; color:#fbbf24; font-size:0.8rem; border:1px solid #eba417;">MAX LEVEL</div>`;
        }

        html += `<tr class="${rowClass}">
            <td style="display:flex; align-items:center; gap:15px; padding:12px;">
                <div style="transform:scale(1.2); filter:drop-shadow(0 4px 6px rgba(0,0,0,0.5));">${img}</div>
                <div style="display:flex; flex-direction:column;">
                    <span style="font-weight:bold; font-size:1.1rem; color:#fff;">${c.n}</span>
                    <span style="font-size:0.85rem; opacity:0.7;">Lvl ${c.level}</span>
                </div>
            </td>
            <td style="padding:8px; text-align:center;"><span class="rar-${c.rarity}" style="padding:2px 8px; border-radius:4px; font-size:0.85rem;">${c.rarity}</span></td>
            <td style="text-align:center; padding:8px; font-size:1.1rem; font-weight:bold;">${c.level === 0 ? 'Locked' : c.level}</td>
            <td style="text-align:center; padding:8px; font-size:1.1rem; font-weight:bold;">B${c.bucket || 1}</td>
            <td style="text-align:center; padding:8px; font-size:1.1rem; font-weight:bold; color:var(--accent);">${totalPower}</td>
            <td style="padding:8px; min-width:180px;">${progressHtml}</td>
        </tr>`;
    });
    el.innerHTML = html;
}

// ACTION: Upgrade Character
// ACTION: Upgrade Character
window.upgradeCharacter = function (charName) {
    console.log(`⬆ Attempting to upgrade: ${charName}`);
    let state = window.lastSimState;
    if (!state || !state.inventory[charName]) {
        console.error("❌ State or Character not found in inventory");
        return;
    }

    let char = state.inventory[charName];
    let progData = getSafe('charProgressionData');

    if (!progData) {
        console.error("❌ charProgressionData not loaded or found.");
        return;
    }

    if (!progData[charName]) {
        console.error(`❌ Progression data missing for character: '${charName}'. Keys available:`, Object.keys(progData).slice(0, 5));
        return;
    }

    // Get Req
    let idx = char.level - 1;
    let req = 9999;
    let goldReq = 0;

    let costData = getSafe('upgradeCostData');
    if (costData && idx < costData.length) goldReq = costData[idx];

    if (progData[charName].c && idx < progData[charName].c.length) {
        req = progData[charName].c[idx];
    }

    console.log(`   Level: ${char.level}, Cards: ${char.cards}/${req}, Gold: ${state.gold}/${goldReq}`);

    if (char.cards >= req && state.gold >= goldReq) {
        // PERFOM UPGRADE
        char.cards -= req;
        state.gold -= goldReq;
        char.level++;
        console.log("   ✅ Upgrade SUCCESS!");

        // Update UI
        renderSimInventory(state.inventory);
        if (document.getElementById('resGold')) document.getElementById('resGold').innerText = state.gold;
        if (document.getElementById('resLevel')) document.getElementById('resLevel').innerText = state.level;
    } else {
        console.warn("   ❌ Not enough resources");
        alert(`Not enough cards or gold!\nCards: ${char.cards}/${req}\nGold: ${state.gold}/${goldReq}`);
    }
};
// Duplicate removed

function renderSimPowerUps(pups) {
    const el = document.getElementById('pupInventoryBody');
    if (!el) return;

    let unlocked = [];
    let locked = [];

    // Need Progression Data for PowerUps (Cards to Upgrade)
    // Assuming standard 2, 4, 10, 20... or similar?
    // Let's assume 'powerUpProgression' exists or use generic 
    // generic: L1->L2: 2 cards, L2->L3: 4 cards, etc.
    // If not found, use placeholder.
    let pupProg = getSafe('powerUpProgression') || [0, 2, 4, 10, 20, 50, 100, 200, 400, 800, 1000, 2000];

    Object.keys(pups).forEach(n => {
        let p = pups[n];
        let idx = p.level; // Levels usually 0-indexed or 1-based? Pups text says "Lvl 1".
        // If Lvl 1, index 1? Let's assume Index = Level.
        // If unclocked (Lvl 1), next is Lvl 2. Req is at index 1?
        let req = (idx < pupProg.length) ? pupProg[idx] : 9999;

        // Check standard gold cost for powerups if exists
        let goldReq = 0; // Simplify for now

        let canUpgrade = (p.amount >= req);

        if (p.unlocked) unlocked.push({ ...p, n: n, req: req, canUpgrade: canUpgrade });
        else locked.push({ ...p, n: n });
    });

    // Sorts
    unlocked.sort((a, b) => {
        if (a.canUpgrade !== b.canUpgrade) return b.canUpgrade ? 1 : -1;
        return a.star - b.star;
    });
    locked.sort((a, b) => a.star - b.star);

    let html = "";

    // Unlocked Section
    if (unlocked.length > 0) {
        html += `<tr><td colspan="4" style="background:rgba(34, 197, 94, 0.2); font-weight:bold; text-align:center; padding:5px;">✅ Unlocked</td></tr>`;
        unlocked.forEach(p => {
            let img = (typeof getPngTag === 'function') ? getPngTag(p.n, 35) : '';

            html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                <td style="display:flex; align-items:center; gap:10px; padding:5px;">${img} <span style="font-weight:bold;">${p.n}</span></td>
                <td style="text-align:center; padding:5px;">${p.star}★</td>
                <td style="text-align:center; padding:5px;">Lvl ${p.level}</td>
                <td style="text-align:center; padding:5px;">${p.amount}</td>
            </tr>`;
        });
    }

    // Locked Section
    if (locked.length > 0) {
        html += `<tr><td colspan="4" style="background:rgba(239, 68, 68, 0.2); font-weight:bold; text-align:center; padding:5px; margin-top:10px;">🔒 Locked</td></tr>`;
        locked.forEach(p => {
            let img = (typeof getPngTag === 'function') ? getPngTag(p.n, 35) : '';

            html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.1); opacity:0.5;">
                <td style="display:flex; align-items:center; gap:10px; padding:5px;">${img} <span>${p.n}</span></td>
                <td style="text-align:center; padding:5px;">${p.star}★</td>
                <td style="text-align:center; padding:5px;">-</td>
                <td style="text-align:center; padding:5px;">${p.amount}</td>
            </tr>`;
        });
    }

    el.innerHTML = html;
}

window.upgradePowerUp = function (name) {
    let state = window.lastSimState;
    if (!state || !state.powerUps[name]) return;
    let p = state.powerUps[name];

    // Simple Progression for now:
    let pupProg = getSafe('powerUpProgression') || [0, 2, 4, 10, 20, 50, 100, 200, 400, 800, 1000, 2000];
    let req = (p.level < pupProg.length) ? pupProg[p.level] : 9999;

    if (p.amount >= req) {
        p.amount -= req;
        p.level++;
        renderSimPowerUps(state.powerUps);
    }
};

window.unlockPowerUp = function (name) {
    let state = window.lastSimState;
    if (!state || !state.powerUps[name]) return;
    let p = state.powerUps[name];

    if (p.amount >= 1) {
        // Unlock consumes 0 or 1? Often unlocking is free if you have the card, just converts state.
        // Let's assume it consumes nothing but sets unlocked=true and level=1.
        p.unlocked = true;
        p.level = 1;
        // p.amount -= 1; // Uncomment if unlock consumes a card
        renderSimPowerUps(state.powerUps);
    }
};
// WRAPPER: Monte Carlo

