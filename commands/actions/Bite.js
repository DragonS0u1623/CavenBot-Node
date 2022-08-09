const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, Colors } = require('discord.js')
const axios = require('axios')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

const TenorAPI = `https://api.tenor.com/v1/random?q=anime%20bite&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`

module.exports = class extends Command {
    constructor(client, name='bite') {
        super(client, name, {
            category: 'Action',
            description: 'Sends an embed with a gif of someone being bitten',
            slash: true,
			data: new SlashCommandBuilder().setName('bite')
				.setDescription('Sends an embed with a gif of someone being bitten')
                .addUserOption(option => option.setName('target').setDescription('The person you want to bite').setRequired(false))
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()

        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.tag} bites everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            const user = interaction.options.getUser('target')
            if (user != null) embed.setTitle(`${interaction.user.tag} bites ${user.tag}`)
            interaction.editReply({ embeds: [embed] })
        }).catch(error => interaction.editReply('An error has occurred. Please try again.'))
    }

    async run(message) {
        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${message.author.tag} bites everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            
            const user = message.mentions.users.first()
            if (user != null) embed.setTitle(`${message.author.tag} bites ${user.tag}`)
            message.channel.send({ embeds: [embed] })
        }).catch(error => message.channel.send('An error has occurred. Please try again.'))
    }
}