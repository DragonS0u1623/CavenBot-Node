const { Colors, EmbedBuilder } = require('discord.js')
const Command = require('../../structures/Command')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

module.exports = class extends Command {
	constructor(client, name='pfp') {
		super(client, name, {
			category: 'Misc',
			description: 'Sends the user\'s pfp',
            guildOnly: false
		})
	}

	async run(message) {
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