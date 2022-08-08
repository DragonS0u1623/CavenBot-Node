import { Queue } from 'discord-music-player'
import CavenBot from '../../structures/CavenBot.js'
import Event from '../../structures/Event.js'

export default class extends Event {
	constructor(client: CavenBot, name='queueEnd') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(queue: Queue) {
		const data: any = queue.data
		const { channel } = data
        channel.send(`Queue ended. You can start another song with \`m?play\` or use \`m?leave\` to make me leave the voice channel`)
	}
}