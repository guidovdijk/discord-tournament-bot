import checkTournament from './helpers/checkTournament';

class startTournament {
    constructor(db, collection, msg){
        this.db = db;
        this.collection = collection;
        this.msg = msg;
        this.replies = {
            noTournament: "No tournament has been started yet. Please use the ```!tournament-init <team size>  <minimum required participators>``` to create a tournament.",
            tournamentClosed: "Tournament has been closed no one can sign up anymore.",
            tournamentError: "Error: could not close the tournament. Please try again later."
        };
        this.getTournamentData();
    }

    getTournamentData(){

        this.db.collection(this.collection).doc('data').get().then(doc => {
            const tournamentOpen = checkTournament(doc, this.msg, this.replies.noTournament);
    
            if(tournamentOpen){
                this.changeTournamentStatus(doc.id);
            } else {
                this.msg.reply(this.replies.tournamentClosed);
            }
        });
    }

    changeTournamentStatus(id){
        const doc = this.db.collection(this.collection).doc(id);

        doc.update({
            isOpen: false
        }).then(() => {
            this.msg.reply(this.replies.tournamentClosed);
        }).catch((err) => {
            this.msg.reply(this.replies.tournamentError + `\n${err}`);
        });

        return ;
    }
}

export default startTournament;