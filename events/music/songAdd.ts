import { Queue, Song } from "discord-music-player"
import CavenBot from "../../structures/CavenBot"
import Event from '../../structures/Event'

export default class extends Event {
	constructor(client: CavenBot, name='songAdd') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(queue: Queue, song: Song) {
		const data: any = queue.data
		const { channel } = data
        const { requestedBy } = song
        channel.send(`${song} added to the queue by ${requestedBy}`)
	}
}