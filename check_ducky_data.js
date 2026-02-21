var puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file:///' + 'c:/Users/atlas/Desktop/test/ducky.html');

    // wait for render
    await new Promise(r => setTimeout(r, 1000));

    const cupRoadCount = await page.evaluate(() => {
        return window.cupRoadData ? window.cupRoadData.length : -1;
    });

    const levelCount = await page.evaluate(() => {
        return window.levelData ? window.levelData.length : -1;
    });

    const level5 = await page.evaluate(() => {
        return window.levelData && window.levelData[4] ? JSON.stringify(window.levelData[4]) : "no";
    });

    console.log("Cup Road Count:", cupRoadCount);
    console.log("Level Count:", levelCount);
    console.log("Level 5 Data:", level5);

    await browser.close();
})();
