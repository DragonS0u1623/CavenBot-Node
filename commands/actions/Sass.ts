import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction, Message, EmbedBuilder, Colors } from 'discord.js'
import axios from 'axios'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

const TenorAPI = `https://api.tenor.com/v1/random?q=anime%20sass&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`

export default class extends Command {
    constructor(client: CavenBot, name='sass') {
        super(client, name, {
            category: 'Action',
            description: 'Sends an embed with a gif of someone being sassy',
            slash: true,
			data: new SlashCommandBuilder().setName('sass')
				.setDescription('Sends an embed with a gif of someone being sassy')
                .addUserOption(option => option.setName('target').setDescription('The person you want to sass').setRequired(false))
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()

        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user} sasses everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            const user = interaction.options.getUser('target')
            if (user != null) embed.setTitle(`${interaction.user} sasses ${user}`)
            interaction.editReply({ embeds: [embed] })
        }).catch(error => interaction.editReply('An error has occurred. Please try again.'))
    }

    async execute(message: Message, args: string[]) {
        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${message.author} sasses everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            
            const user = message.mentions.users.first()
            if (user != null) embed.setTitle(`${message.author} sasses ${user}`)
            message.channel.send({ embeds: [embed] })
        }).catch(error => message.channel.send('An error has occurred. Please try again.'))
    }
}