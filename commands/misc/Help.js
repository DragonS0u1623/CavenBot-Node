const Command = require('../../structures/Command')

module.exports = class extends Command {
	constructor(client, name='help') {
		super(client, name, {
			category: 'Misc',
			description: 'Sends the commands page',
            guildOnly: false
		})
	}

	async run(message) {
        const invite = 'https://cavenbot-website.herokuapp.com/commands'
		message.channel.send(invite)
	}
}