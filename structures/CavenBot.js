const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js')
const Utils = require('../utils/Utils')
const mongo = require('../utils/mongo')

const intents = [
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.DirectMessageReactions,
	GatewayIntentBits.GuildVoiceStates
]

module.exports = class CavenBot extends Client {
	constructor() {
		super({
			intents: intents,
			partials: [Partials.User, Partials.Message, Partials.GuildMember, Partials.Channel, Partials.Reaction],
			presence: {
				status: 'online',
				activities: [
					{
						name: 'm?help'
					}
				]
			}
		})

		this.commands = new Collection()
		this.aliases = new Collection()
		this.slashCommands = new Collection()
		this.events = new Collection()
		this.utils = new Utils(this)

		mongo().then(() => {
			console.log('Connected to MongoDB')
		})
	}

	async start() {
		await this.utils.loadCommands()
		await this.utils.loadEvents()
		await this.utils.loadSlashCommands()
        await this.utils.loadTestSlashCommands()
		super.login(process.env.TOKEN)
	}
}