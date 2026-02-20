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
    "r1t": "Scripted Chest",
    "r1a": 1
  },
  {
    "l": 3,
    "req": 50,
    "r1t": "1★ Powerup",
    "r1a": 1
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
    "r1a": 100,
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
    "r1a": 3
  },
  {
    "l": 8,
    "req": 125,
    "r1t": "Gold",
    "r1a": 100,
    "r2t": "2★ Powerup",
    "r2a": 3,
    "ul": "2★ Powerup Unlock"
  },
  {
    "l": 9,
    "req": 130,
    "r1t": "Rookie Chest",
    "r1a": 1
  },
  {
    "l": 10,
    "req": 145,
    "r1t": "Gold",
    "r1a": 150
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
    "req": 220,
    "r1t": "Gold",
    "r1a": 200
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
    "r1a": 3,
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
    "r2a": 250
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
    "r1a": 300,
    "r2t": "1★ Powerup",
    "r2a": 5,
    "ul": "1★ Powerup Unlock"
  },
  {
    "l": 19,
    "req": 800,
    "r1t": "Pro Chest",
    "r1a": 1
  },
  {
    "l": 20,
    "req": 1200,
    "r1t": "Diamonds",
    "r1a": 5
  },
  {
    "l": 21,
    "req": 1400,
    "r1t": "Pro Chest",
    "r1a": 1,
    "r2t": "Gold",
    "r2a": 350
  },
  {
    "l": 22,
    "req": 1600,
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
    "r1a": 350
  },
  {
    "l": 24,
    "req": 2300,
    "r1t": "Diamonds",
    "r1a": 4,
    "r2t": "Gold",
    "r2a": 400
  },
  {
    "l": 25,
    "req": 2700,
    "r1t": "1★ Powerup",
    "r1a": 3
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
    "req": 4000,
    "r1t": "2★ Powerup",
    "r1a": 3,
    "r2t": "Gold",
    "r2a": 450
  },
  {
    "l": 28,
    "req": 4600,
    "r1t": "1★ Powerup",
    "r1a": 3
  },
  {
    "l": 29,
    "req": 5400,
    "r1t": "Diamonds",
    "r1a": 5
  },
  {
    "l": 30,
    "req": 6000,
    "r1t": "1★ Powerup",
    "r1a": 3,
    "r2t": "Gold",
    "r2a": 500
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
    "r1a": 3,
    "r2t": "Gold",
    "r2a": 550
  },
  {
    "l": 34,
    "req": 11000,
    "r1t": "Diamonds",
    "r1a": 6
  },
  {
    "l": 35,
    "req": 12500,
    "r1t": "1★ Powerup",
    "r1a": 3,
    "r2t": "3★ Powerup",
    "r2a": 2,
    "ul": "3★ Powerup Unlock"
  },
  {
    "l": 36,
    "req": 12500,
    "r1t": "Pro Chest",
    "r1a": 1,
    "r2t": "Gold",
    "r2a": 600
  },
  {
    "l": 37,
    "req": 12500,
    "r1t": "Gold",
    "r1a": 600
  },
  {
    "l": 38,
    "req": 12500,
    "r1t": "1★ Powerup",
    "r1a": 3
  },
  {
    "l": 39,
    "req": 15000,
    "r1t": "Diamonds",
    "r1a": 10,
    "r2t": "Gold",
    "r2a": 650
  },
  {
    "l": 40,
    "req": 18000,
    "r1t": "1★ Powerup",
    "r1a": 3,
    "r2t": "1★ Powerup",
    "r2a": 5,
    "ul": "1★ Powerup Unlock"
  },
  {
    "l": 41,
    "req": 22000,
    "r1t": "Champion Chest",
    "r1a": 1
  },
  {
    "l": 42,
    "req": 25000,
    "r1t": "2★ Powerup",
    "r1a": 2,
    "r2t": "Gold",
    "r2a": 700
  },
  {
    "l": 43,
    "req": 25000,
    "r1t": "1★ Powerup",
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
    "req": 25000,
    "r1t": "Gold",
    "r1a": 700
  },
  {
    "l": 46,
    "req": 25000,
    "r1t": "Champion Chest",
    "r1a": 1
  },
  {
    "l": 47,
    "req": 25000,
    "r1t": "2★ Powerup",
    "r1a": 3
  },
  {
    "l": 48,
    "req": 25000,
    "r1t": "1★ Powerup",
    "r1a": 3,
    "r2t": "Gold",
    "r2a": 800
  },
  {
    "l": 49,
    "req": 25000,
    "r1t": "Diamonds",
    "r1a": 15,
    "r2t": "3★ Powerup",
    "r2a": 2,
    "ul": "3★ Powerup Unlock"
  },
  {
    "l": 50,
    "req": 25000,
    "r1t": "2★ Powerup",
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
    "a1": 100
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
    "a1": 150
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
    "a1": 200
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
    "cup": 550,
    "r1": "Gold",
    "a1": 200
  },
  {
    "cup": 600,
    "r1": "Arena 3 Unlock",
    "a1": "-",
    "feat": "",
    "r2": "Gold",
    "a2": 200,
    "arena": "Arena 3"
  },
  {
    "cup": 650,
    "r1": "Diamonds",
    "a1": 5
  },
  {
    "cup": 700,
    "r1": "Rookie Card",
    "a1": 120
  },
  {
    "cup": 750,
    "r1": "Gold",
    "a1": 250
  },
  {
    "cup": 800,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 850,
    "r1": "Pro Card",
    "a1": 20
  },
  {
    "cup": 900,
    "r1": "Gold",
    "a1": 300
  },
  {
    "cup": 950,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 1000,
    "r1": "Arena 4 Unlock",
    "a1": "-",
    "feat": "",
    "r2": "Gold",
    "a2": 300,
    "arena": "Arena 4"
  },
  {
    "cup": 1050,
    "r1": "Rookie Card",
    "a1": 140
  },
  {
    "cup": 1100,
    "r1": "Gold",
    "a1": 350
  },
  {
    "cup": 1150,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 1200,
    "r1": "Rookie Card",
    "a1": 80
  },
  {
    "cup": 1250,
    "r1": "Gold",
    "a1": 400
  },
  {
    "cup": 1300,
    "r1": "Arena 5 Unlock",
    "a1": "-",
    "feat": "",
    "r2": "Gold",
    "a2": 400,
    "arena": "Arena 5"
  },
  {
    "cup": 1350,
    "r1": "Diamonds",
    "a1": 5
  },
  {
    "cup": 1450,
    "r1": "Pro Card",
    "a1": 30
  },
  {
    "cup": 1500,
    "r1": "Gold",
    "a1": 450
  },
  {
    "cup": 1550,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 1600,
    "r1": "Arena 6 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 500,
    "arena": "Arena 6"
  },
  {
    "cup": 1650,
    "r1": "Gold",
    "a1": 500
  },
  {
    "cup": 1700,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 1750,
    "r1": "Pro Card",
    "a1": 30
  },
  {
    "cup": 1800,
    "r1": "Gold",
    "a1": 550
  },
  {
    "cup": 1900,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 1950,
    "r1": "Rookie Card",
    "a1": 160
  },
  {
    "cup": 2000,
    "r1": "Arena 7 Unlock",
    "a1": "-",
    "feat": "Bucket 3",
    "arena": "Arena 7"
  },
  {
    "cup": 2050,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 2100,
    "r1": "Diamonds",
    "a1": 10
  },
  {
    "cup": 2150,
    "r1": "Rookie Card",
    "a1": 180
  },
  {
    "cup": 2200,
    "r1": "Gold",
    "a1": 650
  },
  {
    "cup": 2250,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 2300,
    "r1": "Arena 8 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 600,
    "arena": "Arena 8"
  },
  {
    "cup": 2350,
    "r1": "Gold",
    "a1": 700
  },
  {
    "cup": 2450,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 2500,
    "r1": "Champion Card",
    "a1": 12
  },
  {
    "cup": 2550,
    "r1": "Gold",
    "a1": 750
  },
  {
    "cup": 2600,
    "r1": "Arena 9 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 700,
    "arena": "Arena 9"
  },
  {
    "cup": 2650,
    "r1": "Diamonds",
    "a1": 10
  },
  {
    "cup": 2700,
    "r1": "Pro Card",
    "a1": 40
  },
  {
    "cup": 2750,
    "r1": "Gold",
    "a1": 800
  },
  {
    "cup": 2800,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 2850,
    "r1": "Champion Card",
    "a1": 12
  },
  {
    "cup": 2900,
    "r1": "Gold",
    "a1": 850
  },
  {
    "cup": 2950,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 3000,
    "r1": "Arena 10 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 800,
    "arena": "Arena 10"
  },
  {
    "cup": 3050,
    "r1": "Gold",
    "a1": 900
  },
  {
    "cup": 3150,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 3200,
    "r1": "Pro Card",
    "a1": 40
  },
  {
    "cup": 3250,
    "r1": "Gold",
    "a1": 950
  },
  {
    "cup": 3300,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 3350,
    "r1": "Champion Card",
    "a1": 16
  },
  {
    "cup": 3400,
    "r1": "Arena 11 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 900,
    "arena": "Arena 11"
  },
  {
    "cup": 3450,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 3500,
    "r1": "Diamonds",
    "a1": 10
  },
  {
    "cup": 3550,
    "r1": "Pro Card",
    "a1": 40
  },
  {
    "cup": 3600,
    "r1": "Gold",
    "a1": 900
  },
  {
    "cup": 3650,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 3800,
    "r1": "Arena 12 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 1000,
    "arena": "Arena 12"
  },
  {
    "cup": 3850,
    "r1": "Gold",
    "a1": 1200
  },
  {
    "cup": 3900,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 3950,
    "r1": "Champion Card",
    "a1": 16
  },
  {
    "cup": 4050,
    "r1": "Gold",
    "a1": 1600
  },
  {
    "cup": 4100,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 4150,
    "r1": "Legendary Card",
    "a1": 1
  },
  {
    "cup": 4200,
    "r1": "Arena 13 Unlock",
    "a1": "-",
    "feat": "Bucket 4",
    "arena": "Arena 13"
  },
  {
    "cup": 4250,
    "r1": "Diamonds",
    "a1": 10
  },
  {
    "cup": 4300,
    "r1": "Champion Card",
    "a1": 16
  },
  {
    "cup": 4350,
    "r1": "Gold",
    "a1": 1600
  },
  {
    "cup": 4450,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 4500,
    "r1": "Pro Card",
    "a1": 60
  },
  {
    "cup": 4550,
    "r1": "Gold",
    "a1": 2000
  },
  {
    "cup": 4600,
    "r1": "Arena 14 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 600,
    "arena": "Arena 14"
  },
  {
    "cup": 4650,
    "r1": "Diamonds",
    "a1": 20
  },
  {
    "cup": 4750,
    "r1": "Champion Card",
    "a1": 20
  },
  {
    "cup": 4850,
    "r1": "Gold",
    "a1": 2100
  },
  {
    "cup": 4950,
    "r1": "Champion Card",
    "a1": 20
  },
  {
    "cup": 5000,
    "r1": "Arena 15 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 700,
    "arena": "Arena 15"
  },
  {
    "cup": 5050,
    "r1": "Gold",
    "a1": 2200
  },
  {
    "cup": 5100,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 5150,
    "r1": "Pro Card",
    "a1": 60
  },
  {
    "cup": 5200,
    "r1": "Gold",
    "a1": 2300
  },
  {
    "cup": 5250,
    "r1": "Rookie Chest",
    "a1": 1
  },
  {
    "cup": 5300,
    "r1": "Legendary Card",
    "a1": 2
  },
  {
    "cup": 5350,
    "r1": "Gold",
    "a1": 2400
  },
  {
    "cup": 5400,
    "r1": "Rookie Chest",
    "a1": 1,
    "r2": "Gold",
    "a2": 800,
    "arena": "Arena 16"
  },
  {
    "cup": 5450,
    "r1": "Legendary Card",
    "a1": 2
  },
  {
    "cup": 5500,
    "r1": "Gold",
    "a1": 2500
  },
  {
    "cup": 5550,
    "r1": "Diamonds",
    "a1": 10
  },
  {
    "cup": 5600,
    "r1": "Legendary Card",
    "a1": 2
  },
  {
    "cup": 5650,
    "r1": "Gold",
    "a1": 2600
  },
  {
    "cup": 5700,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 5750,
    "r1": "Champion Card",
    "a1": 20
  },
  {
    "cup": 5800,
    "r1": "Arena 17 Unlock",
    "a1": "-",
    "feat": "Bucket 5",
    "arena": "Arena 17"
  },
  {
    "cup": 5850,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 5900,
    "r1": "Legendary Card",
    "a1": 2
  },
  {
    "cup": 5950,
    "r1": "Gold",
    "a1": 3000
  },
  {
    "cup": 6050,
    "r1": "Diamonds",
    "a1": 20
  },
  {
    "cup": 6100,
    "r1": "Pro Card",
    "a1": 50
  },
  {
    "cup": 6150,
    "r1": "Gold",
    "a1": 3100
  },
  {
    "cup": 6200,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 6250,
    "r1": "Arena 18 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 900,
    "arena": "Arena 18"
  },
  {
    "cup": 6300,
    "r1": "Gold",
    "a1": 3200
  },
  {
    "cup": 6350,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 6400,
    "r1": "Legendary Card",
    "a1": 2
  },
  {
    "cup": 6450,
    "r1": "Gold",
    "a1": 3500
  },
  {
    "cup": 6500,
    "r1": "Pro Chest",
    "a1": 1
  },
  {
    "cup": 6550,
    "r1": "Champion Card",
    "a1": 20
  },
  {
    "cup": 6700,
    "r1": "Gold",
    "a1": 3600
  },
  {
    "cup": 6750,
    "r1": "Arena 19 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 1000,
    "arena": "Arena 19"
  },
  {
    "cup": 6800,
    "r1": "Champion Chest",
    "a1": 1
  },
  {
    "cup": 6850,
    "r1": "Legendary Card",
    "a1": 2
  },
  {
    "cup": 6950,
    "r1": "Gold",
    "a1": 3700
  },
  {
    "cup": 7000,
    "r1": "Champion Chest",
    "a1": 1
  },
  {
    "cup": 7050,
    "r1": "Legendary Card",
    "a1": 2
  },
  {
    "cup": 7100,
    "r1": "Gold",
    "a1": 3800
  },
  {
    "cup": 7150,
    "r1": "Diamonds",
    "a1": 20
  },
  {
    "cup": 7200,
    "r1": "Champion Card",
    "a1": 20,
    "r2": "Gold",
    "a2": 600,
    "arena": "Arena 20"
  },
  {
    "cup": 7250,
    "r1": "Gold",
    "a1": 2400
  },
  {
    "cup": 7350,
    "r1": "Champion Chest",
    "a1": 1
  },
  {
    "cup": 7400,
    "r1": "Legendary Card",
    "a1": 2
  },
  {
    "cup": 7450,
    "r1": "Gold",
    "a1": 2500
  },
  {
    "cup": 7500,
    "r1": "Diamonds",
    "a1": 10
  },
  {
    "cup": 7550,
    "r1": "Legendary Card",
    "a1": 4
  },
  {
    "cup": 7650,
    "r1": "Gold",
    "a1": 2600
  },
  {
    "cup": 7750,
    "r1": "Arena 21 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 700,
    "arena": "Arena 21"
  },
  {
    "cup": 7850,
    "r1": "Legendary Card",
    "a1": 4
  },
  {
    "cup": 7900,
    "r1": "Gold",
    "a1": 2700
  },
  {
    "cup": 7950,
    "r1": "Champion Chest",
    "a1": 1
  },
  {
    "cup": 8000,
    "r1": "Legendary Card",
    "a1": 4
  },
  {
    "cup": 8050,
    "r1": "Gold",
    "a1": 3200
  },
  {
    "cup": 8100,
    "r1": "Champion Chest",
    "a1": 1
  },
  {
    "cup": 8150,
    "r1": "Diamonds",
    "a1": 10
  },
  {
    "cup": 8200,
    "r1": "Arena 22 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 800,
    "arena": "Arena 22"
  },
  {
    "cup": 8250,
    "r1": "Gold",
    "a1": 4200
  },
  {
    "cup": 8300,
    "r1": "Diamonds",
    "a1": 20
  },
  {
    "cup": 8350,
    "r1": "Legendary Card",
    "a1": 4
  },
  {
    "cup": 8400,
    "r1": "Gold",
    "a1": 4200
  },
  {
    "cup": 8450,
    "r1": "Champion Chest",
    "a1": 1
  },
  {
    "cup": 8500,
    "r1": "Legendary Card",
    "a1": 4
  },
  {
    "cup": 8550,
    "r1": "Gold",
    "a1": 4200
  },
  {
    "cup": 8600,
    "r1": "Arena 23 Unlock",
    "a1": "-",
    "r2": "Gold",
    "a2": 900,
    "arena": "Arena 23"
  },
  {
    "cup": 8650,
    "r1": "Legendary Card",
    "a1": 6
  },
  {
    "cup": 8700,
    "r1": "Gold",
    "a1": 4200
  },
  {
    "cup": 8850,
    "r1": "Legendary Chest",
    "a1": 1
  },
  {
    "cup": 8900,
    "r1": "Legendary Card",
    "a1": 6
  },
  {
    "cup": 8950,
    "r1": "Gold",
    "a1": 4800
  },
  {
    "cup": 9000,
    "r1": "Legendary Card",
    "a1": 6
  },
  {
    "cup": 9100,
    "r1": "Gold",
    "a1": 5400
  },
  {
    "cup": 9150,
    "r1": "Legendary Chest",
    "a1": 1
  },
  {
    "cup": 9200,
    "r1": "Champion Chest",
    "a1": 1
  },
  {
    "cup": 9250,
    "r1": "Diamonds",
    "a1": 20
  },
  {
    "cup": 9300,
    "r1": "Gold",
    "a1": 6000
  },
  {
    "cup": 9400,
    "r1": "Legendary Chest",
    "a1": 1
  },
  {
    "cup": 9450,
    "r1": "Legendary Card",
    "a1": 6
  },
  {
    "cup": 9500,
    "r1": "Gold",
    "a1": 6600
  }
];
