import { ChatInputCommandInteraction, Colors, EmbedBuilder, Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Command from '../../structures/Command'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'

const gif = 'https://cdn.discordapp.com/attachments/640674672618373132/711291888594059354/tenor-4.gif'

export default class extends Command {
	constructor(client: CavenBot, name='nani') {
		super(client, name, {
			category: 'Misc',
			description: 'Sends an anime joke response',
            guildOnly: false
		})
	}

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()

        const embed = new EmbedBuilder()
            .setTitle('NANI!!!!!!!')
            .setURL(gif)
            .setImage(gif)
            .setColor(Colors.Yellow)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
        interaction.editReply({ embeds: [embed] })
    }

	async run(message: Message) {
        const embed = new EmbedBuilder()
            .setTitle('NANI!!!!!!!')
            .setURL(gif)
            .setImage(gif)
            .setColor(Colors.Red)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		message.channel.send({ embeds: [embed] })
	}
}