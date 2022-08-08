import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction, Message, EmbedBuilder, Colors } from 'discord.js'
import axios from 'axios'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
    constructor(client: CavenBot, name='gif') {
        super(client, name, {
            category: 'Action',
            description: 'Sends an embed with a gif of the given search term',
            slash: true,
			data: new SlashCommandBuilder().setName('beg')
				.setDescription('Sends an embed with a gif of the given search term')
                .addStringOption(option => option.setName('searchTerm').setDescription('The term you want to search').setRequired(true))
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()

        const searchTerm = interaction.options.getString('searchTerm')
        searchTerm.replace(' ', '%20')
        const TenorAPI = `https://api.tenor.com/v1/random?q=${searchTerm}&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`

        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user} gives a gif to everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            interaction.editReply({ embeds: [embed] })
        }).catch(error => interaction.editReply('An error has occurred. Please try again.'))
    }

    async run(message: Message, args: string[]) {
        const searchTerm = args.join('%20')
        const TenorAPI = `https://api.tenor.com/v1/random?q=${searchTerm}&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`
        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${message.author} gives a gif to everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            message.channel.send({ embeds: [embed] })
        }).catch(error => message.channel.send('An error has occurred. Please try again.'))
    }
}