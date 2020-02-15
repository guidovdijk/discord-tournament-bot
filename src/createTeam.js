class createTeam {
    constructor(db, collection, msg, agrs){
        this.db = db;
        this.collection = collection;
        this.msg = msg;
        this.agrs = agrs;
        this.replies = {
            noTournament: "A tournament isn't created yet.",
            tournamentClosed: "The tournament is closed. You can't participate anymore.",
            formatError: "Please provide the following details: to the command: <your league name> <your discord name> <partner's league name> <partner's discord name>",
            teamCreated: "Your team is created. Details: ",
            serverError: "Server error, please try again. "
        }
        this.checkTournamentExist();
    }

    checkTournamentExist(){
        const ref = db.collection(this.collection.tournament).doc('data');

        ref.get()
            .then((docSnapshot) => {
                if (!docSnapshot.exists) {
                    this.msg.reply(this.replies.noTournament);
                    return;
                } else {
                    ref.onSnapshot((doc) => {
                        this.checkTournamentStatus(doc.data());
                    });
                }
            });
    }

    checkTournamentStatus(data){
        if(!data.isOpen){
            this.msg.reply(this.replies.tournamentClosed);
            return;
        } else {
            this.checkArgs();
        }
    }

    checkArgs(){
        if(this.args.length !== 4){
            this.msg.reply(this.replies.formatError);
            return;
        } else {
            this.checkPlayerAvailability();
        }
    }

    checkPlayerAvailability(){
        const [leagueName, discordName, partnerLeagueName, partnerDiscordName] = [ this.args[0], this.args[1], this.args[2], this.args[3] ];

        const teamsCollection = this.db.collection(this.collection.teams);
        
        teamsCollection.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            });
        })
        .catch(err => {
            this.msg.reply(this.replies.serverError + `\n${err}`);
        });
    }

    createTeam(leagueName, discordName, partnerLeagueName, partnerDiscordName){
        this.db.collection(this.collection.teams).doc().set({
            leagueName: leagueName,
            discordName: discordName,
            partnerLeagueName: partnerLeagueName,
            partnerDiscordName: partnerDiscordName,
        }).then(() => {
            this.msg.reply(this.replies.teamCreated + `\n(League: ${leagueName}, Discord: ${discordName}),\n(League: ${partnerLeagueName}, Discord: ${partnerDiscordName})`);
        });

        return;
    }
}

export default createTeam;