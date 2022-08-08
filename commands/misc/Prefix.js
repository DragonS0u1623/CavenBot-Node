const Command = require('../../structures/Command')
const serverSchema = require('../../models/serverSchema')

module.exports = class extends Command {
	constructor(client, name='prefix') {
		super(client, name, {
			category: 'Misc',
			description: 'Changes the prefix for the guild.',
			expectedArgs: '[new prefix]'
		})
	}

	async run(message, args) {
		const { guild } = message
		if (!args.length) {
			message.channel.send(`You need to give a new prefix to use for this command.`)
			return
		}

		const prefix = args.shift()

		await serverSchema.findOneAndUpdate({ guildId: guild.id }, { prefix })
		message.channel.send(`Prefix for this server changed to ${prefix}`)
	}
}