import Discord from "discord.js";
import Firebase from "firebase/app";
import FirebaseAdmin from "firebase-admin";
import * as serviceAccount from "./service-account.json";
import 'dotenv/config';
import checkPrefix from './helpers/checkPrefix';
import deleteCollection from './firebase/deleteCollection';
import createTournament from './createTournament';


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

    const collectionName = "tournament"
    checkPrefix(msg, prefix, `please provide the prefix '${prefix}'`);

    const args = msg.content.slice(prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();

    switch(command){
        case 'tournament-init':
            new createTournament(db, collectionName, msg, args);
        break
        case 'tournament-end':
            deleteCollection(db, collectionName);

            msg.reply('Tournament has ended, until next time!');
        case 'tournament-team':
            createTeam(msg);
            msg.reply('Team is created, good luck!');
        break
    }
})

bot.login(token);
