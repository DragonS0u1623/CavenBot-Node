const { EmbedBuilder } = require('discord.js')
const Command = require('../../structures/Command')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

module.exports = class extends Command {
	constructor(client, name='support') {
		super(client, name, {
			category: 'Misc',
			description: 'Sends an embed with the invite link to the official support server',
            guildOnly: false
		})
	}

	async run(message) {
        const invite = 'https://discord.gg/6TjuPYy'

        const embed = new EmbedBuilder()
            .setTitle('Invite to the Support Server')
            .setURL(invite)
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		message.author.createDM().then(channel => channel.send({ embeds: [embed] }))
	}
}