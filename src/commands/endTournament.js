import deleteCollection from '../firebase/deleteCollection';

class endTournament {
    constructor(db, collection, msg){
        this.db = db;
        this.collection = collection;
        this.msg = msg;
        this.replies = {
            ended: "Tournament has ended, until next time!",
            noTournamentExists: "No tournament has been created yet. Please use the ```!tournament-init <team size>  <minimum required participators>``` to create a tournament.",
            noTournamentStarted: "No tournament has been started yet. Please use the ```!tournament-start``` to start a tournament.",
        }
    }

    async getTournamentData(){
        try {
            const doc = await this.db.collection(this.collection.tournament).doc('data').get()
            const tournamentOpen = await checkTournament(doc, this.msg, this.replies.noTournamentExists);
        
            if(!tournamentOpen){
                this.getTeams();
            } else {
                this.msg.reply(this.replies.noTournamentStarted);
            }
        } catch {

        }
    }

    async getTeams(){
        const teamsCollection = await this.db.collection(this.collection.teams).get();
        const playerScores = await teamsCollection.then(snapshot => {
            return snapshot.map(doc => {
                const data = doc.data();
                return data;
            });
        });

        this.createIdividualScores(playerScores);
    }

    createIdividualScores(playerScores){
        this.db.collection(this.collection.leaderboard).doc().set({
            name: parseInt(teamSize),
            won: parseInt(participators),
            lost: true,
        });
    }

    updateScoreboard(){
        this.db.collection(this.collection).doc("data").set({
            teamSize: parseInt(teamSize),
            minimumRequired: parseInt(participators),
            isOpen: true,
        });
    }


    end(){
        deleteCollection(db, collectionNames.tournament);
        msg.reply(this.replies.ended);

    }
    
}

export default endTournament;