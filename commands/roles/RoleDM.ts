import Command from '../../structures/Command'
import serverSchema, { serverSettings } from '../../models/serverSchema'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction, Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
	constructor(client: CavenBot, name='roledm') {
		super(client, name, {
			category: 'React Roles',
			description: 'Toggles the DM settings for role reactions. By default this is enabled',
			slash: true,
			data: new SlashCommandBuilder().setName('roledm').setDescription('Toggles the DM settings for role reactions. By default this is enabled')
				.addBooleanOption((option) => option.setName('enable').setDescription('Enable or Disable DM messages for react roles').setRequired(false))
		})
	}

	async executeSlash(interaction: ChatInputCommandInteraction) {
		interaction.deferReply()
		const { guild } = interaction

		const doc = await serverSchema.findOne<serverSettings>({ guildId: guild.id })

		let dm: boolean = interaction.options.getBoolean('enable') || null
		if (dm === null) dm = !doc.roledm

		await serverSchema.findOneAndUpdate({ guildId: guild.id }, { roledm: dm })
		interaction.editReply(`${dm ? 'Enabled' : 'Disabled'} DM messages for role reactions in this server.`)
	}

	async run(message: Message, args: string[]) {
		const { guild } = message

		const doc = await serverSchema.findOne<serverSettings>({ guildId: guild.id })

		let dm: boolean = (args.shift() === 'true' || args.shift() === 'on') || null
		if (dm === null) dm = !doc.roledm

		await serverSchema.findOneAndUpdate({ guildId: guild.id }, { roledm: dm })
		message.channel.send(`${dm ? 'Enabled' : 'Disabled'} DM messages for role reactions in this server.`)
	}
}