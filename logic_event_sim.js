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
    let bpPremium = document.getElementById('wcSimBPPremium').checked;
    let dailyPremium = document.getElementById('wcSimDailyPremium').checked;

    // State
    let tickets = 0;
    let xp = 0;
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
    addLog(`BP Premium: ${bpPremium ? 'YES' : 'NO'} | Daily Premium: ${dailyPremium ? 'YES' : 'NO'}`);
    addLog(`-----------------------------------------------------`);

    let totalTicketsSpent = 0;

    for (let day = 1; day <= daysToSim; day++) {
        addLog(`\n[DAY ${day}]`);
        
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
        tickets += d.settings.adsTickets;
        addLog(`📺 Watched Ads: +${d.settings.adsTickets} Tickets`);

        // 3. Missions (assuming all completed daily)
        d.missions.forEach(m => {
            if (m.type === 'Ticket') tickets += m.amt;
            else addReward(m.type, m.amt);
            xp += m.xp;
            addLog(`🎯 Mission Completed: ${m.task} -> +${m.amt} ${m.type}, +${m.xp} XP`);
        });

        // 4. Play Matches
        if (tickets > 0) {
            addLog(`⚔️ Playing ${tickets} matches...`);
            let matchXpPerTicket = 20; // Assume 20 XP per match played
            let xpGained = tickets * matchXpPerTicket;
            xp += xpGained;
            totalTicketsSpent += tickets;
            addLog(`⚔️ Earned ${xpGained} XP from matches.`);
            tickets = 0; // Spent all tickets
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
            addLog(`⭐ Reached BP Level ${bpLevel}!`);
        }
    }

    addLog(`\n🏁 SIMULATION COMPLETE`);

    // Render Results
    document.getElementById('wcSimResults').style.display = 'block';
    document.getElementById('wcResTickets').innerText = totalTicketsSpent;
    document.getElementById('wcResBP').innerText = bpLevel;
    document.getElementById('wcResXP').innerText = xp;

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
