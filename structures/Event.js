module.exports = class Event {
	constructor(client, name, options = {
		once: false,
		emitter: client
	}) {
		this.name = name
		this.client = client
		this.type = options.once ? 'once' : 'on'
		this.emitter = options.emitter || this.client
	}

	async run(...args) {
		throw new Error(`Event ${this.name} has no run function.`)
	}
}