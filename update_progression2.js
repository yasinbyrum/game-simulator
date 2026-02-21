const fs = require('fs');
const path = require('path');

const rawText = `0	Bucket 1 Unlock	-			Bucket 1	Arena 1
50	SC	200				
100	Rookie Chest	1				
150	Rookie Card	80				
200	SC	300				
250	Rookie Chest	1				
300	Arena 2 Unlock	-			Bucket 2	Arena 2
350	Rookie Card	100				
400	SC	400				
450	Rookie Chest	1				
500	Pro Card	20				
560	SC	500				
620	Arena 3 Unlock	-	SC	300		Arena 3
680	HC	5				
740	Rookie Card	120				
800	SC	600				
870	Rookie Chest	1				
940	Pro Card	20				
1010	SC	700				
1080	Arena 4 Unlock	-	SC	500		Arena 4
1150	Rookie Chest	1				
1230	Rookie Card	140				
1310	SC	800				
1390	Rookie Chest	1				
1470	Rookie Card	80				
1550	Arena 5 Unlock	-	SC	700		Arena 5
1640	SC	900				
1730	HC	5				
1820	Pro Card	30				
1910	SC	1000				
2000	Rookie Chest	1				
2100	Arena 6 Unlock	-	SC	900		Arena 6
2200	SC	1100				
2300	Pro Chest	1				
2400	Pro Card	30				
2500	SC	1200				
2610	Rookie Chest	1				
2720	Arena 7 Unlock	-			Bucket 3	Arena 7
2830	Rookie Card	160				
2940	Pro Chest	1				
3050	HC	10				
3170	Rookie Card	180				
3290	SC	1300				
3410	Arena 8 Unlock	-	SC	1100		Arena 8
3530	Rookie Chest	1				
3650	SC	1400				
3780	Pro Chest	1				
3910	Champion Card	12				
4040	SC	1500				
4170	Arena 9 Unlock	-	SC	1300		Arena 9
4300	HC	10				
4450	Pro Card	40	Champion Chest	1		
4600	SC	1600				
4750	Rookie Chest	1				
4900	Champion Card	12				
5050	SC	1700				
5220	Pro Chest	1				
5390	Arena 10 Unlock	-	SC	1500		Arena 10
5560	SC	1800	Champion Chest	1		
5730	Pro Chest	1				
5900	Pro Card	40				
6090	SC	1900				
6280	Pro Chest	1				
6470	Champion Card	16				
6660	Arena 11 Unlock	-	SC	1700		Arena 11
6850	Pro Chest	1				
7060	HC	10	Champion Chest	1		
7270	Pro Card	40				
7480	SC	2000				
7690	Rookie Chest	1				
7900	SC	2200				
8130	Arena 12 Unlock	-	SC	1900		Arena 12
8360	Pro Chest	1				
8590	Pro Card	40				
8820	SC	2400	Champion Chest	1		
9050	Rookie Chest	1				
9300	Champion Card	16`;

let result = [];
let lines = rawText.split('\n');

for (let line of lines) {
    if (!line.trim()) continue;
    let parts = line.split('\t');

    let obj = { cup: parseInt(parts[0]) };

    // Reward 1
    let r1 = parts[1];
    if (r1 === 'SC') r1 = 'Gold';
    if (r1 === 'HC') r1 = 'Diamonds';
    if (r1 && r1.trim() !== '') {
        // Special case for Arena Unlocks which are written as "Bucket x Unlock" or "Arena x Unlock"
        if (r1.includes('Unlock')) {
            // Find arena from parts
            let arena = parts[6] ? parts[6].trim() : '';
            if (arena) r1 = arena + " Unlock";
        }
        obj.r1 = r1;
    }

    // Amount 1
    let a1 = parts[2];
    if (a1 && a1.trim() !== '') {
        if (a1 === '-') {
            obj.a1 = '-';
        } else {
            obj.a1 = parseInt(a1);
        }
    }

    // Reward 2
    let r2 = parts[3];
    if (r2 === 'SC') r2 = 'Gold';
    if (r2 === 'HC') r2 = 'Diamonds';
    if (r2 && r2.trim() !== '') {
        obj.r2 = r2;
    }

    // Amount 2
    let a2 = parts[4];
    if (a2 && a2.trim() !== '') {
        obj.a2 = parseInt(a2);
    }

    // Feature
    let feat = parts[5];
    if (feat && feat.trim() !== '') {
        obj.feat = feat.trim();
    }

    // Arena Unlock (handled above for r1, but can also exist as a key)
    let arena = parts[6];
    if (arena && arena.trim() !== '') {
        obj.arena = arena.trim();
    }

    result.push(obj);
}

const targetFile = 'c:/Users/atlas/Desktop/test/data_ducky_progression.js';
let content = fs.readFileSync(targetFile, 'utf8');

const regex = /(var cupRoadData = )\[[\s\S]*?\];/m;
if (regex.test(content)) {
    const updatedContent = content.replace(regex, `$1${JSON.stringify(result, null, 2)};`);
    fs.writeFileSync(targetFile, updatedContent, 'utf8');

    // Double check it worked
    let check = fs.readFileSync(targetFile, 'utf8');
    if (check.includes('"cup": 9300')) {
        console.log('Update successful');
    }
} else {
    console.log('regex mismatch');
}
