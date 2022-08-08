import { Colors, EmbedBuilder, Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Command from '../../structures/Command'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'

export default class extends Command {
	constructor(client: CavenBot, name='botpfp') {
		super(client, name, {
			name: 'botpfp',
			category: 'Misc',
			description: 'Sends the bot\'s pfp',
			guildOnly: false
		})
	}

	async run(message: Message) {
        const embed = new EmbedBuilder()
            .setTitle('CavenBot\'s pfp')
            .setURL(message.client.user.avatarURL())
            .setImage(message.client.user.avatarURL())
            .setColor(Colors.Red)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })

		message.channel.send({ embeds: [embed] })
	}
}