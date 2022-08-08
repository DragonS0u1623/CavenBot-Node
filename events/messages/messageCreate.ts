import { Message } from "discord.js"
import Event from '../../structures/Event'
import serverSchema from '../../models/serverSchema'
import CavenBot from "../../structures/CavenBot"

export default class extends Event {
	constructor(client: CavenBot, name='messageCreate') {
		super(client, name)
	}

	async run(message: Message) {
		const mentionRegexPrefix = RegExp(`<@!${this.client.user.id}> `)

		if (message.author.bot) return

		const doc = await serverSchema.findOne({ guildId: message.guild?.id }, 'prefix')

		const guildPrefix = doc ? doc.prefix : 'm?'

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : guildPrefix

		if (!message.content.startsWith(prefix)) return

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g)
		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()))
		if (command) command.execute(message, args)
	}
}