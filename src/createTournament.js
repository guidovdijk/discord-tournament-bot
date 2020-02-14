import createCollection from './firebase/createCollection';

class createTournament {
    constructor(db, path, msg, args){
        this.db = db;
        this.path = path,
        this.msg = msg,
        this.args = args,
        this.replies = {
            formatError: "Please provide the following details: to the command: <team size>  <participation limit>",
            argsError: {
                limit: "Error: Team size exceeded the limit of 5",
                uneven: `Tournament will be created, but there is an uneven amount of teams.\nPlease make sure it is even so everyone can play.`,
            },
            created: {
                color: 0x0da258,
                title: "**Tournament is created, please pick your teammate(s)!**",
                fields: [
                    {
                        name: "\n**To add a team:**",
                        value: "```\n!tournament-team <your league name>, <your discord name>, <partner's league name>, <partner's discord name>```\n"
                    },
                    {
                        name: "\n**Want to change partners? Run the command below overwrite**",
                        value: "```\n!tournament-team```"
                    },
                    {
                        name: "**To see all teams**",
                        value: "```\n!tournament-show```"
                    }
                ]
            },
        },
        this.init();
    }

    init(){
        this.checkFormat();
    }

    checkFormat(){
        if(this.args.length !== 2){
            this.msg.reply(this.replies.formatError);
            return;
        } else {
            this.checkArgs();
        }
    }

    checkArgs(){
        const [teamSize, participationLimit] = [this.args[0], this.args[1]];

        if(teamSize > 5){
            this.msg.reply(this.replies.argsError.limit);
            return;
        }

        if(participationLimit % 2 == 1){
            this.msg.reply(this.replies.argsError.uneven);
        }

        this.createTournament();
    }

    createTournament(){
        createCollection(this.db, this.msg);
        this.msg.channel.send({embed: this.replies.created});
    }
}

export default createTournament;