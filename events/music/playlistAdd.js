const Event = require('../../structures/Event')

module.exports = class extends Event {
	constructor(client, name='playlistAdd') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(queue, playlist) {
		const data = queue.data
		const { channel } = data
        channel.send(`Playlist ${playlist} added to queue`)
	}
}