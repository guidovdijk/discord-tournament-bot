class createTeam {
    constructor(db, collection, msg){
        this.db = db;
        this.collection = collection;
        this.msg = msg;
        this.players = [];
        this.teamSize = Number;
        this.replies = {
            noTournament: "A tournament isn't created yet.",
            tournamentClosed: "The tournament is closed. You can't participate anymore.",
            formatError: "Please provide the following details: to the command: <your discord name>, <partner's discord names>",
            teamCreated: "Your team is created. Details: ",
            teamUpdated: "Your team has been updated. Details: ",
            serverError: "Server error, please try again. ",
        }
        this.checkTournamentExist();
    }

    checkTournamentExist(){
        const ref = this.db.collection(this.collection.tournament).doc('data');

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
            this.checkArgs(data.teamSize);
        }
    }

    checkArgs(teamSize){
        const args = this.msg.content.substring(this.msg.content.indexOf(" ") + 1);
        const players = args.split(/\s*,\s*/g);

        this.players = players;
        this.teamSize = teamSize;

        if(this.players.length !== teamSize){
            this.msg.reply(`Error team size is not equal to ${teamSize}\n` + this.replies.formatError);
            return;
        } else {
            this.checkPlayerAvailability()
        }
    }

    checkPlayerAvailability(){
        const teamsCollection = this.db.collection(this.collection.teams);
        teamsCollection.get()
        .then(snapshot => {
            if(snapshot._size == 0){
                this.createTeam();
            } else {
                snapshot.forEach(doc => {
                    const data = doc.data();

                    const dataTeamLowerCase = data.team.map(player => player.toLowerCase());

                    const unavailablePlayers = this.players.map((player) => {
                        if(dataTeamLowerCase.includes(player.toLowerCase())){
                            return player;
                        }
                    });
                    
                    if(unavailablePlayers.length >= 1){
                        this.msg.reply(`Player(s):${unavailablePlayers.map(player => { return ' ' + player })} ${unavailablePlayers.length > 1 ? 'are' : 'is'} already in a team. Please try again.`);
                        
                        return;
                    } else {
                        this.createTeam();
                    }
                });
            }
            })
            .catch(err => {
                this.msg.reply(this.replies.serverError + `\n${err}`);
            });
    }

    createTeam(){
        this.db.collection(this.collection.teams).doc().set({
            owner: this.players[0],
            team: this.players,
        }).then(() => {
            this.msg.reply(this.replies.teamCreated + `${this.players.map(player => { return `\nName: ${player}` } )}`);
        });

        return;
    }
}

export default createTeam;