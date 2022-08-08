import { Queue } from "discord-music-player"
import CavenBot from "../../structures/CavenBot"
import Event from '../../structures/Event'

export default class extends Event {
	constructor(client: CavenBot, name='error') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(error: string, queue: Queue) {
		const data: any = queue.data
		const { channel } = data
        console.log(`Error in ${queue.guild.name}: ${error}`)
        channel.send(`An error has occurred please try again`)
	}
}