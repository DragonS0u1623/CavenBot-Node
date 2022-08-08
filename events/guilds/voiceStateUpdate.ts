import { VoiceState } from 'discord.js'
import CavenBot from '../../structures/CavenBot'
import Event from '../../structures/Event'

export default class extends Event {
	constructor(client: CavenBot, name='voiceStateUpdate') {
		super(client, name)
	}

	async run(oldState: VoiceState, newState: VoiceState) {
        const { member } = oldState
        console.log(member)
		if (member?.user?.bot) return

	}
}