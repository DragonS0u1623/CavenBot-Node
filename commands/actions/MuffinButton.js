const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, Colors } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

const gif = `https://cdn.discordapp.com/attachments/716088303622946846/746103226008600657/muffin_button.gif`

module.exports = class extends Command {
    constructor(client, name='muffin_button') {
        super(client, name, {
            aliases: ['mb'],
            category: 'Action',
            description: 'Sends a DBZA meme of the muffin button',
            slash: true,
			data: new SlashCommandBuilder().setName('muffin_button')
				.setDescription('Sends a DBZA meme of the muffin button')
        })
    }

    async executeSlash(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Muffin Button')
            .setImage(gif)
            .setURL(gif)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
        interaction.reply({ embeds: [embed] })
    }

    async execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('Muffin Button')
            .setImage(gif)
            .setURL(gif)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
        message.channel.send({ embeds: [embed] })
    }
}