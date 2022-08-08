import { Queue } from 'discord-music-player'
import { Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Command from '../../structures/Command'

export default class extends Command {
	constructor(client: CavenBot, name='shutdown') {
		super(client, name, {
			aliases: ['sd'],
			description: 'Shuts down the bot',
			ownerOnly: true,
			guildOnly: false
		})
	}

	async run(message: Message) {
		const reply = ':warning: Shutting down now :warning:'
		await message.channel.send(reply)
		const { player } = this.client
		player.queues.forEach((queue: Queue) => player.deleteQueue(queue.guild.id))
		this.client.destroy()
	}
}