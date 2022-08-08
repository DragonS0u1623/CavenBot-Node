import { Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Command from '../../structures/Command'

export default class extends Command {
    constructor(client: CavenBot, name='guilds') {
        super(client, name, {
            description: 'Gives the number of servers the bot is in',
            guildOnly: false
        })
    }

    async run(message: Message) {
        const guilds = this.client.guilds.cache.size
        message.channel.send(`I'm in ${guilds} servers currently`)
    }
}