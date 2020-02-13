const checkPrefix = (msg, prefix, reply) => {
    if (msg.author.bot) return;

    if(!msg.content.startsWith(prefix)){
        msg.reply(reply);

        return;
    }

}

export default checkPrefix;