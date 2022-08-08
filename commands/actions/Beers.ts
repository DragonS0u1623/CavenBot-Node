import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction, Message, EmbedBuilder, Colors } from 'discord.js'
import axios from 'axios'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

const TenorAPI = `https://api.tenor.com/v1/random?q=cheers&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`

export default class extends Command {
    constructor(client: CavenBot, name='beers') {
        super(client, name, {
            aliases: ['cheers'],
            category: 'Action',
            description: 'Sends an embed with a gif of cheers',
            slash: true,
			data: new SlashCommandBuilder().setName('beers')
				.setDescription('Sends an embed with a gif of cheers')
                .addUserOption(option => option.setName('target').setDescription('The person you want to cheer').setRequired(false))
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()

        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle('Cheers')
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            const user = interaction.options.getUser('target')
            if (user != null) embed.setTitle(`Cheers ${user}`)
            interaction.editReply({ embeds: [embed] })
        }).catch(error => interaction.editReply('An error has occurred. Please try again.'))
    }

    async run(message: Message, args: string[]) {
        axios.get(TenorAPI).then(response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle('Cheers')
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            
            const user = message.mentions.users.first()
            if (user != null) embed.setTitle(`Cheers ${user}`)
            message.channel.send({ embeds: [embed] })
        }).catch(error => message.channel.send('An error has occurred. Please try again.'))
    }
}