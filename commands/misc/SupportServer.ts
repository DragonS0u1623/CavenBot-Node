import { EmbedBuilder, Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Command from '../../structures/Command'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'

export default class extends Command {
	constructor(client: CavenBot, name='support') {
		super(client, name, {
			category: 'Misc',
			description: 'Sends an embed with the invite link to the official support server',
            guildOnly: false
		})
	}

	async run(message: Message) {
        const invite = 'https://discord.gg/6TjuPYy'

        const embed = new EmbedBuilder()
            .setTitle('Invite to the Support Server')
            .setURL(invite)
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		message.author.createDM().then(channel => channel.send({ embeds: [embed] }))
	}
}