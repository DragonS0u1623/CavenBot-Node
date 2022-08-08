import CavenBot from '../structures/CavenBot'
import Event from '../structures/Event'

export default class extends Event {
	constructor(client: CavenBot, name='ready') {
		super(client, name, {
			once: true
		})
	}

	async run() {
		console.log([
			`Logged in as ${this.client.user?.username}`,
			`Loaded ${this.client.commands.size} commands`,
			`Loaded ${this.client.events.size} events`
		].join('\n'))

		this.client.utils.updateStatus()
	}
}