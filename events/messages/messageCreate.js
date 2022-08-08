const Event = require('../../structures/Event')
const serverSchema = require('../../models/serverSchema')

module.exports = class extends Event {
	constructor(client, name='messageCreate') {
		super(client, name)
	}

	async run(message) {
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