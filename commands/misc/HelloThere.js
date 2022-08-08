const { EmbedBuilder, Colors } = require('discord.js')
const Command = require('../../structures/Command')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

const gif = 'https://cdn.discordapp.com/attachments/716088303622946846/737578683203584030/Hello_There.gif'

module.exports = class extends Command {
	constructor(client, name='hello_there') {
		super(client, name, {
            aliases: ['hello', 'hello there'],
			category: 'Misc',
			description: 'Sends an embed with a Star Wars gif on it',
            guildOnly: false
		})
	}

	async run(message) {
        const embed = new EmbedBuilder()
            .setTitle('Hello There')
            .setURL(gif)
            .setImage(gif)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		message.channel.send({ embeds: [embed] })
	}
}