import { Colors, EmbedBuilder, Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Command from '../../structures/Command'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'

const gif = 'https://cdn.discordapp.com/attachments/716088303622946846/737578915236937768/general_Grievous.gif'

export default class extends Command {
    constructor(client: CavenBot, name='general_kenobi') {
        super(client, name, {
            aliases: ['gk', 'general', 'kenobi', 'general kenobi'],
            description: 'Sends a gif from Star Wars'
        })
    }

    async run(message: Message) {
        const embed = new EmbedBuilder()
            .setTitle('General Kenobi')
            .setURL(gif)
            .setImage(gif)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		message.channel.send({ embeds: [embed] })
	}
}