class updateTeam {
    constructor(fieldValue, db, collection, msg){
        this.fieldValue = fieldValue;
        this.db = db;
        this.collection = collection;
        this.msg = msg;
        this.players = [];
        this.replies = {
            formatError: "Please provide the following details: to the command: <teammate> : <new teammate>",
            premissionError: "You can't change the team, because you are not the owner.",
            teamNotFound: "Team not found. You are probably not in a team.",
            teamUpdated: "Your team has been updated: ",
            updateError: "Error: Could not update player. Please try again.",
            generalCollectingError: "Error: could not collect teams.",
            collectTeamError: "Error: could not collect your team.",
        };
        this.checkArgs();
    }

    checkArgs(){
        const args = this.msg.content.substring(this.msg.content.indexOf(" ") + 1);
        const players = args.split(/\s*:\s*/g);

        if(players.length !== 2){
            this.msg.reply(this.replies.formatError);
            return;
        } else {
            this.getUsernames(players);
        }
    }

    getUsernames(players){
        const members = this.msg.mentions.users;

        this.players = players.filter(player => {
            if(!player.startsWith('<@')){
                return player;
            }
        });

        members.forEach(member => {
            this.players.push(member.username);
        });

        this.checkPlayerAvailability();
    }

    checkPlayerAvailability(){
        // Create a reference to the cities collection
        const teamsCollection = this.db.collection(this.collection);
        const member = this.msg.member.user;
        const unavailablePlayers = [];

        const isTeamMember = teamsCollection.where('team', 'array-contains', member.username);

        teamsCollection.get()
            .then(snapshot => {
                            
                snapshot.forEach(doc => {
                    const data = doc.data();

                    const dataTeamLowerCase = data.team.map(player => player.toLowerCase());

                    const player = this.players[0].toLowerCase();
                    const newPlayer = this.players[1].toLowerCase();
                    
                    if(dataTeamLowerCase.includes(newPlayer) && !dataTeamLowerCase.includes(player)){
                        unavailablePlayers.push(newPlayer);
                    }

                });
            })
            .catch(err => {
                this.msg.reply(this.replies.generalCollectingError + `\n${err}`);
            });

        isTeamMember.get()
            .then(snapshot => {
                if (snapshot.empty) {
                    this.msg.reply(this.replies.teamNotFound);
                    return;
                }  
                snapshot.forEach(doc => {
                    const data = doc.data();

                    if(data.owner !== member.tag){
                        this.msg.reply(this.replies.premissionError + ` Please ask **${data.owner.split("#")[0]}** to change the team.`);

                        return;
                    }

                    if(!data.team.includes(this.players[0])){
                        this.msg.reply(`Error: could not find player: **${this.players[0]}** in your team.`);
                        return;
                    }

                    if(unavailablePlayers.length >= 1){
                        this.msg.reply(`Player: ${unavailablePlayers[0]} is already in a team. Please try someone else.`);
                        
                        return;
                    } else {
                        this.updateTeam(doc.id);
                    }
                })
            }).catch((err) => {
                this.msg.reply(this.replies.collectTeamError + `\n${err}`);
            })
    }

    updateTeam(id){
        const doc = this.db.collection(this.collection).doc(id);
 
        doc.update({
            team: this.fieldValue.arrayRemove(this.players[0])
        }).then(() => {
            doc.update({
                team: this.fieldValue.arrayUnion(this.players[1])
            })
        }).then(() => {
            this.msg.reply(this.replies.teamUpdated + `changed: **${this.players[0]}** with: **${this.players[1]}**`);
        }).catch((err) => {
            this.msg.reply(this.replies.updateError + `\n${err}`);
        });

        return ;
    }
}

export default updateTeam;