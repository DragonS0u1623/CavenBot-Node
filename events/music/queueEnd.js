const Event = require('../../structures/Event')

module.exports = class extends Event {
	constructor(client, name='queueEnd') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(queue) {
		const data = queue.data
		const { channel } = data
        channel.send(`Queue ended. You can start another song with \`m?play\` or use \`m?leave\` to make me leave the voice channel`)
	}
}