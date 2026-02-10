// Script to update all card requirements to the new standard values
const fs = require('fs');
const path = require('path');

// New card requirements based on rarity
const newCardReqs = {
    'Rookie': [60, 90, 140, 220, 340, 530, 820, 1270, 1970, 3050, 4730, 7330],
    'Pro': [18, 30, 40, 60, 80, 110, 150, 210, 290, 410, 570, 800],
    'Champion': [13, 20, 30, 40, 50, 60, 80, 100, 130, 160, 200, 250],
    'Legendary': [5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 21, 24],
    'Exclusive': [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17]
};

// Character pool with name and rarity mapping
const charPoolData = [
    { b: 1, r: 'Rookie', n: 'Axel' },
    { b: 1, r: 'Rookie', n: 'Raven' },
    { b: 1, r: 'Pro', n: 'James' },
    { b: 1, r: 'Pro', n: 'Bruce' },
    { b: 2, r: 'Rookie', n: 'Bucky' },
    { b: 2, r: 'Rookie', n: 'Wilson' },
    { b: 2, r: 'Rookie', n: 'Ivanna' },
    { b: 2, r: 'Rookie', n: 'Bolshoi' },
    { b: 2, r: 'Pro', n: 'Taiga' },
    { b: 2, r: 'Pro', n: 'Monk' },
    { b: 2, r: 'Pro', n: 'Gnoll' },
    { b: 2, r: 'Pro', n: 'Maximus' },
    { b: 3, r: 'Rookie', n: 'Thomas' },
    { b: 3, r: 'Rookie', n: 'Spike' },
    { b: 3, r: 'Rookie', n: 'Mogadi' },
    { b: 3, r: 'Rookie', n: 'Hogmar' },
    { b: 3, r: 'Pro', n: 'Camila' },
    { b: 3, r: 'Pro', n: 'Pedro' },
    { b: 3, r: 'Pro', n: 'Süleyman' },
    { b: 3, r: 'Pro', n: 'Hürrem' },
    { b: 3, r: 'Pro', n: 'Hiro' },
    { b: 3, r: 'Pro', n: 'Koushi' },
    { b: 3, r: 'Champion', n: 'Scott' },
    { b: 3, r: 'Champion', n: 'Vlad' },
    { b: 4, r: 'Rookie', n: 'Zıpır' },
    { b: 4, r: 'Rookie', n: 'Dudu' },
    { b: 4, r: 'Pro', n: 'Bahlul' },
    { b: 4, r: 'Pro', n: 'Amir' },
    { b: 4, r: 'Pro', n: 'Barkley' },
    { b: 4, r: 'Pro', n: 'Felicia' },
    { b: 4, r: 'Champion', n: 'Antoine' },
    { b: 4, r: 'Champion', n: 'Marionette' },
    { b: 4, r: 'Champion', n: 'Isabella' },
    { b: 4, r: 'Champion', n: 'Skully' },
    { b: 4, r: 'Legendary', n: 'El1za' },
    { b: 4, r: 'Legendary', n: 'Martian' },
    { b: 5, r: 'Champion', n: 'Aloi' },
    { b: 5, r: 'Champion', n: 'Kitsu' },
    { b: 5, r: 'Champion', n: 'Nina' },
    { b: 5, r: 'Champion', n: 'Riot' },
    { b: 5, r: 'Legendary', n: 'Lola' },
    { b: 5, r: 'Legendary', n: 'Giggles' },
    { b: 5, r: 'Legendary', n: 'Dr. Victor' },
    { b: 5, r: 'Legendary', n: 'Frank' },
    { b: 5, r: 'Legendary', n: 'Gobbo' },
    { b: 5, r: 'Legendary', n: 'Moira' },
    { b: 5, r: 'Exclusive', n: 'Faust' },
    { b: 5, r: 'Exclusive', n: 'Lydia' }
];

// Read the file
const filePath = path.join(__dirname, 'data_assets.js');
let fileContent = fs.readFileSync(filePath, 'utf8');

// Update each character's card requirements
charPoolData.forEach(char => {
    const { n: name, r: rarity } = char;
    const newCards = newCardReqs[rarity];

    // Create regex to find this character's "c" array
    // We need to match the character name and then find its "c" array
    const charPattern = new RegExp(
        `"${name}":\\s*{[^}]*"c":\\s*\\[[\\s\\S]*?\\]`,
        'g'
    );

    // Find the character block
    const charMatch = fileContent.match(charPattern);

    if (charMatch && charMatch.length > 0) {
        const charBlock = charMatch[0];

        // Replace the "c" array with new values
        const newCharBlock = charBlock.replace(
            /"c":\s*\[[^\]]*\]/,
            `"c": [\n      ${newCards.join(',\n      ')}\n    ]`
        );

        fileContent = fileContent.replace(charBlock, newCharBlock);
    }
});

// Write back to the file
fs.writeFileSync(filePath, fileContent, 'utf8');

console.log('✓ Card requirements updated successfully for all characters!');
console.log('\nNew values by rarity:');
console.log('- Rookie:', newCardReqs.Rookie.join(', '));
console.log('- Pro:', newCardReqs.Pro.join(', '));
console.log('- Champion:', newCardReqs.Champion.join(', '));
console.log('- Legendary:', newCardReqs.Legendary.join(', '));
console.log('- Exclusive:', newCardReqs.Exclusive.join(', '));
