const fs = require('fs');
const path = require('path');

const dataStr = `1	Rookie	Axel	60	120	180	240	300	360	480	720	960	1.200	1.500
1	Rookie	Raven	60	120	180	240	300	360	480	720	960	1.200	1.500
1	Pro	James	80	160	240	320	400	480	640	960	1280	1600	2000
1	Pro	Bruce	80	160	240	320	400	480	640	960	1280	1600	2000
2	Rookie	Bucky	120	240	360	480	600	720	960	1440	1920	2400	3000
2	Rookie	Wilson	120	240	360	480	600	720	960	1440	1920	2400	3000
2	Rookie	Ivanna	120	240	360	480	600	720	960	1440	1920	2400	3000
2	Rookie	Bolshoi	120	240	360	480	600	720	960	1440	1920	2400	3000
2	Pro	Taiga	160	320	480	640	800	960	1280	1920	2560	3200	4000
2	Pro	Monk	160	320	480	640	800	960	1280	1920	2560	3200	4000
2	Pro	Gnoll	160	320	480	640	800	960	1280	1920	2560	3200	4000
2	Pro	Maximus	160	320	480	640	800	960	1280	1920	2560	3200	4000
3	Rookie	Thomas	180	360	540	720	900	1080	1440	2160	2880	3600	4500
3	Rookie	Spike 	180	360	540	720	900	1080	1440	2160	2880	3600	4500
3	Rookie	Mogadi 	180	360	540	720	900	1080	1440	2160	2880	3600	4500
3	Rookie	Hogmar	180	360	540	720	900	1080	1440	2160	2880	3600	4500
3	Pro	Camila	240	480	720	960	1200	1440	1920	2880	3840	4800	6000
3	Pro	Süleyman	240	480	720	960	1200	1440	1920	2880	3840	4800	6000
3	Pro	Hürrem	240	480	720	960	1200	1440	1920	2880	3840	4800	6000
3	Pro	Pedro	240	480	720	960	1200	1440	1920	2880	3840	4800	6000
3	Pro	Hiro	240	480	720	960	1200	1440	1920	2880	3840	4800	6000
3	Pro	Koushi	240	480	720	960	1200	1440	1920	2880	3840	4800	6000
3	Champion	Vlad	300	600	900	1200	1500	1800	2400	3600	4800	6000	7500
3	Champion	Scott	300	600	900	1200	1500	1800	2400	3600	4800	6000	7500`;

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
        let xpVals = cols.slice(3, 14).map(v => parseInt(v.replace(/\./g, ''), 10));
        
        if (progData[name] && progData[name]['x']) {
            progData[name]['x'] = [0, ...xpVals];
            console.log("Updated", name, progData[name]['x']);
        } else {
            console.log("Not found in progData:", name);
        }
    }
    
    const newJSON = JSON.stringify(progData, null, 2);
    fileContent = fileContent.substring(0, match.index) + "var charProgressionData = " + newJSON + ";" + fileContent.substring(match.index + match[0].length);
    
    fs.writeFileSync(targetFile, fileContent, 'utf8');
    console.log("Successfully updated data_ducky_assets.js");
} else {
    console.log("Could not find var charProgressionData in file.");
}
