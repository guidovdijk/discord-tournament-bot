const createCollection = (db, collection) => {
        
    db.collection(collection).doc().set({
        player1: {
            leagueName: "21",
            discordName: "efw",
        },
        player2: {
            leagueName: "fgre",
            discordName: "ge",
        }
    })
}
