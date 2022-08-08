const { Colors, EmbedBuilder } = require('discord.js')
const Command = require('../../structures/Command')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

module.exports = class extends Command {
	constructor(client, name='botpfp') {
		super(client, name, {
			name: 'botpfp',
			category: 'Misc',
			description: 'Sends the bot\'s pfp',
			guildOnly: false
		})
	}

	async run(message) {
        const embed = new EmbedBuilder()
            .setTitle('CavenBot\'s pfp')
            .setURL(message.client.user.avatarURL())
            .setImage(message.client.user.avatarURL())
            .setColor(Colors.Red)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })

		message.channel.send({ embeds: [embed] })
	}
}