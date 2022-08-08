import { Interaction } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Event from '../../structures/Event'

export default class extends Event {
	constructor(client: CavenBot, name='interactionCreate') {
		super(client, name)
	}

	async run(interaction: Interaction) {
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