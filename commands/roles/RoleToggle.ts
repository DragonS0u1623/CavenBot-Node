import Command from '../../structures/Command'
import reactSchema, { reactRole } from '../../models/reactRoles'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction, Message, TextChannel } from 'discord.js'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
	constructor(client: CavenBot, name='roletoggle') {
		super(client, name, {
			category: 'React Roles',
			description: 'Sets whether roles on this message id toggle on or off',
			expectedArgs: '[channel ID] [message ID]',
			slash: true,
			data: new SlashCommandBuilder().setName('roletoggle')
				.setDescription('Sets whether roles on this message id toggle on or off')
				.addChannelOption((option) => option.setName('channel').setDescription('The channel the message is in.').setRequired(true))
				.addStringOption((option) => option.setName('message').setDescription('The message ID for the message that you want to toggle react roles for').setRequired(true))
				.addBooleanOption((option) => option.setName('enable').setDescription(`Enable or Disable toggle for this message's react roles`).setRequired(false))
		})
	}

	async executeSlash(interaction: ChatInputCommandInteraction) {
		interaction.deferReply()
		const { guild } = interaction
		const { id } = interaction.options.getChannel('channel')
		const messageID = interaction.options.getString('message')

		guild.channels.fetch(id).then(async (channel: TextChannel) => {
			const message = await channel.messages.fetch(messageID)
			if (!message) {
				interaction.editReply('The message ID you provided did not give a message. Please check to make sure you gave the correct channel and ID')
				return
			}

			const doc = await reactSchema.findOne<reactRole>({ guildId: guild.id, channelId: channel.id, messageId: messageID })
			if (!doc) {
				interaction.editReply(`There are no react roles set up for this message, channel, or the server`)
				return
			}

			let toggle: string | boolean = interaction.options.getBoolean('enable') || null
			if (toggle === null) toggle = !doc.toggle

			await reactSchema.findOneAndUpdate({ guildId: guild.id }, { channels: { [`${channel.id}`]: { messages: { [`${messageID}`]: { toggle } } } } })
			interaction.editReply(`${toggle ? 'Enabled' : 'Disabled'} toggle for reaction roles.`)
		})
	}

	async run(message: Message, args: string[]) {
		const { guild } = message
		let channelStr = args.shift()
		if (channelStr.startsWith('<#'))
			channelStr = channelStr.slice(2, channelStr.length - 1)
		guild.channels.fetch(channelStr).then(async (channel: TextChannel) => {
			const messageID = args.shift()
			const reactMessage = await channel.messages.fetch(messageID)
			if (!reactMessage) {
				message.channel.send('The message ID you provided did not give a message. Please check to make sure you gave the correct channel and ID')
				return
			}

			const doc = await reactSchema.findOne<reactRole>({ guildId: guild.id, channelId: channel.id, messageId: messageID })
			if (!doc) {
				message.channel.send(`There are no react roles set up for this message, channel or for the server`)
				return
			}

			let toggle: string | boolean = args.shift() || null
			if (toggle === null) toggle = !doc.toggle

			await reactSchema.findOneAndUpdate({ guildId: guild.id, channelId: channel.id, messageId: messageID }, { toggle })
			message.channel.send(`${toggle ? 'Enabled' : 'Disabled'} toggle for reaction roles.`)
		})
	}
}