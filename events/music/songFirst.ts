import { Queue, Song } from 'discord-music-player'
import CavenBot from '../../structures/CavenBot.js'
import Event from '../../structures/Event.js'

export default class extends Event {
	constructor(client: CavenBot, name='songFirst') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(queue: Queue, song: Song) {
		const data: any = queue.data
		const { channel } = data
        channel.send(`${song} is now playing.`)
	}
}