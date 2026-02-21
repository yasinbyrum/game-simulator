const fs = require('fs');

const rawText = `2	20	SC	100			
3	50	PowerUp1	5			
4	50	Rookie Chest	1			
5	50	SC	200	PowerUp1	5	PowerUp1 Unlock
6	80	Rookie Chest	1			
7	120	PowerUp1	5			
8	150	SC	300	PowerUp2	3	Power Up2 Unlock
9	150	Rookie Chest	1			
10	200	SC	400			
11	200	Rookie Chest	1	PowerUp1	5	PowerUp1 Unlock
12	240	SC	500			
13	280	Rookie Chest	1			
14	300	PowerUp1	5	PowerUp2	3	Power Up2 Unlock
15	350	HC	10	SC	300	
16	450	Rookie Chest	1			
17	550	HC	5			
18	650	SC	600	PowerUp1	5	PowerUp1 Unlock
19	750	Pro Chest	1			
20	1.000	HC	5			
21	1.250	Pro Chest	1	SC	500	
22	1.500	PowerUp2	3	PowerUp2	3	Power Up2 Unlock
23	2.000	SC	700			
24	2.200	HC	5	SC	700	
25	2.500	PowerUp1	5			
26	3.000	Pro Chest	1	PowerUp1	5	PowerUp1 Unlock
27	3.500	PowerUp2	3	SC	900	
28	4.100	PowerUp1	5			
29	5.000	HC	5			
30	6.000	PowerUp1	5	SC	1.100	
31	7.000	Pro Chest	1	PowerUp2	3	Power Up2 Unlock
32	8.000	PowerUp2	3			
33	9.000	PowerUp1	5	SC	1.300	
34	10.000	HC	6			
35	11.000	PowerUp1	5	PowerUp3	3	PowerUp3 Unlock
36	12.000	Pro Chest	1	SC	1.500	
37	13.000	SC	1.100			
38	14.000	PowerUp1	5			
39	15.000	HC	10	SC	1.300	
40	17.000	PowerUp3	3	PowerUp1	5	PowerUp1 Unlock
41	19.000	Champion Chest	1			
42	20.000	PowerUp2	3	SC	1.500	
43	22.500	PowerUp3	3			
44	25.000	HC	10	PowerUp2	3	Power Up2 Unlock
45	26.000	SC	1.300			
46	26.000	Champion Chest	1			
47	27.000	PowerUp2	3			
48	28.000	PowerUp1	5	SC	1.700	
49	29.000	HC	15	PowerUp3	3	PowerUp3 Unlock
50	30.000	PowerUp3	3			`;

function parseReward(r) {
    if (!r) return null;
    let text = r.trim();
    if (text === 'SC') return 'Gold';
    if (text === 'HC') return 'Diamonds';
    if (text === 'PowerUp1') return '1★ Powerup';
    if (text === 'PowerUp2') return '2★ Powerup';
    if (text === 'PowerUp3') return '3★ Powerup';
    return text;
}

function parseFeature(f) {
    if (!f) return null;
    let text = f.trim();
    if (text === 'PowerUp1 Unlock') return '1★ Powerup Unlock';
    if (text === 'Power Up2 Unlock' || text === 'PowerUp2 Unlock') return '2★ Powerup Unlock';
    if (text === 'PowerUp3 Unlock') return '3★ Powerup Unlock';
    return text;
}

let result = [{
    "l": 1,
    "req": 0
}];

let lines = rawText.split('\n');
for (let line of lines) {
    if (!line.trim()) continue;
    let parts = line.split('\t');

    let obj = {
        l: parseInt(parts[0].replace(/\./g, '')),
        req: parseInt(parts[1].replace(/\./g, ''))
    };

    let r1t = parseReward(parts[2]);
    let r1a = parts[3] ? parseInt(parts[3].replace(/\./g, '')) : NaN;
    if (r1t && !isNaN(r1a)) {
        obj.r1t = r1t;
        obj.r1a = r1a;
    }

    let r2t = parseReward(parts[4]);
    let r2a = parts[5] ? parseInt(parts[5].replace(/\./g, '')) : NaN;
    if (r2t && !isNaN(r2a)) {
        obj.r2t = r2t;
        obj.r2a = r2a;
    }

    let ul = parseFeature(parts[6]);
    if (ul) {
        obj.ul = ul;
    }

    result.push(obj);
}

const targetFile = 'c:/Users/atlas/Desktop/test/data_ducky_progression.js';
let content = fs.readFileSync(targetFile, 'utf8');

const regex = /(var levelData = )\[[\s\S]*?\];/m;
if (regex.test(content)) {
    const updatedContent = content.replace(regex, `$1${JSON.stringify(result, null, 2)};`);
    fs.writeFileSync(targetFile, updatedContent, 'utf8');
    console.log('Update successful');
} else {
    console.log('regex mismatch');
}
