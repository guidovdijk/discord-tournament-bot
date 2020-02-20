class createTournament {
    constructor(db, collection, msg, args){
        this.db = db;
        this.collection = collection,
        this.msg = msg,
        this.args = args,
        this.replies = {
            formatError: "Please provide the following details: to the command: <team size>  <minimum required participators>",
            argsError: {
                limit: "Error: Team size exceeded the limit of 5",
                uneven: `Tournament will be created, but there is an uneven amount of teams.\nPlease make sure it is even so everyone can play.`,
            },
        },
        this.checkArgs();
    }

    checkArgs(){
        if(this.args.length !== 2){
            this.msg.reply(this.replies.formatError);
            return;
        } else {
            this.checkFormat();
        }
    }

    checkFormat(){
        const [teamSize, participators] = [this.args[0], this.args[1]];

        if(teamSize > 5){
            this.msg.reply(this.replies.argsError.limit);
            return;
        }

        if(participators % 2 == 1){
            this.msg.reply(this.replies.argsError.uneven);
        }

        this.createTournament(teamSize, participators);
    }

    createTournament(teamSize, participators){
        const createdRepley = {
            color: 0x0da258,
            title: `**${teamSize}VS${teamSize} Tournament is created, please pick your teammate(s)!**`,
            fields: [
                {
                    name: "\n**To add a team:** (Want to change partners? Run the command again to overwrite)",
                    value: "```\n!tournament-team <your league name> <your discord name> <partner's league name> <partner's discord name>```\n"
                },
                {
                    name: "**To see all teams**",
                    value: "```\n!tournament-show```"
                }
            ]
        };
        this.db.collection(this.collection).doc("data").set({
            teamSize: parseInt(teamSize),
            minimumRequired: parseInt(participators),
            isOpen: true,
        });
        this.msg.channel.send({embed: createdRepley});
    }
}

export default createTournament;