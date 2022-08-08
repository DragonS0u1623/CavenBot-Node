const { Colors, EmbedBuilder } = require('discord.js')
const Command = require('../../structures/Command')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

const gif = 'https://cdn.discordapp.com/attachments/640674672618373132/711291888594059354/tenor-4.gif'

module.exports = class extends Command {
	constructor(client, name='nani') {
		super(client, name, {
			category: 'Misc',
			description: 'Sends an anime joke response',
            guildOnly: false
		})
	}

    async executeSlash(interaction) {
        interaction.deferReply()

        const embed = new EmbedBuilder()
            .setTitle('NANI!!!!!!!')
            .setURL(gif)
            .setImage(gif)
            .setColor(Colors.Yellow)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
        interaction.editReply({ embeds: [embed] })
    }

	async run(message) {
        const embed = new EmbedBuilder()
            .setTitle('NANI!!!!!!!')
            .setURL(gif)
            .setImage(gif)
            .setColor(Colors.Red)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		message.channel.send({ embeds: [embed] })
	}
}