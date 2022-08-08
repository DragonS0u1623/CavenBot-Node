import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction, Message, EmbedBuilder, Colors } from 'discord.js'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

const gif = `https://cdn.discordapp.com/attachments/716088303622946846/746103226008600657/muffin_button.gif`

export default class extends Command {
    constructor(client: CavenBot, name='muffin_button') {
        super(client, name, {
            aliases: ['mb'],
            category: 'Action',
            description: 'Sends a DBZA meme of the muffin button',
            slash: true,
			data: new SlashCommandBuilder().setName('muffin_button')
				.setDescription('Sends a DBZA meme of the muffin button')
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle('Muffin Button')
            .setImage(gif)
            .setURL(gif)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
        interaction.reply({ embeds: [embed] })
    }

    async execute(message: Message, args: string[]) {
        const embed = new EmbedBuilder()
            .setTitle('Muffin Button')
            .setImage(gif)
            .setURL(gif)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
        message.channel.send({ embeds: [embed] })
    }
}