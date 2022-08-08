import { OWNERS as owners } from '../utils/StaticVars'
import CavenBot from './CavenBot'
import { ChannelType, CommandInteraction, Message } from 'discord.js'

type CommandOptions = {
	name?: string
    aliases?: string[]
    category?: string
    description: string
    expectedArgs?: string
    ownerOnly?: boolean
    guildOnly?: boolean
    hidden?: boolean
    testOnly?: boolean
    slash?: boolean
    data?: any
}

export default class Command {
    client: CavenBot
    name: string
    aliases: string[]
    category: string
    description: string
    expectedArgs: string
    ownerOnly: boolean
    guildOnly: boolean
    testOnly: boolean
    slash: boolean
    data: any

	constructor(client: CavenBot, name: string, options: CommandOptions = {
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

	async executeSlash(interaction: CommandInteraction) {
		interaction.reply(`Command ${this.name} has no run function.`)
		throw new Error(`Command ${this.name} has no run function.`)
	}

	async execute(message: Message, args: string[]) {
		if (this.checkCommand(message)) this.run(message, args)
		// eslint-disable-next-line max-len
		else message.channel.send(`Incorrect usage. The command should be run with the args ${this.expectedArgs} and check to make sure you're executing this in a guild. Most commands require a guild to be run.`)
	}

	async run(message: Message, args: string[]) {
		throw new Error(`Command ${this.name} has no run function.`)
	}

	checkCommand(message: Message) {
		if (this.ownerOnly && !owners.includes(message.author.id)) return false
		if (this.guildOnly && (message.channel.type === ChannelType.DM)) return false
		return true
	}
}
