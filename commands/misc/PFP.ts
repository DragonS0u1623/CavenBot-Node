import { Colors, EmbedBuilder, Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Command from '../../structures/Command'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'

export default class extends Command {
	constructor(client: CavenBot, name='pfp') {
		super(client, name, {
			category: 'Misc',
			description: 'Sends the user\'s pfp',
            guildOnly: false
		})
	}

	async run(message: Message) {
        let user = message.mentions.users.first()
        if (user == null) user = message.author

        const embed = new EmbedBuilder()
            .setTitle(`${user}'s pfp`)
            .setURL(user.avatarURL())
            .setImage(user.avatarURL())
            .setColor(Colors.Red)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })

		message.channel.send({ embeds: [embed] })
	}
}