import { Playlist, Queue } from 'discord-music-player'
import CavenBot from '../../structures/CavenBot.js'
import Event from '../../structures/Event.js'

export default class extends Event {
	constructor(client: CavenBot, name='playlistAdd') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(queue: Queue, playlist: Playlist) {
		const data: any = queue.data
		const { channel } = data
        channel.send(`Playlist ${playlist} added to queue`)
	}
}