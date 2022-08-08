import CavenBot from "./CavenBot"

type EventOptions = {
	once?: boolean,
	emitter?: any
}

export default class Event {
	name: string
	client: CavenBot
	type: string
	emitter: any

	constructor(client: CavenBot, name: string, options: EventOptions = {
		once: false,
		emitter: client
	}) {
		this.name = name
		this.client = client
		this.type = options.once ? 'once' : 'on'
		this.emitter = options.emitter || this.client
	}

	async run(...args: any[]) {
		throw new Error(`Event ${this.name} has no run function.`)
	}
}