const Event = require('../../structures/Event')

module.exports = class extends Event {
	constructor(client, name='interactionCreate') {
		super(client, name)
	}

	async run(interaction) {
		if (!interaction.isChatInputCommand()) return

		const command = this.client.slashCommands.get(interaction.commandName)

		if (!command) return

		try {
			await command.executeSlash(interaction)
		} catch (error) {
			console.error(error)
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
}