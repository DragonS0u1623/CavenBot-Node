const Command = require('../../structures/Command')

module.exports = class extends Command {
    constructor(client, name='guilds') {
        super(client, name, {
            description: 'Gives the number of servers the bot is in',
            guildOnly: false
        })
    }

    async run(message) {
        const guilds = this.client.guilds.cache.size
        message.channel.send(`I'm in ${guilds} servers currently`)
    }
}