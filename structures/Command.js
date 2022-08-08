const { OWNERS: owners } = require('../utils/StaticVars')
const { ChannelType } = require('discord.js')

module.exports = class Command {
	constructor(client, name, options = {
		name: '',
		aliases: [],
		category: '',
		description: '',
		expectedArgs: '',
		ownerOnly: false,
		guildOnly: true,
		testOnly: false,
		slash: false,
		data: null
	}) {
		this.client = client
		this.name = options.name || name
		this.aliases = options.aliases || []
		this.category = options.category || 'No Category'
		this.description = options.description || ''
		this.expectedArgs = options.expectedArgs || ''
		this.guildOnly = options.guildOnly || true
		this.testOnly = options.testOnly || false
		this.slash = options.slash || false
		this.data = options.data || null
	}

	async executeSlash(interaction) {
		interaction.reply(`Command ${this.name} has no run function.`)
		throw new Error(`Command ${this.name} has no run function.`)
	}

	async execute(message, args) {
		if (this.checkCommand(message)) this.run(message, args)
		// eslint-disable-next-line max-len
		else message.channel.send(`Incorrect usage. The command should be run with the args ${this.expectedArgs} and check to make sure you're executing this in a guild. Most commands require a guild to be run.`)
	}

	async run(message, args) {
		throw new Error(`Command ${this.name} has no run function.`)
	}

	checkCommand(message) {
		if (this.ownerOnly && !owners.includes(message.author.id)) return false
		if (this.guildOnly && (message.channel.type === ChannelType.DM)) return false
		return true
	}
}
