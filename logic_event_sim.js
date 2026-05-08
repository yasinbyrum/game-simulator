// ==========================================
// WORLD CUP EVENT SIMULATION ENGINE
// ==========================================

window.runWCSimulation = function() {
    let d = getSafe('wcEventData');
    if (!d) {
        alert("World Cup Event Data not found!");
        return;
    }

    let daysToSim = parseInt(document.getElementById('wcSimDays').value) || 7;
    let selectedChar = window.selectedWCChar || "None";
    let selectedCountry = window.selectedWCCountry || "None";
    let winRate = (parseFloat(document.getElementById('wcWinRate').value) || 50) / 100;
    let matchesPerDay = parseInt(document.getElementById('wcMatchesPlayed').value) || 5;
    let bpBundle = document.getElementById('wcSimBPBundle')?.checked || false;
    let bpPremium = bpBundle;
    let dailyPremium = bpBundle;
    let adsWatched = parseInt(document.getElementById('wcAdTickets')?.value || "2");
    let goalMin = parseInt(document.getElementById('wcGoalMin')?.value) || 1;
    let goalMax = parseInt(document.getElementById('wcGoalMax')?.value) || 5;
    let spMin = parseInt(document.getElementById('wcSPMin')?.value) || 0;
    let spMax = parseInt(document.getElementById('wcSPMax')?.value) || 3;

    let winEP = parseInt(document.getElementById('wcWinXP')?.value) || 30;
    let lossEP = parseInt(document.getElementById('wcLossXP')?.value) || 10;
    let winCurrency = parseInt(document.getElementById('wcWinCurrency')?.value) || 50;
    let lossCurrency = parseInt(document.getElementById('wcLossCurrency')?.value) || 10;
    
    let winCup = parseInt(document.getElementById('wcWinCup')?.value) || 30;
    let lossCup = parseInt(document.getElementById('wcLossCup')?.value) || -10;

    // State
    let tickets = 0;
    let xp = 0;
    let cups = 0;
    let bpLevel = 1;
    let rewards = {};
    let log = [];

    function addReward(type, amt) {
        if (!type || amt <= 0) return;
        if (!rewards[type]) rewards[type] = 0;
        rewards[type] += amt;
    }

    function addLog(msg) {
        log.push(msg);
    }

    addLog(`🌍 Starting World Cup Event Simulation for ${daysToSim} days`);
    addLog(`Character: ${selectedChar} | Country: ${selectedCountry}`);
    addLog(`BP Premium: ${bpPremium ? 'YES' : 'NO'} | Daily Premium: ${dailyPremium ? 'YES' : 'NO'} | BP Bundle: ${bpBundle ? 'YES' : 'NO'}`);
    addLog(`Win Rate: ${Math.round(winRate*100)}% | Matches/Day: ${matchesPerDay} | Ads Watched/Day: ${adsWatched} | Missions: ${missionBehavior*100}%`);
    addLog(`-----------------------------------------------------`);

    let totalTicketsSpent = 0;

    for (let day = 1; day <= daysToSim; day++) {
        addLog(`\n[DAY ${day}]`);
        
        // 0. Onboarding & Bundle
        if (day <= 2) {
            tickets += 2;
            addLog(`✨ Onboarding Bonus: +2 Tickets`);
        }
        if (bpBundle) {
            tickets += 2;
            addLog(`🎟️ BP Bundle: +2 Tickets`);
        }
        
        // 1. Daily Pass
        let dPass = d.dailyPass.find(p => p.day === day);
        if (dPass) {
            if (dPass.freeType === 'Ticket') tickets += dPass.freeAmt;
            else addReward(dPass.freeType, dPass.freeAmt);
            addLog(`🎁 Claimed Daily Free: ${dPass.freeAmt} ${dPass.freeType}`);

            if (dailyPremium) {
                if (dPass.premType === 'Ticket') tickets += dPass.premAmt;
                else addReward(dPass.premType, dPass.premAmt);
                addLog(`💎 Claimed Daily Premium: ${dPass.premAmt} ${dPass.premType}`);
            }
        }

        // 2. Ads
        if (adsWatched > 0) {
            tickets += adsWatched;
            addLog(`📺 Watched Ads: +${adsWatched} Tickets`);
        }

        // 3. Play Matches & Dynamic Missions
        let matchesPlayedToday = 0;
        let dailyGoalsScored = 0;
        let dailyMatchesWon = 0;
        let dailySuperPowers = 0;
        let claimedMissions = new Set();
        
        let initialTickets = tickets;
        
        while (tickets > 0 && matchesPlayedToday < matchesPerDay) {
            tickets--;
            totalTicketsSpent++;
            matchesPlayedToday++;
            
            // Simulate 1 Match
            let isWin = Math.random() < winRate;
            let goals = Math.floor(Math.random() * (goalMax - goalMin + 1)) + goalMin;
            let spUsed = Math.floor(Math.random() * (spMax - spMin + 1)) + spMin;
            
            dailyGoalsScored += goals;
            dailySuperPowers += spUsed;
            if (isWin) dailyMatchesWon++;
            
            // Match Rewards
            xp += isWin ? winEP : lossEP;
            cups += isWin ? winCup : lossCup;
            let curGained = isWin ? winCurrency : lossCurrency;
            if (curGained > 0) addReward("Event Currency", curGained);
            
            // Evaluate Missions
            d.missions.forEach((m, idx) => {
                if (claimedMissions.has(idx)) return; // Already claimed today
                
                let isCompleted = false;
                if (m.task.includes("Play") && matchesPlayedToday >= m.req) isCompleted = true;
                else if (m.task.includes("Win") && dailyMatchesWon >= m.req) isCompleted = true;
                else if (m.task.includes("Score") && dailyGoalsScored >= m.req) isCompleted = true;
                else if (m.task.includes("Power") && dailySuperPowers >= m.req) isCompleted = true;
                
                if (isCompleted) {
                    claimedMissions.add(idx);
                    if (m.type === 'Ticket') {
                        tickets += m.amt;
                        addLog(`  🎯 Mission '${m.task}' Complete! +${m.amt} Ticket(s) (Remaining: ${tickets})`);
                    } else {
                        addReward(m.type, m.amt);
                        addLog(`  🎯 Mission '${m.task}' Complete! +${m.amt} ${m.type}`);
                    }
                    if (m.xp) xp += m.xp;
                }
            });
        }
        
        if (matchesPlayedToday > 0) {
            let limitReason = (tickets === 0) ? "(Ran out of tickets)" : `(Reached daily limit of ${matchesPerDay})`;
            addLog(`⚔️ Played ${matchesPlayedToday} matches ${limitReason}. Wins: ${dailyMatchesWon}, Goals: ${dailyGoalsScored}, SP: ${dailySuperPowers}. Tickets left: ${tickets}`);
        } else if (tickets === 0 && initialTickets === 0) {
            addLog(`⚔️ No matches played today (0 Tickets available).`);
        } else if (matchesPlayedToday === 0 && tickets > 0) {
            addLog(`⚔️ No matches played today (Reached max matches/day cap of ${matchesPerDay}).`);
        }

        // 5. Check BP Level Up
        let maxLevel = d.battlePass.length;
        let leveledUp = false;
        while (bpLevel < maxLevel) {
            let nextLevelData = d.battlePass.find(b => b.level === bpLevel);
            if (!nextLevelData) break;
            if (xp >= nextLevelData.xpReq) {
                // Level Up!
                bpLevel++;
                leveledUp = true;
                // Claim rewards for the new level
                let newLevelData = d.battlePass.find(b => b.level === bpLevel);
                if (newLevelData) {
                    if (newLevelData.freeType === 'Ticket') tickets += newLevelData.freeAmt;
                    else addReward(newLevelData.freeType, newLevelData.freeAmt);
                    
                    if (bpPremium) {
                        if (newLevelData.premType === 'Ticket') tickets += newLevelData.premAmt;
                        else addReward(newLevelData.premType, newLevelData.premAmt);
                    }
                }
            } else {
                break;
            }
        }
        if (leveledUp) {
            addLog(`⭐ Reached BP Step ${bpLevel}!`);
        }
    }

    addLog(`\n🏁 SIMULATION COMPLETE`);

    // Render Results
    document.getElementById('wcSimResults').style.display = 'block';
    document.getElementById('wcResTickets').innerText = totalTicketsSpent;
    if (document.getElementById('wcResTicketsLeft')) document.getElementById('wcResTicketsLeft').innerText = tickets;
    document.getElementById('wcResBP').innerText = bpLevel;
    document.getElementById('wcResXP').innerText = xp;
    if (document.getElementById('wcResCups')) document.getElementById('wcResCups').innerText = cups;

    let rewardHtml = '';
    for (const [k, v] of Object.entries(rewards)) {
        rewardHtml += `<div style="display:inline-block; background:#333; padding:5px 10px; border-radius:5px; margin-right:10px; margin-bottom:5px;">
            <b>${k}:</b> ${v}
        </div>`;
    }
    if (rewardHtml === '') rewardHtml = '<i>No external rewards.</i>';
    document.getElementById('wcResRewards').innerHTML = rewardHtml;

    document.getElementById('wcResLog').innerText = log.join('\n');
};
