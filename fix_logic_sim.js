const fs = require('fs');

let code = fs.readFileSync('c:/Users/atlas/Desktop/test/logic_sim.js', 'utf8');
const EOL = code.includes('\r\n') ? '\r\n' : '\n';

// The real openChest ends right before checkLevelUp
const checkLevelUpIndex = code.indexOf('    const checkLevelUp = () => {');
if (checkLevelUpIndex === -1) throw new Error("Could not find checkLevelUp");

// We know the real one starts with "const openChest = (type, source) => {"
const searchStr = "    const openChest = (type, source) => {";
const realOpenChestStart = code.lastIndexOf(searchStr, checkLevelUpIndex);
if (realOpenChestStart === -1) throw new Error("Could not find real openChest start");

// The real function ends right before checkLevelUp
const realOpenChestEnd = checkLevelUpIndex;
const realOpenChestCode = code.substring(realOpenChestStart, realOpenChestEnd);

// Remove the real one from its original spot down below
code = code.substring(0, realOpenChestStart) + code.substring(realOpenChestEnd);

// Now find the fake one added at the top
const fakeOpenChestStart = code.indexOf(searchStr);

if (fakeOpenChestStart !== -1) {
    // Find where the fake one ends. It ends right before "    addLog("TUTORIAL"..."
    const fakeOpenChestEndStr = '    addLog("TUTORIAL", "Tutorial Reward", "Scripted Chest Reward");';
    const fakeOpenChestEnd = code.indexOf(fakeOpenChestEndStr);

    if (fakeOpenChestEnd !== -1) {
        // Replace the fake one with the real one
        code = code.substring(0, fakeOpenChestStart) + realOpenChestCode + code.substring(fakeOpenChestEnd);
    } else {
        throw new Error("Could not find fake openChest end");
    }
} else {
    // Just insert it
    const insertTarget = '    addLog("TUTORIAL", "Tutorial Reward", "Scripted Chest Reward");';
    const insertPos = code.indexOf(insertTarget);
    if (insertPos !== -1) {
        code = code.substring(0, insertPos) + realOpenChestCode + code.substring(insertPos);
    } else {
        throw new Error("Could not find insert target");
    }
}

fs.writeFileSync('c:/Users/atlas/Desktop/test/logic_sim.js', code, 'utf8');
console.log("Successfully fixed openChest placement");
