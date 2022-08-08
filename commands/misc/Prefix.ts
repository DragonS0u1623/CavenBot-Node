import Command from '../../structures/Command'
import serverSchema, { serverSettings } from '../../models/serverSchema'
import { Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
	constructor(client: CavenBot, name='prefix') {
		super(client, name, {
			category: 'Misc',
			description: 'Changes the prefix for the guild.',
			expectedArgs: '[new prefix]'
		})
	}

	async run(message: Message, args: string[]) {
		const { guild } = message
		if (!args.length) {
			message.channel.send(`You need to give a new prefix to use for this command.`)
			return
		}

		const prefix = args.shift()

		await serverSchema.findOneAndUpdate<serverSettings>({ guildId: guild.id }, { prefix })
		message.channel.send(`Prefix for this server changed to ${prefix}`)
	}
}