import Event from '../../structures/Event'
import musicSettingsSchema, { musicSettings } from '../../models/musicSettings'
import CavenBot from '../../structures/CavenBot'
import { Queue, Song } from 'discord-music-player'

module.exports = class extends Event {
	constructor(client: CavenBot, name='songChanged') {
		super(client, name, {
			once: false,
			emitter: client.player
		})
	}

	async run(queue: Queue, newSong: Song, oldSong: Song) {
		const data: any = queue.data
		const { channel, vc } = data
		const { requestedBy } = newSong
		const {requesterNotInVCSkip: shouldSkip} = await musicSettingsSchema.findOne<musicSettings>({ guildId: queue.guild.id })
		if (!vc.members.has(requestedBy) && shouldSkip) {
			queue.skip()
			return channel.send(`Song skipped due to requester no longer being in voice channel`)
		}
	    channel.send(`Song ended. New song ${newSong}`)
	}
}