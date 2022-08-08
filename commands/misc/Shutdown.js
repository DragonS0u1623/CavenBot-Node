const Command = require('../../structures/Command')

module.exports = class extends Command {
	constructor(client, name='shutdown') {
		super(client, name, {
			aliases: ['sd'],
			description: 'Shuts down the bot',
			ownerOnly: true,
			guildOnly: false
		})
	}

	async run(message) {
		const reply = ':warning: Shutting down now :warning:'
		await message.channel.send(reply)
		const { player } = this.client
		player.queues.forEach((queue) => player.deleteQueue(queue.guild.id))
		this.client.destroy()
	}
}