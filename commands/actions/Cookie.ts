import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction, Message, EmbedBuilder, Colors } from 'discord.js'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

const cookie = `https://cdn.discordapp.com/emojis/709783068881190932.png?v=1`

export default class extends Command {
    constructor(client: CavenBot, name='cookie') {
        super(client, name, {
            category: 'Action',
            description: 'Gives a cookie to someone',
            slash: true,
			data: new SlashCommandBuilder().setName('cookie')
				.setDescription('Gives a cookie to someone')
                .addUserOption(option => option.setName('target').setDescription('The person you want to give a cookie').setRequired(false))
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user} gives a cookie to everyone`)
            .setDescription(`[Link to image](${cookie})`)
            .setImage(cookie)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })

        const user = interaction.options.getUser('target')
        if (user != null) embed.setTitle(`${interaction.user} gives a cookie to ${user}`)
        interaction.editReply({ embeds: [embed] })
    }

    async run(message: Message, args: string[]) {
        const embed = new EmbedBuilder()
            .setTitle(`${message.author} gives a cookie to everyone`)
            .setDescription(`[Link to image](${cookie})`)
            .setImage(cookie)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            
        const user = message.mentions.users.first()
        if (user != null) embed.setTitle(`${message.author} gives a cookie to ${user}`)
        message.channel.send({ embeds: [embed] })
    }
}