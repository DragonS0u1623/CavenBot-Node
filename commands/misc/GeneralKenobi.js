const { Colors, EmbedBuilder } = require('discord.js')
const Command = require('../../structures/Command')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

const gif = 'https://cdn.discordapp.com/attachments/716088303622946846/737578915236937768/general_Grievous.gif'

module.exports = class extends Command {
    constructor(client, name='general_kenobi') {
        super(client, name, {
            aliases: ['gk', 'general', 'kenobi', 'general kenobi'],
            description: 'Sends a gif from Star Wars'
        })
    }

    async run(message) {
        const embed = new EmbedBuilder()
            .setTitle('General Kenobi')
            .setURL(gif)
            .setImage(gif)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		message.channel.send({ embeds: [embed] })
	}
}