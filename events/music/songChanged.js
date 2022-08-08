const Event = require('../../structures/Event')
const musicSettingsSchema = require('../../models/musicSettings')

module.exports = class extends Event {
	constructor(client, name='songChanged') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(queue, newSong, oldSong) {
		const data = queue.data
		const { channel, vc } = data
		const { requestedBy } = newSong
		const {requesterNotInVCSkip: shouldSkip} = await musicSettingsSchema.findOne({ guildId: queue.guild.id })
		if (!vc.members.has(requestedBy) && shouldSkip) {
			queue.skip()
			return channel.send(`Song skipped due to requester no longer being in voice channel`)
		}
	    channel.send(`Song ended. New song ${newSong}`)
	}
}