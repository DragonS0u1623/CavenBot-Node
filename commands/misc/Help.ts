import { Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Command from '../../structures/Command'

export default class extends Command {
	constructor(client: CavenBot, name='help') {
		super(client, name, {
			category: 'Misc',
			description: 'Sends the commands page',
            guildOnly: false
		})
	}

	async run(message: Message) {
        const invite = 'https://cavenbot-website.herokuapp.com/commands'
		message.channel.send(invite)
	}
}