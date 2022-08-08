import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js'
import Utils from '../utils/Utils'
import { mongo } from '../utils/mongo'
import Command from './Command'
import Event from './Event'

const intents = [
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.DirectMessageReactions,
	GatewayIntentBits.GuildVoiceStates
]

export default class CavenBot extends Client {
	commands: Collection<string, Command>
	aliases: Collection<string, string>
	slashCommands: Collection<string, Command>
	events: Collection<string, Event>
	utils: Utils
    player: any

	constructor() {
		super({
			intents: intents,
			partials: [Partials.User, Partials.Message, Partials.GuildMember, Partials.Channel, Partials.Reaction],
			presence: {
				status: 'online',
				activities: [
					{
						name: 'ready event hasn\'t started yet'
					}
				]
			}
		})

		this.commands = new Collection<string, Command>()
		this.aliases = new Collection<string, string>()
		this.slashCommands = new Collection<string, Command>()
		this.events = new Collection<string, Event>()
		this.utils = new Utils(this)

		mongo().then(() => {
			console.log('Connected to MongoDB')
		})
	}

	async start() {
		await this.utils.loadCommands()
		await this.utils.loadEvents()
		await this.utils.loadSlashCommands()
		await super.login(process.env.TOKEN)
	}
}