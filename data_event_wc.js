var wcEventData = {
    settings: {
        adsTickets: 2,
        durationDays: 7
    },
    countries: [
        "Argentina", "Brazil", "France", "Germany", "Spain", "England", "Italy", "Netherlands",
        "Portugal", "Belgium", "Croatia", "Uruguay", "Colombia", "USA", "Mexico", "Japan",
        "South Korea", "Senegal", "Morocco", "Switzerland", "Denmark", "Sweden", "Poland", "Serbia",
        "Wales", "Iran", "Australia", "Canada", "Ecuador", "Ghana", "Cameroon", "Tunisia",
        "Costa Rica", "Saudi Arabia", "Qatar", "Chile", "Peru", "Nigeria", "Egypt", "Algeria",
        "Ivory Coast", "Mali", "Norway", "Turkey", "Ukraine", "Austria", "Hungary", "Czech Republic"
    ],
    characters: [
        "Axel", "Raven", "James", "Bruce", "Bucky", "Wilson", "Ivanna", "Bolshoi", "Taiga", "Monk",
        "Gnoll", "Maximus", "Thomas", "Spike", "Mogadi", "Hogmar", "Camila", "Pedro", "Süleyman", "Hürrem"
    ],
    dailyPass: Array.from({length: 7}, (_, i) => ({
        day: i + 1,
        freeType: "Ticket",
        freeAmt: 2,
        premType: "Ticket",
        premAmt: 2
    })),
    battlePass: Array.from({length: 40}, (_, i) => ({
        level: i + 1,
        xpReq: (i + 1) * 100,
        freeType: "Gold",
        freeAmt: (i + 1) * 50,
        premType: "Diamonds",
        premAmt: (i % 5 === 4) ? 20 : 5
    })),
    missions: [
        { task: "Play 3 Event Matches", req: 3, type: "Ticket", amt: 1, xp: 50 },
        { task: "Win 1 Event Match", req: 1, type: "Ticket", amt: 1, xp: 50 },
        { task: "Score 5 Goals in Event", req: 5, type: "Ticket", amt: 1, xp: 50 },
        { task: "Play 5 Event Matches", req: 5, type: "Ticket", amt: 1, xp: 50 },
        { task: "Win 3 Event Matches", req: 3, type: "Gold", amt: 100, xp: 50 },
        { task: "Score 10 Goals in Event", req: 10, type: "Diamonds", amt: 10, xp: 50 }
    ]
};
