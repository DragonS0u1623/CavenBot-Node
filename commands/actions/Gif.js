const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, Colors } = require('discord.js')
const axios = require('axios')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

module.exports = class extends Command {
    constructor(client, name='gif') {
        super(client, name, {
            category: 'Action',
            description: 'Sends an embed with a gif of the given search term',
            slash: true,
			data: new SlashCommandBuilder().setName('gif')
				.setDescription('Sends an embed with a gif of the given search term')
                .addStringOption(option => option.setName('searchterm').setDescription('The term you want to search').setRequired(true))
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()

        const searchTerm = interaction.options.getString('searchTerm')
        searchTerm.replace(' ', '%20')
        const TenorAPI = `https://api.tenor.com/v1/random?q=${searchTerm}&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`

        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.tag} gives a gif to everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp(new Date())
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            interaction.editReply({ embeds: [embed] })
        }).catch(error => interaction.editReply('An error has occurred. Please try again.'))
    }

    async run(message, args) {
        const searchTerm = args.join('%20')
        const TenorAPI = `https://api.tenor.com/v1/random?q=${searchTerm}&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`
        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${message.author.tag} gives a gif to everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp(new Date())
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            message.channel.send({ embeds: [embed] })
        }).catch(error => message.channel.send('An error has occurred. Please try again.'))
    }
}