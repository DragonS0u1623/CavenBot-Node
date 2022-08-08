const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, Colors } = require('discord.js')
const axios = require('axios')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

const TenorAPI = `https://api.tenor.com/v1/random?q=anime%20pat&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`

module.exports = class extends Command {
    constructor(client, name='pat') {
        super(client, name, {
            category: 'Action',
            description: 'Sends an embed with a gif of someone being pat',
            slash: true,
			data: new SlashCommandBuilder().setName('pat')
				.setDescription('Sends an embed with a gif of someone being pat')
                .addUserOption(option => option.setName('target').setDescription('The person you want to pat').setRequired(false))
        })
    }

    async executeSlash(interaction) {
        interaction.deferReply()

        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user} pats everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp(new Date())
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            const user = interaction.options.getUser('target')
            if (user != null) embed.setTitle(`${interaction.user} pats ${user}`)
            interaction.editReply({ embeds: [embed] })
        }).catch(error => interaction.editReply('An error has occurred. Please try again.'))
    }

    async execute(message) {
        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${message.author} pats everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp(new Date())
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            
            const user = message.mentions.users.first()
            if (user != null) embed.setTitle(`${message.author} pats ${user}`)
            message.channel.send({ embeds: [embed] })
        }).catch(error => message.channel.send('An error has occurred. Please try again.'))
    }
}