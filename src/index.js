import Discord from "discord.js";
import Firebase from "firebase/app";
import FirebaseAdmin from "firebase-admin";
import * as serviceAccount from "./service-account.json";
import 'dotenv/config';
import checkPrefix from './helpers/checkPrefix';
import createTournament from './commands/createTournament';
import startTournament from './startTournament';
import endTournament from './endTournament';
import createTeam from './createTeam';
import updateTeam from './updateTeam';

const fieldValue = FirebaseAdmin.firestore.FieldValue;
const prefix = '!';

FirebaseAdmin.initializeApp({
    credential: FirebaseAdmin.credential.cert(serviceAccount)
});

const db = FirebaseAdmin.firestore();
const bot = new Discord.Client();
const token = process.env.Token;


bot.on('ready', () => {
    console.log('bot is ready');
});

bot.on('message', async msg => {

    const collectionNames = {
        tournament: "tournament",
        teams: "teams",
        leaderboard: "leaderboard"
    }
    checkPrefix(msg, prefix, `please provide the prefix '${prefix}'`);

    const args = msg.content.slice(prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();

    switch(command){
        case 'tournament-init':
            new createTournament(db, collectionNames.tournament, msg, args);
            break;
        case 'tournament-start':
            new startTournament(db, collectionNames.tournament, msg);

            break;
        case 'tournament-end':
            new endTournament(db, collectionNames, msg)
            break;
        case 'tournament-team':
            new createTeam(bot, db, collectionNames, msg);
            break;
        case 'tournament-update':
            new updateTeam(fieldValue, db, collectionNames, msg);
            break;
    }
})

bot.login(token);

