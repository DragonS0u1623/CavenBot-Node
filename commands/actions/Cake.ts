import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction, Message, EmbedBuilder, Colors } from 'discord.js'
import axios from 'axios'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

const TenorAPI = `https://api.tenor.com/v1/random?q=cake&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`

export default class extends Command {
    constructor(client: CavenBot, name='cake') {
        super(client, name, {
            category: 'Action',
            description: 'Sends an embed with a gif of cake',
            slash: true,
			data: new SlashCommandBuilder().setName('cake')
				.setDescription('Sends an embed with a gif of cake')
                .addUserOption(option => option.setName('target').setDescription('The person you want to give cake to').setRequired(false))
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()

        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user} gives cake to everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            const user = interaction.options.getUser('target')
            if (user != null) embed.setTitle(`${interaction.user} gives cake to ${user}`)
            interaction.editReply({ embeds: [embed] })
        }).catch(error => interaction.editReply('An error has occurred. Please try again.'))
    }

    async run(message: Message, args: string[]) {
        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${message.author} gives cake to everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            
            const user = message.mentions.users.first()
            if (user != null) embed.setTitle(`${message.author} gives cake to ${user}`)
            message.channel.send({ embeds: [embed] })
        }).catch(error => message.channel.send('An error has occurred. Please try again.'))
    }
}