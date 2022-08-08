const Event = require('../../structures/Event')

module.exports = class extends Event {
	constructor(client, name='songAdd') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(queue, song) {
		const data = queue.data
		const { channel } = data
        const { requestedBy } = song
        channel.send(`${song} added to the queue by ${requestedBy}`)
	}
}