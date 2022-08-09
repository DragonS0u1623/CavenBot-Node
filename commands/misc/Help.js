const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../structures/Command')

const invite = 'https://cavenbot-website.herokuapp.com/commands'

module.exports = class extends Command {
	constructor(client, name='help') {
		super(client, name, {
			category: 'Misc',
			description: 'Sends the commands page',
            guildOnly: false,
			slash: true,
			data: new SlashCommandBuilder().setName('help').setDescription('Sends the commands page of the bot website')
		})
	}

	async executeSlash(interaction) {
		interaction.reply(invite)
	}

	async run(message) {
		message.channel.send(invite)
	}
}