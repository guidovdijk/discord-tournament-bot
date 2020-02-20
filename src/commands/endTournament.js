import deleteCollection from '../firebase/deleteCollection';
import checkTournament from '../helpers/checkTournament';

class endTournament {
    constructor(db, collection, msg){
        this.db = db;
        this.collection = collection;
        this.msg = msg;
        this.replies = {
            ended: "Tournament has ended, until next time!",
            noTournamentExists: "No tournament has been created yet. Please use the ```!tournament-init <team size>  <minimum required participators>``` to create a tournament.",
            noTournamentStarted: "No tournament has been started yet. Please use the ```!tournament-start``` to start a tournament.",
            errorLeaderboardUpdate: "Error: Coudn't update the leaderboard.",
            leaderboardUpdate: "Leaderboard is updated.",
        }
        this.teamSorted = [];
        this.getTournamentData();
    }

    async getTournamentData(){
        try {
            const doc = await this.db.collection(this.collection.tournament).doc('data').get()
            const tournamentOpen = await checkTournament(doc, this.msg, this.replies.noTournamentExists);
        
            if(!tournamentOpen){
                const data = await this.getTeamsSorted();

                Promise.all([this.createIdividualScores(data), this.createScoreboard(data)])
            } else {
                this.msg.reply(this.replies.noTournamentStarted);
            }
        } catch(err) {
            console.log(err);
        }
    }

    createScoreboard(teamSorted){
        const firstPlaceTeam = teamSorted[0];

        const fields = [];

        teamSorted.map((team, index) => {
            const place = index + 1;
            const players = `**${place}${this.getPlacementText(place)}** ${team.team.toString()}`;
            const matches = {
                wins: team.wins,
                losses: team.losses
            }
            fields.push({
                value: players,
                name: "\u200B",
                inline: true,
            });
            fields.push({
                value: `W:**${matches.wins}**  L:**${matches.losses}**`,
                name: "\u200B",
                inline: true,
            });
            fields.push({
                value: "\u200B",
                name: "\u200B",
                inline: true,
            });
        });

        const createdRepley = {
            color: 0x0da258,
            title: `Tournament winners: ${firstPlaceTeam.team.map(player => player)}!`,
            description: `Wins: **${firstPlaceTeam.wins}**  |  Losses: **${firstPlaceTeam.losses}**`,
            fields: fields,
        };

        this.msg.channel.send({embed: createdRepley});
    }

    getPlacementText(index){
        switch(index){
            case 1:   return "st"
            case 2:   return "nd"
            case 3:   return "rd"
            default:  return "th"
        }
    }

    async getTeamsSorted(){
        const teamSorted = [];

        await this.db.collection(this.collection.teams).orderBy("wins").get().then(snapshot => {
            snapshot.forEach((doc) => {
                teamSorted.push(doc.data())
            });
        });

        return teamSorted;
    }

    createIdividualScores(teams){
        const batch = this.db.batch();

        teams.forEach(team => {
            team.team.forEach(player => {
                batch.set(this.db.collection(this.collection.leaderboard).doc(), {
                    name: player,
                    wins: parseInt(team.wins),
                    losses: parseInt(team.losses),
                });
            })
        });

        // return batch.commit().catch(err => {
        //     this.msg.reply(this.replies.errorLeaderboardUpdate + `\n${err}`);
        // });
    }


    end(){
        deleteCollection(db, collectionNames.tournament);
        msg.reply(this.replies.ended);
    }
    
}

export default endTournament;