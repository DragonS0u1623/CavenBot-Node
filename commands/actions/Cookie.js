const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, Colors } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

const cookie = `https://cdn.discordapp.com/emojis/709783068881190932.png?v=1`

module.exports = class extends Command {
    constructor(client, name='cookie') {
        super(client, name, {
            category: 'Action',
            description: 'Gives a cookie to someone',
            slash: true,
			data: new SlashCommandBuilder().setName('cookie')
				.setDescription('Gives a cookie to someone')
                .addUserOption(option => option.setName('target').setDescription('The person you want to give a cookie').setRequired(false))
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.tag} gives a cookie to everyone`)
            .setDescription(`[Link to image](${cookie})`)
            .setImage(cookie)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })

        const user = interaction.options.getUser('target')
        if (user != null) embed.setTitle(`${interaction.user.tag} gives a cookie to ${user.tag}`)
        interaction.editReply({ embeds: [embed] })
    }

    async run(message) {
        const embed = new EmbedBuilder()
            .setTitle(`${message.author.tag} gives a cookie to everyone`)
            .setDescription(`[Link to image](${cookie})`)
            .setImage(cookie)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            
        const user = message.mentions.users.first()
        if (user != null) embed.setTitle(`${message.author.tag} gives a cookie to ${user.tag}`)
        message.channel.send({ embeds: [embed] })
    }
}