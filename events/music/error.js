const Event = require('../../structures/Event')

module.exports = class extends Event {
	constructor(client, name='error') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(error, queue) {
		const data = queue.data
		const { channel } = data
        console.log(`Error in ${queue.guild.name}: ${error}`)
        channel.send(`An error has occurred please try again`)
	}
}