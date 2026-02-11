// ==========================================
// DATA PART 1: CORE CONFIGURATIONS (FULL RESTORE)
// ==========================================

var simConfig = {
  "dailyMatches": 8,
  "winRate": 85,
  "dailyAds": 4,
  "dailyMissions": 9,
  "upgradeFreq": 80,
  "lossPenalty": 30,
  "doWatchEarn": true,
  "doFreeChest": true,
  "minGoals": 3,
  "maxGoals": 8,
  "pupUpgradeFreq": 80,
  "dailyPowerUpChestLimit": 2,
  "dailyFreeChestLimit": 2
};





















// DAILY LOGIN REWARDS (User Request: Taiga on Day 2 & 4)
var loginConfig = {
  "fixed": [
    { "day": 1, "type": "Gold", "amt": 100 },
    { "day": 2, "type": "Card Taiga", "amt": 8 },
    { "day": 3, "type": "Diamonds", "amt": 10 },
    { "day": 4, "type": "Card Taiga", "amt": 10 },
    { "day": 5, "type": "Gold", "amt": 500 },
    { "day": 6, "type": "Random Power Card", "amt": 5 },
    { "day": 7, "type": "Pro Chest", "amt": 1 }
  ]
};


























// MISSION DATA - BUCKETIZED (Base Copy Removed)


var missionData = {
  "b1": [
    {
      "task": "Open Free Case",
      "req": 1,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Watch Ads",
      "req": 2,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Use Super Powers",
      "req": 5,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Play Matches",
      "req": 2,
      "type": "Gold",
      "amt": 50,
      "xp": 50
    },
    {
      "task": "Play Matches",
      "req": 6,
      "type": "Gold",
      "amt": 150,
      "xp": 150
    },
    {
      "task": "Score Goals",
      "req": 10,
      "type": "Gold",
      "amt": 50,
      "xp": 50
    },
    {
      "task": "Score Goals",
      "req": 20,
      "type": "Gold",
      "amt": 100,
      "xp": 100
    },
    {
      "task": "Gather Cups",
      "req": 120,
      "type": "Gold",
      "amt": 75,
      "xp": 75
    },
    {
      "task": "Gather Cups",
      "req": 250,
      "type": "Gold",
      "amt": 150,
      "xp": 150
    }
  ],
  "b2": [
    {
      "task": "Open Free Case",
      "req": 1,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Watch Ads",
      "req": 2,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Use Super Powers",
      "req": 5,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Play Matches",
      "req": 2,
      "type": "Gold",
      "amt": 50,
      "xp": 50
    },
    {
      "task": "Play Matches",
      "req": 6,
      "type": "Gold",
      "amt": 150,
      "xp": 150
    },
    {
      "task": "Score Goals",
      "req": 10,
      "type": "Gold",
      "amt": 50,
      "xp": 50
    },
    {
      "task": "Score Goals",
      "req": 20,
      "type": "Gold",
      "amt": 100,
      "xp": 100
    },
    {
      "task": "Gather Cups",
      "req": 120,
      "type": "Gold",
      "amt": 75,
      "xp": 75
    },
    {
      "task": "Gather Cups",
      "req": 250,
      "type": "Gold",
      "amt": 150,
      "xp": 150
    }
  ],
  "b3": [
    {
      "task": "Open Free Case",
      "req": 1,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Watch Ads",
      "req": 2,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Use Super Powers",
      "req": 5,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Play Matches",
      "req": 2,
      "type": "Gold",
      "amt": 50,
      "xp": 50
    },
    {
      "task": "Play Matches",
      "req": 6,
      "type": "Gold",
      "amt": 150,
      "xp": 150
    },
    {
      "task": "Score Goals",
      "req": 10,
      "type": "Gold",
      "amt": 50,
      "xp": 50
    },
    {
      "task": "Score Goals",
      "req": 20,
      "type": "Gold",
      "amt": 100,
      "xp": 100
    },
    {
      "task": "Gather Cups",
      "req": 120,
      "type": "Gold",
      "amt": 75,
      "xp": 75
    },
    {
      "task": "Gather Cups",
      "req": 250,
      "type": "Gold",
      "amt": 150,
      "xp": 150
    }
  ],
  "b4": [
    {
      "task": "Open Free Case",
      "req": 1,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Watch Ads",
      "req": 2,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Use Super Powers",
      "req": 5,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Play Matches",
      "req": 2,
      "type": "Gold",
      "amt": 50,
      "xp": 50
    },
    {
      "task": "Play Matches",
      "req": 6,
      "type": "Gold",
      "amt": 150,
      "xp": 150
    },
    {
      "task": "Score Goals",
      "req": 10,
      "type": "Gold",
      "amt": 50,
      "xp": 50
    },
    {
      "task": "Score Goals",
      "req": 20,
      "type": "Gold",
      "amt": 100,
      "xp": 100
    },
    {
      "task": "Gather Cups",
      "req": 120,
      "type": "Gold",
      "amt": 75,
      "xp": 75
    },
    {
      "task": "Gather Cups",
      "req": 250,
      "type": "Gold",
      "amt": 150,
      "xp": 150
    }
  ],
  "b5": [
    {
      "task": "Open Free Case",
      "req": 1,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Watch Ads",
      "req": 2,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Use Super Powers",
      "req": 5,
      "type": "Diamonds",
      "amt": 5,
      "xp": 30
    },
    {
      "task": "Play Matches",
      "req": 2,
      "type": "Gold",
      "amt": 50,
      "xp": 50
    },
    {
      "task": "Play Matches",
      "req": 6,
      "type": "Gold",
      "amt": 150,
      "xp": 150
    },
    {
      "task": "Score Goals",
      "req": 10,
      "type": "Gold",
      "amt": 50,
      "xp": 50
    },
    {
      "task": "Score Goals",
      "req": 20,
      "type": "Gold",
      "amt": 100,
      "xp": 100
    },
    {
      "task": "Gather Cups",
      "req": 120,
      "type": "Gold",
      "amt": 75,
      "xp": 75
    },
    {
      "task": "Gather Cups",
      "req": 250,
      "type": "Gold",
      "amt": 150,
      "xp": 150
    }
  ]
};














// GRAND PRIZE - BUCKETIZED


var missionCompletion = {
  "b1": {
    "req": 9,
    "r1t": "Rookie Chest",
    "r1a": 1,
    "r2t": "Diamonds",
    "r2a": 20
  },
  "b2": {
    "req": 9,
    "r1t": "Pro Chest",
    "r1a": 1,
    "r2t": "Diamonds",
    "r2a": 20
  },
  "b3": {
    "req": 9,
    "r1t": "Pro Chest",
    "r1a": 2,
    "r2t": "Diamonds",
    "r2a": 20
  },
  "b4": {
    "req": 9,
    "r1t": "Champion Chest",
    "r1a": 1,
    "r2t": "Diamonds",
    "r2a": 20
  },
  "b5": {
    "req": 9,
    "r1t": "Champion Chest",
    "r1a": 2,
    "r2t": "Diamonds",
    "r2a": 20
  }
};













var winRewardData = {
  "b1": [
    {
      "winCount": 1,
      "type": "Rookie Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 100
    },
    {
      "winCount": 3,
      "type": "Rookie Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 100
    },
    {
      "winCount": 5,
      "type": "Rookie Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 100
    }
  ],
  "b2": [
    {
      "winCount": 1,
      "type": "Rookie Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 200
    },
    {
      "winCount": 3,
      "type": "Rookie Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 200
    },
    {
      "winCount": 5,
      "type": "Pro Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 200
    }
  ],
  "b3": [
    {
      "winCount": 1,
      "type": "Rookie Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 300
    },
    {
      "winCount": 3,
      "type": "Pro Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 300
    },
    {
      "winCount": 5,
      "type": "Pro Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 300
    }
  ],
  "b4": [
    {
      "winCount": 1,
      "type": "Pro Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 400
    },
    {
      "winCount": 3,
      "type": "Pro Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 400
    },
    {
      "winCount": 5,
      "type": "Champion Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 400
    }
  ],
  "b5": [
    {
      "winCount": 1,
      "type": "Pro Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 500
    },
    {
      "winCount": 3,
      "type": "Champion Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 500
    },
    {
      "winCount": 5,
      "type": "Champion Chest",
      "amt": 1,
      "type2": "Gold",
      "amt2": 500
    }
  ]
};



// WATCH & EARN (ESKİ HALİ - SADECE 3 SÜTUN)
// WATCH & EARN (BUCKETIZED)
var weConfig = {
  "b1": [
    { "step": 1, "type": "Gold", "amt": 50, "hcInt": 2.5 },
    { "step": 2, "type": "Diamonds", "amt": 5, "hcInt": 75 },
    { "step": 3, "type": "Random Power Card", "amt": 5, "hcInt": 60 },
    { "step": 4, "type": "Rookie Chest", "amt": 1, "hcInt": 150 }
  ],
  "b2": [
    { "step": 1, "type": "Gold", "amt": 100, "hcInt": 5 },
    { "step": 2, "type": "Diamonds", "amt": 10, "hcInt": 150 },
    { "step": 3, "type": "Random Power Card", "amt": 10, "hcInt": 120 },
    { "step": 4, "type": "Pro Chest", "amt": 1, "hcInt": 460 }
  ],
  "b3": [
    { "step": 1, "type": "Gold", "amt": 200, "hcInt": 10 },
    { "step": 2, "type": "Diamonds", "amt": 20, "hcInt": 300 },
    { "step": 3, "type": "Random Power Card", "amt": 5, "hcInt": 60 },
    { "step": 4, "type": "Champion Chest", "amt": 1, "hcInt": 1150 }
  ],
  "b4": [
    { "step": 1, "type": "Gold", "amt": 400, "hcInt": 20 },
    { "step": 2, "type": "Diamonds", "amt": 40, "hcInt": 600 },
    { "step": 3, "type": "Random Power Card", "amt": 10, "hcInt": 120 },
    { "step": 4, "type": "Champion Chest", "amt": 2, "hcInt": 2300 }
  ],
  "b5": [
    { "step": 1, "type": "Gold", "amt": 800, "hcInt": 40 },
    { "step": 2, "type": "Diamonds", "amt": 80, "hcInt": 1200 },
    { "step": 3, "type": "Random Power Card", "amt": 5, "hcInt": 60 },
    { "step": 4, "type": "Legendary Chest", "amt": 1, "hcInt": 2500 }
  ]
};

// --- REWARD CHESTS (Gold & Diamond) ---
var rewardChestConfig = {
  "goldChest": {
    "dailyLimit": 2,
    "b1": 100,
    "b2": 150,
    "b3": 300,
    "b4": 400,
    "b5": 1000
  },
  "diamondChest": {
    "dailyLimit": 2,
    "b1": 5,
    "b2": 8,
    "b3": 15,
    "b4": 20,
    "b5": 50
  }
};


// --- MARKET CONFIG ---
var marketConfig = {
  "goldPackages": [
    { "id": "gold_small", "gold": 500, "diamonds": 50, "name": "Small Gold Pack", "img": "gold_card" },
    { "id": "gold_medium", "gold": 1500, "diamonds": 125, "name": "Medium Gold Pack", "img": "gold_card" },
    { "id": "gold_large", "gold": 5000, "diamonds": 350, "name": "Large Gold Pack", "img": "gold_card" }
  ],
  "powerPacks": [
    // 1 STAR (5 Diamonds)
    { "id": "pup_mega_ball", "star": 1, "count": 5, "diamonds": 5, "name": "5x Mega Ball", "img": "Mega Ball" },
    { "id": "pup_reverse_controls", "star": 1, "count": 5, "diamonds": 5, "name": "5x Reverse Controls", "img": "Reverse Controls" },
    { "id": "pup_invisible_ball", "star": 1, "count": 5, "diamonds": 5, "name": "5x Invisible Ball", "img": "Invisible Ball" },
    { "id": "pup_mini_goal", "star": 1, "count": 5, "diamonds": 5, "name": "5x Mini Goal", "img": "Mini Goal" },
    { "id": "pup_ice_ball", "star": 1, "count": 5, "diamonds": 5, "name": "5x Ice Ball", "img": "Ice Ball" },

    // 2 STAR (10 Diamonds)
    { "id": "pup_enlarged_goal", "star": 2, "count": 5, "diamonds": 10, "name": "5x Enlarged Goal", "img": "Enlarged Goal" },
    { "id": "pup_double_goal", "star": 2, "count": 5, "diamonds": 10, "name": "5x Double Goal", "img": "Double Goal" },
    { "id": "pup_locked_goal", "star": 2, "count": 5, "diamonds": 10, "name": "5x Locked Goal", "img": "Locked Goal" },
    { "id": "pup_trap", "star": 2, "count": 5, "diamonds": 10, "name": "5x Trap", "img": "Trap" },
    { "id": "pup_giant_player", "star": 2, "count": 5, "diamonds": 10, "name": "5x Giant Player", "img": "Giant Player" },
    { "id": "pup_dynamite", "star": 2, "count": 5, "diamonds": 10, "name": "5x Dynamite", "img": "Dynamite" },
    { "id": "pup_rocket_gun", "star": 2, "count": 5, "diamonds": 10, "name": "5x Rocket Gun", "img": "Rocket Gun" },

    // 3 STAR (15 Diamonds)
    { "id": "pup_paint_spray", "star": 3, "count": 5, "diamonds": 15, "name": "5x Paint Spray", "img": "Paint Spray" },
    { "id": "pup_overcharge", "star": 3, "count": 5, "diamonds": 15, "name": "5x Overcharge", "img": "Overcharge" }
  ],
  "chests": [
    { "id": "free_chest", "name": "Free Chest", "type": "Free Chest", "img": "Free Chest" },
    { "id": "power_chest", "name": "PowerUp Chest", "type": "PowerUp Chest", "img": "free_power" },
    { "id": "gold_chest", "name": "Gold Chest", "type": "Gold Chest", "img": "gold_chest" },
    { "id": "diamond_chest", "name": "Diamond Chest", "type": "Diamond Chest", "img": "diamond_chest" },

    // Bucket 1+
    { "id": "rookie_chest", "name": "Rookie Chest", "type": "Rookie Chest", "img": "Rookie Chest", "diamonds": 30, "minBucket": 1 },
    { "id": "pro_chest", "name": "Pro Chest", "type": "Pro Chest", "img": "Pro Chest", "diamonds": 80, "minBucket": 1 },

    // Bucket 3+
    { "id": "champion_chest", "name": "Champion Chest", "type": "Champion Chest", "img": "Champion Chest", "diamonds": 150, "minBucket": 3 },

    // Bucket 4+
    { "id": "legendary_chest", "name": "Legendary Chest", "type": "Legendary Chest", "img": "Legendary Chest", "diamonds": 300, "minBucket": 4 }
  ]
};


var loginConfig = {
  "onboarding": [
    { "day": 1, "type": "Gold", "amt": 100 },
    { "day": 2, "type": "Card Taiga", "amt": 8 },
    { "day": 3, "type": "Diamonds", "amt": 10 },
    { "day": 4, "type": "Card Taiga", "amt": 10 },
    { "day": 5, "type": "Pro Chest", "amt": 1 },
    { "day": 6, "type": "Gold", "amt": 300 },
    { "day": 7, "type": "Pro Chest", "amt": 2 }
  ],
  "fixed": {
    "b1": [
      { "day": 1, "type": "Gold", "amt": 50, "hcInt": 2.5 },
      { "day": 2, "type": "Rookie Chest", "amt": 1, "hcInt": 150 },
      { "day": 3, "type": "Gold", "amt": 100, "hcInt": 5 },
      { "day": 4, "type": "Rookie Chest", "amt": 1, "hcInt": 150 },
      { "day": 5, "type": "Diamonds", "amt": 5, "hcInt": 75 },
      { "day": 6, "type": "Gold", "amt": 200, "hcInt": 10 },
      { "day": 7, "type": "Pro Chest", "amt": 1, "hcInt": 460 }
    ],
    "b2": [
      { "day": 1, "type": "Gold", "amt": 100, "hcInt": 5 },
      { "day": 2, "type": "Rookie Chest", "amt": 1, "hcInt": 150 },
      { "day": 3, "type": "Gold", "amt": 200, "hcInt": 10 },
      { "day": 4, "type": "Pro Chest", "amt": 1, "hcInt": 460 },
      { "day": 5, "type": "Diamonds", "amt": 10, "hcInt": 150 },
      { "day": 6, "type": "Gold", "amt": 400, "hcInt": 20 },
      { "day": 7, "type": "Pro Chest", "amt": 2, "hcInt": 920 }
    ],
    "b3": [
      { "day": 1, "type": "Gold", "amt": 200, "hcInt": 10 },
      { "day": 2, "type": "Pro Chest", "amt": 1, "hcInt": 460 },
      { "day": 3, "type": "Gold", "amt": 400, "hcInt": 20 },
      { "day": 4, "type": "Pro Chest", "amt": 2, "hcInt": 920 },
      { "day": 5, "type": "Diamonds", "amt": 20, "hcInt": 300 },
      { "day": 6, "type": "Gold", "amt": 800, "hcInt": 40 },
      { "day": 7, "type": "Champion Chest", "amt": 1, "hcInt": 1150 }
    ],
    "b4": [
      { "day": 1, "type": "Gold", "amt": 400, "hcInt": 20 },
      { "day": 2, "type": "Pro Chest", "amt": 2, "hcInt": 920 },
      { "day": 3, "type": "Gold", "amt": 800, "hcInt": 40 },
      { "day": 4, "type": "Champion Chest", "amt": 1, "hcInt": 1150 },
      { "day": 5, "type": "Diamonds", "amt": 40, "hcInt": 600 },
      { "day": 6, "type": "Gold", "amt": 1600, "hcInt": 80 },
      { "day": 7, "type": "Champion Chest", "amt": 2, "hcInt": 2300 }
    ],
    "b5": [
      { "day": 1, "type": "Gold", "amt": 800, "hcInt": 40 },
      { "day": 2, "type": "Champion Chest", "amt": 1, "hcInt": 1150 },
      { "day": 3, "type": "Gold", "amt": 1600, "hcInt": 80 },
      { "day": 4, "type": "Champion Chest", "amt": 2, "hcInt": 2300 },
      { "day": 5, "type": "Diamonds", "amt": 80, "hcInt": 1200 },
      { "day": 6, "type": "Gold", "amt": 3200, "hcInt": 160 },
      { "day": 7, "type": "Legendary Chest", "amt": 1, "hcInt": 2500 }
    ]
  }
};


// --- LEADERBOARD CONFIG (FULL 20 RANK / B1-B5) ---
var leaderboardConfig = {
  "b1": [
    { "rank": 1, "t1": "Diamonds", "a1": 50, "t2": "Gold", "a2": 1000 },
    { "rank": 2, "t1": "Diamonds", "a1": 30, "t2": "Gold", "a2": 800 },
    { "rank": 3, "t1": "Diamonds", "a1": 20, "t2": "Gold", "a2": 600 },
    { "rank": 4, "t1": "-", "a1": 0, "t2": "Gold", "a2": 500 },
    { "rank": 5, "t1": "-", "a1": 0, "t2": "Gold", "a2": 400 },
    { "rank": 6, "t1": "-", "a1": 0, "t2": "Gold", "a2": 300 },
    { "rank": 7, "t1": "-", "a1": 0, "t2": "Gold", "a2": 250 },
    { "rank": 8, "t1": "-", "a1": 0, "t2": "Gold", "a2": 150 },
    { "rank": 9, "t1": "-", "a1": 0, "t2": "Gold", "a2": 100 },
    { "rank": 10, "t1": "-", "a1": 0, "t2": "Gold", "a2": 50 },
    { "rank": 11, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 12, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 13, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 14, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 15, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 16, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 17, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 18, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 19, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 20, "t1": "-", "a1": 0, "t2": "-", "a2": 0 }
  ],
  "b2": [
    { "rank": 1, "t1": "Diamonds", "a1": 60, "t2": "Gold", "a2": 1200 },
    { "rank": 2, "t1": "Diamonds", "a1": 45, "t2": "Gold", "a2": 1000 },
    { "rank": 3, "t1": "Diamonds", "a1": 30, "t2": "Gold", "a2": 900 },
    { "rank": 4, "t1": "-", "a1": 0, "t2": "Gold", "a2": 800 },
    { "rank": 5, "t1": "-", "a1": 0, "t2": "Gold", "a2": 700 },
    { "rank": 6, "t1": "-", "a1": 0, "t2": "Gold", "a2": 600 },
    { "rank": 7, "t1": "-", "a1": 0, "t2": "Gold", "a2": 500 },
    { "rank": 8, "t1": "-", "a1": 0, "t2": "Gold", "a2": 400 },
    { "rank": 9, "t1": "-", "a1": 0, "t2": "Gold", "a2": 300 },
    { "rank": 10, "t1": "-", "a1": 0, "t2": "Gold", "a2": 200 },
    { "rank": 11, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 12, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 13, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 14, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 15, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 16, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 17, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 18, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 19, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 20, "t1": "-", "a1": 0, "t2": "-", "a2": 0 }
  ],
  "b3": [
    { "rank": 1, "t1": "Diamonds", "a1": 75, "t2": "Gold", "a2": 1500 },
    { "rank": 2, "t1": "Diamonds", "a1": 50, "t2": "Gold", "a2": 1250 },
    { "rank": 3, "t1": "Diamonds", "a1": 25, "t2": "Gold", "a2": 1000 },
    { "rank": 4, "t1": "-", "a1": 0, "t2": "Gold", "a2": 900 },
    { "rank": 5, "t1": "-", "a1": 0, "t2": "Gold", "a2": 800 },
    { "rank": 6, "t1": "-", "a1": 0, "t2": "Gold", "a2": 700 },
    { "rank": 7, "t1": "-", "a1": 0, "t2": "Gold", "a2": 600 },
    { "rank": 8, "t1": "-", "a1": 0, "t2": "Gold", "a2": 500 },
    { "rank": 9, "t1": "-", "a1": 0, "t2": "Gold", "a2": 400 },
    { "rank": 10, "t1": "-", "a1": 0, "t2": "Gold", "a2": 300 },
    { "rank": 11, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 12, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 13, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 14, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 15, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 16, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 17, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 18, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 19, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 20, "t1": "-", "a1": 0, "t2": "-", "a2": 0 }
  ],
  "b4": [
    { "rank": 1, "t1": "Diamonds", "a1": 100, "t2": "Gold", "a2": 2000 },
    { "rank": 2, "t1": "Diamonds", "a1": 75, "t2": "Gold", "a2": 1750 },
    { "rank": 3, "t1": "Diamonds", "a1": 50, "t2": "Gold", "a2": 1500 },
    { "rank": 4, "t1": "-", "a1": 0, "t2": "Gold", "a2": 1250 },
    { "rank": 5, "t1": "-", "a1": 0, "t2": "Gold", "a2": 1000 },
    { "rank": 6, "t1": "-", "a1": 0, "t2": "Gold", "a2": 900 },
    { "rank": 7, "t1": "-", "a1": 0, "t2": "Gold", "a2": 800 },
    { "rank": 8, "t1": "-", "a1": 0, "t2": "Gold", "a2": 700 },
    { "rank": 9, "t1": "-", "a1": 0, "t2": "Gold", "a2": 600 },
    { "rank": 10, "t1": "-", "a1": 0, "t2": "Gold", "a2": 500 },
    { "rank": 11, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 12, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 13, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 14, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 15, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 16, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 17, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 18, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 19, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 20, "t1": "-", "a1": 0, "t2": "-", "a2": 0 }
  ],
  "b5": [
    { "rank": 1, "t1": "Diamonds", "a1": 150, "t2": "Gold", "a2": 3000 },
    { "rank": 2, "t1": "Diamonds", "a1": 100, "t2": "Gold", "a2": 2500 },
    { "rank": 3, "t1": "Diamonds", "a1": 75, "t2": "Gold", "a2": 2000 },
    { "rank": 4, "t1": "-", "a1": 0, "t2": "Gold", "a2": 1500 },
    { "rank": 5, "t1": "-", "a1": 0, "t2": "Gold", "a2": 1300 },
    { "rank": 6, "t1": "-", "a1": 0, "t2": "Gold", "a2": 1100 },
    { "rank": 7, "t1": "-", "a1": 0, "t2": "Gold", "a2": 900 },
    { "rank": 8, "t1": "-", "a1": 0, "t2": "Gold", "a2": 800 },
    { "rank": 9, "t1": "-", "a1": 0, "t2": "Gold", "a2": 700 },
    { "rank": 10, "t1": "-", "a1": 0, "t2": "Gold", "a2": 600 },
    { "rank": 11, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 12, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 13, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 14, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 15, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 16, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 17, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 18, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 19, "t1": "-", "a1": 0, "t2": "-", "a2": 0 },
    { "rank": 20, "t1": "-", "a1": 0, "t2": "-", "a2": 0 }
  ]
};

var chestConfigs = {
  "Rookie Chest": {
    "slots": 4,
    "gold": {
      "b1": 50,
      "b2": 50,
      "b3": 60,
      "b4": 70,
      "b5": 80
    },
    "amounts": {
      "Rookie": {
        "b1": 60,
        "b2": 60,
        "b3": 90,
        "b4": 120,
        "b5": 150
      },
      "Pro": {
        "b1": 12,
        "b2": 12,
        "b3": 18,
        "b4": 24,
        "b5": 30
      },
      "Champion": {
        "b1": 0,
        "b2": 0,
        "b3": 0,
        "b4": 0,
        "b5": 0
      },
      "Legendary": {
        "b1": 0,
        "b2": 0,
        "b3": 0,
        "b4": 0,
        "b5": 0
      }
    },
    "slotProbs": [
      {
        "id": 1,
        "b1": { "R": 75, "P": 25, "C": 0, "L": 0 },
        "b2": { "R": 75, "P": 25, "C": 0, "L": 0 },
        "b3": { "R": 70, "P": 30, "C": 0, "L": 0 },
        "b4": { "R": 65, "P": 35, "C": 0, "L": 0 },
        "b5": { "R": 60, "P": 40, "C": 0, "L": 0 }
      },
      {
        "id": 2,
        "b1": { "R": 65, "P": 35, "C": 0, "L": 0 },
        "b2": { "R": 65, "P": 35, "C": 0, "L": 0 },
        "b3": { "R": 60, "P": 40, "C": 0, "L": 0 },
        "b4": { "R": 55, "P": 45, "C": 0, "L": 0 },
        "b5": { "R": 50, "P": 50, "C": 0, "L": 0 }
      },
      {
        "id": 3,
        "b1": { "R": 55, "P": 45, "C": 0, "L": 0 },
        "b2": { "R": 55, "P": 45, "C": 0, "L": 0 },
        "b3": { "R": 50, "P": 50, "C": 0, "L": 0 },
        "b4": { "R": 45, "P": 55, "C": 0, "L": 0 },
        "b5": { "R": 40, "P": 60, "C": 0, "L": 0 }
      },
      {
        "id": 4,
        "b1": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b2": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b3": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b4": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b5": { "R": 0, "P": 0, "C": 0, "L": 0 }
      }
    ]
  },
  "Pro Chest": {
    "slots": 4,
    "gold": {
      "b1": 60,
      "b2": 60,
      "b3": 70,
      "b4": 80,
      "b5": 90
    },
    "amounts": {
      "Rookie": {
        "b1": 120,
        "b2": 120,
        "b3": 160,
        "b4": 200,
        "b5": 240
      },
      "Pro": {
        "b1": 24,
        "b2": 24,
        "b3": 32,
        "b4": 40,
        "b5": 48
      },
      "Champion": {
        "b1": 0,
        "b2": 0,
        "b3": 8,
        "b4": 10,
        "b5": 12
      },
      "Legendary": {
        "b1": 0,
        "b2": 0,
        "b3": 0,
        "b4": 2,
        "b5": 0
      }
    },
    "slotProbs": [
      {
        "id": 1,
        "b1": { "R": 35, "P": 65, "C": 0, "L": 0 },
        "b2": { "R": 35, "P": 65, "C": 0, "L": 0 },
        "b3": { "R": 35, "P": 55, "C": 10, "L": 0 },
        "b4": { "R": 35, "P": 50, "C": 10, "L": 5 },
        "b5": { "R": 35, "P": 45, "C": 15, "L": 5 }
      },
      {
        "id": 2,
        "b1": { "R": 35, "P": 65, "C": 0, "L": 0 },
        "b2": { "R": 35, "P": 65, "C": 0, "L": 0 },
        "b3": { "R": 35, "P": 55, "C": 10, "L": 0 },
        "b4": { "R": 35, "P": 50, "C": 10, "L": 5 },
        "b5": { "R": 35, "P": 45, "C": 15, "L": 5 }
      },
      {
        "id": 3,
        "b1": { "R": 30, "P": 70, "C": 0, "L": 0 },
        "b2": { "R": 30, "P": 70, "C": 0, "L": 0 },
        "b3": { "R": 35, "P": 55, "C": 10, "L": 0 },
        "b4": { "R": 30, "P": 50, "C": 15, "L": 5 },
        "b5": { "R": 30, "P": 45, "C": 20, "L": 5 }
      },
      {
        "id": 4,
        "b1": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b2": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b3": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b4": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b5": { "R": 0, "P": 0, "C": 0, "L": 0 }
      }
    ]
  },
  "Champion Chest": {
    "slots": 4,
    "gold": {
      "b1": 100,
      "b2": 100,
      "b3": 200,
      "b4": 300,
      "b5": 400
    },
    "amounts": {
      "Rookie": {
        "b1": 60,
        "b2": 60,
        "b3": 70,
        "b4": 90,
        "b5": 110
      },
      "Pro": {
        "b1": 12,
        "b2": 12,
        "b3": 14,
        "b4": 18,
        "b5": 22
      },
      "Champion": {
        "b1": 0,
        "b2": 0,
        "b3": 4,
        "b4": 5,
        "b5": 6
      },
      "Legendary": {
        "b1": 0,
        "b2": 0,
        "b3": 0,
        "b4": 1,
        "b5": 1
      }
    },
    "slotProbs": [
      {
        "id": 1,
        "b1": { "R": 40, "P": 60, "C": 0, "L": 0 },
        "b2": { "R": 40, "P": 60, "C": 0, "L": 0 },
        "b3": { "R": 15, "P": 25, "C": 60, "L": 0 },
        "b4": { "R": 0, "P": 20, "C": 65, "L": 15 },
        "b5": { "R": 0, "P": 15, "C": 70, "L": 15 }
      },
      {
        "id": 2,
        "b1": { "R": 40, "P": 60, "C": 0, "L": 0 },
        "b2": { "R": 40, "P": 60, "C": 0, "L": 0 },
        "b3": { "R": 15, "P": 25, "C": 60, "L": 0 },
        "b4": { "R": 0, "P": 20, "C": 65, "L": 15 },
        "b5": { "R": 0, "P": 15, "C": 70, "L": 15 }
      },
      {
        "id": 3,
        "b1": { "R": 40, "P": 60, "C": 0, "L": 0 },
        "b2": { "R": 40, "P": 60, "C": 0, "L": 0 },
        "b3": { "R": 15, "P": 20, "C": 65, "L": 0 },
        "b4": { "R": 0, "P": 10, "C": 65, "L": 25 },
        "b5": { "R": 0, "P": 10, "C": 70, "L": 20 }
      },
      {
        "id": 4,
        "b1": { "R": 40, "P": 60, "C": 0, "L": 0 },
        "b2": { "R": 40, "P": 60, "C": 0, "L": 0 },
        "b3": { "R": 15, "P": 25, "C": 60, "L": 0 },
        "b4": { "R": 0, "P": 10, "C": 65, "L": 25 },
        "b5": { "R": 0, "P": 10, "C": 70, "L": 20 }
      }
    ]
  },
  "Legendary Chest": {
    "slots": 4,
    "gold": {
      "b1": 200,
      "b2": 200,
      "b3": 300,
      "b4": 400,
      "b5": 500
    },
    "amounts": {
      "Rookie": {
        "b1": 0,
        "b2": 0,
        "b3": 30,
        "b4": 0,
        "b5": 0
      },
      "Pro": {
        "b1": 0,
        "b2": 0,
        "b3": 18,
        "b4": 24,
        "b5": 28
      },
      "Champion": {
        "b1": 0,
        "b2": 0,
        "b3": 5,
        "b4": 6,
        "b5": 7
      },
      "Legendary": {
        "b1": 0,
        "b2": 0,
        "b3": 0,
        "b4": 1,
        "b5": 1
      }
    },
    "slotProbs": [
      {
        "id": 1,
        "b1": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b2": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b3": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b4": { "R": 0, "P": 10, "C": 35, "L": 55 },
        "b5": { "R": 0, "P": 5, "C": 30, "L": 65 }
      },
      {
        "id": 2,
        "b1": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b2": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b3": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b4": { "R": 0, "P": 10, "C": 25, "L": 65 },
        "b5": { "R": 0, "P": 5, "C": 25, "L": 70 }
      },
      {
        "id": 3,
        "b1": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b2": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b3": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b4": { "R": 0, "P": 5, "C": 25, "L": 70 },
        "b5": { "R": 0, "P": 0, "C": 25, "L": 75 }
      },
      {
        "id": 4,
        "b1": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b2": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b3": { "R": 0, "P": 0, "C": 0, "L": 0 },
        "b4": { "R": 0, "P": 0, "C": 0, "L": 100 },
        "b5": { "R": 0, "P": 0, "C": 0, "L": 100 }
      }
    ]
  },
  "Free Chest": {
    "slots": 2,
    "gold": {
      "b1": 10,
      "b2": 10,
      "b3": 20,
      "b4": 30,
      "b5": 40
    },
    "amounts": {
      "Rookie": {
        "b1": 30,
        "b2": 30,
        "b3": 40,
        "b4": 60,
        "b5": 80
      },
      "Pro": {
        "b1": 6,
        "b2": 6,
        "b3": 8,
        "b4": 12,
        "b5": 16
      },
      "Champion": {
        "b1": 0,
        "b2": 0,
        "b3": 0,
        "b4": 0,
        "b5": 0
      },
      "Legendary": {
        "b1": 0,
        "b2": 0,
        "b3": 0,
        "b4": 0,
        "b5": 0
      }
    },
    "slotProbs": [
      {
        "id": 1,
        "b1": { "R": 75, "P": 25, "C": 0, "L": 0 },
        "b2": { "R": 75, "P": 25, "C": 0, "L": 0 },
        "b3": { "R": 70, "P": 30, "C": 0, "L": 0 },
        "b4": { "R": 65, "P": 35, "C": 0, "L": 0 },
        "b5": { "R": 60, "P": 40, "C": 0, "L": 0 }
      },
      {
        "id": 2,
        "b1": { "R": 65, "P": 35, "C": 0, "L": 0 },
        "b2": { "R": 65, "P": 35, "C": 0, "L": 0 },
        "b3": { "R": 60, "P": 40, "C": 0, "L": 0 },
        "b4": { "R": 55, "P": 45, "C": 0, "L": 0 },
        "b5": { "R": 50, "P": 50, "C": 0, "L": 0 }
      }
    ]
  },
  "PowerUp Chest": {
    "customType": "PowerUp",
    "poolSplit": {
      "in": 70,
      "out": 30
    },
    "slots": 1,
    "gold": {
      "b1": 0,
      "b2": 0,
      "b3": 0,
      "b4": 0,
      "b5": 0
    },
    "amounts": {
      "Rookie": {
        "b1": 3,
        "b2": 4,
        "b3": 5,
        "b4": 6,
        "b5": 7
      },
      "Pro": {
        "b1": 2,
        "b2": 2,
        "b3": 3,
        "b4": 3,
        "b5": 4
      },
      "Champion": {
        "b1": 0,
        "b2": 0,
        "b3": 2,
        "b4": 2,
        "b5": 2
      },
      "Legendary": {
        "b1": 0,
        "b2": 0,
        "b3": 0,
        "b4": 0,
        "b5": 0
      }
    },
    "slotProbs": [
      {
        "id": 1,
        "b1": {
          "R": 75,
          "P": 25,
          "C": 0,
          "L": 0
        },
        "b2": {
          "R": 65,
          "P": 35,
          "C": 0,
          "L": 0
        },
        "b3": {
          "R": 50,
          "P": 45,
          "C": 5,
          "L": 0
        },
        "b4": {
          "R": 45,
          "P": 40,
          "C": 15,
          "L": 0
        },
        "b5": {
          "R": 35,
          "P": 40,
          "C": 25,
          "L": 0
        }
      }
    ]
  }
};


























let scriptedChests = [
  { "id": "Scripted Chest", "gold": 50, "c1n": "Axel", "c1a": 60, "c2n": "Raven", "c2a": 60 }
];

let startConfig = {
  "gold": 450,
  "diamonds": 0,
  "tutorialGold": 0
};

let slotUnlockData = [
  {
    "slot": 3,
    "req": 4
  },
  {
    "slot": 4,
    "req": 10
  },
  {
    "slot": 5,
    "req": 22
  },
  {
    "slot": 6,
    "req": 42
  }
];

// --- BOT INTELLIGENCE DATA ---
var botData = [
  { "id": "training_dummy", "name": "Training Dummy", "difficulty": -50, "desc": "Very Easy. Misses shots, slow." },
  { "id": "rookie_bot", "name": "Rookie Bot", "difficulty": -20, "desc": "Easy. Basic movement." },
  { "id": "average_joe", "name": "Average Joe", "difficulty": 0, "desc": "Normal. Balanced gameplay." },
  { "id": "pro_gamer", "name": "Pro Gamer", "difficulty": 30, "desc": "Hard. Good aim and defense." },
  { "id": "cheater_bot", "name": "Cheater Bot", "difficulty": 80, "desc": "Impossible. Almost never misses." }
];

// --- MATCHMAKING RULES ---
var matchmakingData = [
  { "min": 0, "max": 500, "dist": { "training_dummy": 60, "rookie_bot": 30, "average_joe": 10 } },
  { "min": 501, "max": 1500, "dist": { "rookie_bot": 40, "average_joe": 40, "pro_gamer": 20 } },
  { "min": 1501, "max": 4000, "dist": { "average_joe": 30, "pro_gamer": 50, "cheater_bot": 20 } },
  { "min": 4001, "max": 99999, "dist": { "pro_gamer": 40, "cheater_bot": 60 } }
];

// --- DAILY SHOP CONFIG ---
var shopConfig = {
  "numSlots": 4,
  "slots": [
    { "id": 1, "type": "Free", "currency": "None", "cost": 0 },
    { "id": 2, "type": "Card", "currency": "Gold", "baseCost": 100 }, // Multiplied by bucket
    { "id": 3, "type": "PowerUp", "currency": "Gold", "baseCost": 500 },
    { "id": 4, "type": "Chest", "currency": "Diamonds", "baseCost": 50 }
  ],
  "priceMultipliers": { // Bucket modifiers
    "b1": 1.0, "b2": 1.5, "b3": 2.5, "b4": 4.0, "b5": 6.0
  }
};



