const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const Command = require('../../structures/Command')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

const invite = 'https://discord.gg/6TjuPYy'

module.exports = class extends Command {
	constructor(client, name='support') {
		super(client, name, {
			category: 'Misc',
			description: 'Sends an embed with the invite link to the official support server',
            guildOnly: false,
			slash: true,
			data: new SlashCommandBuilder().setName('support')
				.setDescription('Sends an embed with the invite link to the official support server')
		})
	}

	async executeSlash(interaction) {
		const embed = new EmbedBuilder()
            .setTitle('Invite to the Support Server')
            .setURL(invite)
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		interaction.reply({ embeds: [embed], ephemeral: true })
	}

	async run(message) {
        const embed = new EmbedBuilder()
            .setTitle('Invite to the Support Server')
            .setURL(invite)
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		message.author.createDM().then(channel => channel.send({ embeds: [embed] }))
	}
}