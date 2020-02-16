const checkTournament = (doc, msg, reply) => {
    if (!doc.exists) {
        msg.reply(reply);
        return false;
    }
    
    return doc.data().isOpen;
}

export default checkTournament;
