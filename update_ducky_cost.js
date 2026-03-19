const fs = require('fs');
const path = require('path');

const dataStr = `1	Rookie	Axel	100	120	140	170	200	240	290	350	420	500	600
1	Rookie	Raven	100	120	140	170	200	240	290	350	420	500	600
1	Pro	James	150	200	250	300	350	400	500	600	700	850	1.000
1	Pro	Bruce	150	200	250	300	350	400	500	600	700	850	1.000
2	Rookie	Bucky	150	200	250	300	350	400	500	600	700	850	1.000
2	Rookie	Wilson	150	200	250	300	350	400	500	600	700	850	1.000
2	Rookie	Ivanna	150	200	250	300	350	400	500	600	700	850	1.000
2	Rookie	Bolshoi	150	200	250	300	350	400	500	600	700	850	1.000
2	Pro	Taiga	225	250	300	350	400	500	600	700	850	1.000	1.200
2	Pro	Monk	225	250	300	350	400	500	600	700	850	1.000	1.200
2	Pro	Gnoll	225	250	300	350	400	500	600	700	850	1.000	1.200
2	Pro	Maximus	225	250	300	350	400	500	600	700	850	1.000	1.200
3	Rookie	Thomas	300	350	400	500	600	700	850	1.000	1.200	1.450	1.750
3	Rookie	Spike 	300	350	400	500	600	700	850	1.000	1.200	1.450	1.750
3	Rookie	Mogadi 	300	350	400	500	600	700	850	1.000	1.200	1.450	1.750
3	Rookie	Hogmar	300	350	400	500	600	700	850	1.000	1.200	1.450	1.750
3	Pro	Süleyman	550	650	800	950	1.150	1.400	1.700	2.050	2.450	2.950	3.550
3	Pro	Hürrem	550	650	800	950	1.150	1.400	1.700	2.050	2.450	2.950	3.550
3	Pro	Camila	550	650	800	950	1.150	1.400	1.700	2.050	2.450	2.950	3.550
3	Pro	Pedro	550	650	800	950	1.150	1.400	1.700	2.050	2.450	2.950	3.550
3	Pro	Hiro	550	650	800	950	1.150	1.400	1.700	2.050	2.450	2.950	3.550
3	Pro	Koushi	550	650	800	950	1.150	1.400	1.700	2.050	2.450	2.950	3.550
3	Champion	Vlad	600	700	850	1.000	1.200	1.450	1.750	2.100	2.500	3.000	3.600
3	Champion	Scott	600	700	850	1.000	1.200	1.450	1.750	2.100	2.500	3.000	3.600`;

const targetFile = path.join(__dirname, 'data_ducky_assets.js');
let fileContent = fs.readFileSync(targetFile, 'utf8');

const regex = /var charProgressionData = (\{[\s\S]*?\});/m;
const match = fileContent.match(regex);
if (match) {
    let progData = JSON.parse(match[1]);
    
    let lines = dataStr.trim().split('\n');
    for (let line of lines) {
        let cols = line.trim().split(/\s+/);
        if (cols.length < 13) continue; // Bucket, Rarity, Name, + 11 levels
        let name = cols[2].trim();
        let costVals = cols.slice(3, 14).map(v => parseInt(v.replace(/\./g, ''), 10));
        
        if (progData[name] && progData[name]['g']) {
            progData[name]['g'] = [0, ...costVals];
            console.log("Updated Cost for", name, progData[name]['g']);
        } else {
            console.log("Not found in progData:", name);
        }
    }
    
    const newJSON = JSON.stringify(progData, null, 2);
    fileContent = fileContent.substring(0, match.index) + "var charProgressionData = " + newJSON + ";" + fileContent.substring(match.index + match[0].length);
    
    fs.writeFileSync(targetFile, fileContent, 'utf8');
    console.log("Successfully updated data_ducky_assets.js (Cost)");
} else {
    console.log("Could not find var charProgressionData in file.");
}
