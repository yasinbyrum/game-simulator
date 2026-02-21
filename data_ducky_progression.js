// ==========================================
// DATA PART 3: PROGRESSION (LEVELS, CUP ROAD & ARENAS)
// ==========================================

// 1. ARENAS
var arenaData = [
  {
    "id": 1,
    "n": "Berlin Street Arena",
    "reqLevel": 1
  },
  {
    "id": 2,
    "n": "Miami Beach Arena",
    "reqLevel": 2
  },
  {
    "id": 3,
    "n": "Texas Desert Arena",
    "reqLevel": 3
  },
  {
    "id": 4,
    "n": "Moscow Kremlin Arena",
    "reqLevel": 4
  },
  {
    "id": 5,
    "n": "India Temple Arena",
    "reqLevel": 5
  },
  {
    "id": 6,
    "n": "Rome Colosseum Arena",
    "reqLevel": 7
  },
  {
    "id": 7,
    "n": "London Central Arena",
    "reqLevel": 9
  },
  {
    "id": 8,
    "n": "Tanzania Safari Arena",
    "reqLevel": 11
  },
  {
    "id": 9,
    "n": "Istanbul Bosphorus Arena",
    "reqLevel": 14
  },
  {
    "id": 10,
    "n": "Rio Favela Arena",
    "reqLevel": 19
  },
  {
    "id": 11,
    "n": "Tokyo Dojo Arena",
    "reqLevel": 24
  },
  {
    "id": 12,
    "n": "Transilvania Castle Arena",
    "reqLevel": 30
  }
];


// 2. LEVEL DATA (UPDATED XP)
var levelData = [
  {
    "l": 1,
    "req": 0
  },
  {
    "l": 2,
    "req": 20,
    "r1t": "Gold",
    "r1a": 100
  },
  {
    "l": 3,
    "req": 50,
    "r1t": "1★ Powerup",
    "r1a": 5
  },
  {
    "l": 4,
    "req": 50,
    "r1t": "Rookie Chest",
    "r1a": 1
  },
  {
    "l": 5,
    "req": 50,
    "r1t": "Gold",
    "r1a": 200,
    "r2t": "1★ Powerup",
    "r2a": 5,
    "ul": "1★ Powerup Unlock"
  },
  {
    "l": 6,
    "req": 80,
    "r1t": "Rookie Chest",
    "r1a": 1
  },
  {
    "l": 7,
    "req": 120,
    "r1t": "1★ Powerup",
    "r1a": 5
  },
  {
    "l": 8,
    "req": 150,
    "r1t": "Gold",
    "r1a": 300,
    "r2t": "2★ Powerup",
    "r2a": 3,
    "ul": "2★ Powerup Unlock"
  },
  {
    "l": 9,
    "req": 150,
    "r1t": "Rookie Chest",
    "r1a": 1
  },
  {
    "l": 10,
    "req": 200,
    "r1t": "Gold",
    "r1a": 400
  },
  {
    "l": 11,
    "req": 200,
    "r1t": "Rookie Chest",
    "r1a": 1,
    "r2t": "1★ Powerup",
    "r2a": 5,
    "ul": "1★ Powerup Unlock"
  },
  {
    "l": 12,
    "req": 240,
    "r1t": "Gold",
    "r1a": 500
  },
  {
    "l": 13,
    "req": 280,
    "r1t": "Rookie Chest",
    "r1a": 1
  },
  {
    "l": 14,
    "req": 300,
    "r1t": "1★ Powerup",
    "r1a": 5,
    "r2t": "2★ Powerup",
    "r2a": 3,
    "ul": "2★ Powerup Unlock"
  },
  {
    "l": 15,
    "req": 350,
    "r1t": "Diamonds",
    "r1a": 10,
    "r2t": "Gold",
    "r2a": 300
  },
  {
    "l": 16,
    "req": 450,
    "r1t": "Rookie Chest",
    "r1a": 1
  },
  {
    "l": 17,
    "req": 550,
    "r1t": "Diamonds",
    "r1a": 5
  },
  {
    "l": 18,
    "req": 650,
    "r1t": "Gold",
    "r1a": 600,
    "r2t": "1★ Powerup",
    "r2a": 5,
    "ul": "1★ Powerup Unlock"
  },
  {
    "l": 19,
    "req": 750,
    "r1t": "Pro Chest",
    "r1a": 1
  },
  {
    "l": 20,
    "req": 1000,
    "r1t": "Diamonds",
    "r1a": 5
  },
  {
    "l": 21,
    "req": 1250,
    "r1t": "Pro Chest",
    "r1a": 1,
    "r2t": "Gold",
    "r2a": 500
  },
  {
    "l": 22,
    "req": 1500,
    "r1t": "2★ Powerup",
    "r1a": 3,
    "r2t": "2★ Powerup",
    "r2a": 3,
    "ul": "2★ Powerup Unlock"
  },
  {
    "l": 23,
    "req": 2000,
    "r1t": "Gold",
    "r1a": 700
  },
  {
    "l": 24,
    "req": 2200,
    "r1t": "Diamonds",
    "r1a": 5,
    "r2t": "Gold",
    "r2a": 700
  },
  {
    "l": 25,
    "req": 2500,
    "r1t": "1★ Powerup",
    "r1a": 5
  },
  {
    "l": 26,
    "req": 3000,
    "r1t": "Pro Chest",
    "r1a": 1,
    "r2t": "1★ Powerup",
    "r2a": 5,
    "ul": "1★ Powerup Unlock"
  },
  {
    "l": 27,
    "req": 3500,
    "r1t": "2★ Powerup",
    "r1a": 3,
    "r2t": "Gold",
    "r2a": 900
  },
  {
    "l": 28,
    "req": 4100,
    "r1t": "1★ Powerup",
    "r1a": 5
  },
  {
    "l": 29,
    "req": 5000,
    "r1t": "Diamonds",
    "r1a": 5
  },
  {
    "l": 30,
    "req": 6000,
    "r1t": "1★ Powerup",
    "r1a": 5,
    "r2t": "Gold",
    "r2a": 1100
  },
  {
    "l": 31,
    "req": 7000,
    "r1t": "Pro Chest",
    "r1a": 1,
    "r2t": "2★ Powerup",
    "r2a": 3,
    "ul": "2★ Powerup Unlock"
  },
  {
    "l": 32,
    "req": 8000,
    "r1t": "2★ Powerup",
    "r1a": 3
  },
  {
    "l": 33,
    "req": 9000,
    "r1t": "1★ Powerup",
    "r1a": 5,
    "r2t": "Gold",
    "r2a": 1300
  },
  {
    "l": 34,
    "req": 10000,
    "r1t": "Diamonds",
    "r1a": 6
  },
  {
    "l": 35,
    "req": 11000,
    "r1t": "1★ Powerup",
    "r1a": 5,
    "r2t": "3★ Powerup",
    "r2a": 3,
    "ul": "3★ Powerup Unlock"
  },
  {
    "l": 36,
    "req": 12000,
    "r1t": "Pro Chest",
    "r1a": 1,
    "r2t": "Gold",
    "r2a": 1500
  },
  {
    "l": 37,
    "req": 13000,
    "r1t": "Gold",
    "r1a": 1100
  },
  {
    "l": 38,
    "req": 14000,
    "r1t": "1★ Powerup",
    "r1a": 5
  },
  {
    "l": 39,
    "req": 15000,
    "r1t": "Diamonds",
    "r1a": 10,
    "r2t": "Gold",
    "r2a": 1300
  },
  {
    "l": 40,
    "req": 17000,
    "r1t": "3★ Powerup",
    "r1a": 3,
    "r2t": "1★ Powerup",
    "r2a": 5,
    "ul": "1★ Powerup Unlock"
  },
  {
    "l": 41,
    "req": 19000,
    "r1t": "Champion Chest",
    "r1a": 1
  },
  {
    "l": 42,
    "req": 20000,
    "r1t": "2★ Powerup",
    "r1a": 3,
    "r2t": "Gold",
    "r2a": 1500
  },
  {
    "l": 43,
    "req": 22500,
    "r1t": "3★ Powerup",
    "r1a": 3
  },
  {
    "l": 44,
    "req": 25000,
    "r1t": "Diamonds",
    "r1a": 10,
    "r2t": "2★ Powerup",
    "r2a": 3,
    "ul": "2★ Powerup Unlock"
  },
  {
    "l": 45,
    "req": 26000,
    "r1t": "Gold",
    "r1a": 1300
  },
  {
    "l": 46,
    "req": 26000,
    "r1t": "Champion Chest",
    "r1a": 1
  },
  {
    "l": 47,
    "req": 27000,
    "r1t": "2★ Powerup",
    "r1a": 3
  },
  {
    "l": 48,
    "req": 28000,
    "r1t": "1★ Powerup",
    "r1a": 5,
    "r2t": "Gold",
    "r2a": 1700
  },
  {
    "l": 49,
    "req": 29000,
    "r1t": "Diamonds",
    "r1a": 15,
    "r2t": "3★ Powerup",
    "r2a": 3,
    "ul": "3★ Powerup Unlock"
  },
  {
    "l": 50,
    "req": 30000,
    "r1t": "3★ Powerup",
    "r1a": 3
  }
];

// 3. CUP ROAD DATA (UPDATED)
var cupRoadData = [
  {
    "cup": 0,
    "r1": "Arena 1 Unlock",
    "a1": "-",
    "feat": "Bucket 1",
    "arena": "Arena 1"
  },
  {
    "cup": 50,
    "r1": "Gold",
    "a1": 200
  },
  {
    "cup": 100,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 150,
    "r1": "Rookie Card",
    "a1": 80
  },
  {
    "cup": 200,
    "r1": "Gold",
    "a1": 300
  },
  {
    "cup": 250,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 300,
    "r1": "Arena 2 Unlock",
    "a1": "-",
    "feat": "Bucket 2",
    "arena": "Arena 2"
  },
  {
    "cup": 350,
    "r1": "Rookie Card",
    "a1": 100
  },
  {
    "cup": 400,
    "r1": "Gold",
    "a1": 400
  },
  {
    "cup": 450,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 500,
    "r1": "Pro Card",
    "a1": 20
  },
  {
    "cup": 560,
    "r1": "Gold",
    "a1": 500
  },
  {
    "cup": 620,
    "r1": "Arena 3 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 300,
    "arena": "Arena 3"
  },
  {
    "cup": 680,
    "r1": "Diamonds",
    "a1": 5
  },
  {
    "cup": 740,
    "r1": "Rookie Card",
    "a1": 120
  },
  {
    "cup": 800,
    "r1": "Gold",
    "a1": 600
  },
  {
    "cup": 870,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 940,
    "r1": "Pro Card",
    "a1": 20
  },
  {
    "cup": 1010,
    "r1": "Gold",
    "a1": 700
  },
  {
    "cup": 1080,
    "r1": "Arena 4 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 500,
    "arena": "Arena 4"
  },
  {
    "cup": 1150,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 1230,
    "r1": "Rookie Card",
    "a1": 140
  },
  {
    "cup": 1310,
    "r1": "Gold",
    "a1": 800
  },
  {
    "cup": 1390,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 1470,
    "r1": "Rookie Card",
    "a1": 80
  },
  {
    "cup": 1550,
    "r1": "Arena 5 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 700,
    "arena": "Arena 5"
  },
  {
    "cup": 1640,
    "r1": "Gold",
    "a1": 900
  },
  {
    "cup": 1730,
    "r1": "Diamonds",
    "a1": 5
  },
  {
    "cup": 1820,
    "r1": "Pro Card",
    "a1": 30
  },
  {
    "cup": 1910,
    "r1": "Gold",
    "a1": 1000
  },
  {
    "cup": 2000,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 2100,
    "r1": "Arena 6 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 900,
    "arena": "Arena 6"
  },
  {
    "cup": 2200,
    "r1": "Gold",
    "a1": 1100
  },
  {
    "cup": 2300,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 2400,
    "r1": "Pro Card",
    "a1": 30
  },
  {
    "cup": 2500,
    "r1": "Gold",
    "a1": 1200
  },
  {
    "cup": 2610,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 2720,
    "r1": "Arena 7 Unlock",
    "a1": "-",
    "feat": "Bucket 3",
    "arena": "Arena 7"
  },
  {
    "cup": 2830,
    "r1": "Rookie Card",
    "a1": 160
  },
  {
    "cup": 2940,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 3050,
    "r1": "Diamonds",
    "a1": 10
  },
  {
    "cup": 3170,
    "r1": "Rookie Card",
    "a1": 180
  },
  {
    "cup": 3290,
    "r1": "Gold",
    "a1": 1300
  },
  {
    "cup": 3410,
    "r1": "Arena 8 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 1100,
    "arena": "Arena 8"
  },
  {
    "cup": 3530,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 3650,
    "r1": "Gold",
    "a1": 1400
  },
  {
    "cup": 3780,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 3910,
    "r1": "Champion Card",
    "a1": 12
  },
  {
    "cup": 4040,
    "r1": "Gold",
    "a1": 1500
  },
  {
    "cup": 4170,
    "r1": "Arena 9 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 1300,
    "arena": "Arena 9"
  },
  {
    "cup": 4300,
    "r1": "Diamonds",
    "a1": 10
  },
  {
    "cup": 4450,
    "r1": "Pro Card",
    "a1": 40,
    "r2": "Champion Chest",
    "a2": 1
  },
  {
    "cup": 4600,
    "r1": "Gold",
    "a1": 1600
  },
  {
    "cup": 4750,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 4900,
    "r1": "Champion Card",
    "a1": 12
  },
  {
    "cup": 5050,
    "r1": "Gold",
    "a1": 1700
  },
  {
    "cup": 5220,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 5390,
    "r1": "Arena 10 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 1500,
    "arena": "Arena 10"
  },
  {
    "cup": 5560,
    "r1": "Gold",
    "a1": 1800,
    "r2": "Champion Chest",
    "a2": 1
  },
  {
    "cup": 5730,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 5900,
    "r1": "Pro Card",
    "a1": 40
  },
  {
    "cup": 6090,
    "r1": "Gold",
    "a1": 1900
  },
  {
    "cup": 6280,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 6470,
    "r1": "Champion Card",
    "a1": 16
  },
  {
    "cup": 6660,
    "r1": "Arena 11 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 1700,
    "arena": "Arena 11"
  },
  {
    "cup": 6850,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 7060,
    "r1": "Diamonds",
    "a1": 10,
    "r2": "Champion Chest",
    "a2": 1
  },
  {
    "cup": 7270,
    "r1": "Pro Card",
    "a1": 40
  },
  {
    "cup": 7480,
    "r1": "Gold",
    "a1": 2000
  },
  {
    "cup": 7690,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 7900,
    "r1": "Gold",
    "a1": 2200
  },
  {
    "cup": 8130,
    "r1": "Arena 12 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 1900,
    "arena": "Arena 12"
  },
  {
    "cup": 8360,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 8590,
    "r1": "Pro Card",
    "a1": 40
  },
  {
    "cup": 8820,
    "r1": "Gold",
    "a1": 2400,
    "r2": "Champion Chest",
    "a2": 1
  },
  {
    "cup": 9050,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 9300,
    "r1": "Champion Card",
    "a1": 16
  }
];
