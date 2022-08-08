const Event = require('../../structures/Event.js')

module.exports = class extends Event {
	constructor(client, name='songFirst') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(queue, song) {
		const data = queue.data
		const { channel } = data
        channel.send(`${song} is now playing.`)
	}
}