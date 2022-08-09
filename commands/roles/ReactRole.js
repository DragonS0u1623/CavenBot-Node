const Command = require('../../structures/Command')
const reactSchema = require('../../models/reactRoles')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
	constructor(client, name='reactroles') {
		super(client, name, {
			aliases: ['rr', 'react'],
			category: 'React Roles',
			description: 'Adds or removes react roles from a specific message',
			expectedArgs: '[add | remove] [channel ID] [message ID] [role] [emoji] <toggle>',
			slash: true,
			data: new SlashCommandBuilder().setName('reactroles')
				.setDescription('Adds or removes react roles from a specific messaage')
				.addSubcommand((subcommand) => subcommand.setName('add').setDescription('Adds a react role to the given message.')
					.addChannelOption((option) => option.setName('channel').setDescription('The channel the message is in.').setRequired(true))
					.addStringOption((option) => option.setName('message').setDescription('The message ID for the message to react to.').setRequired(true))
					.addRoleOption((option) => option.setName('role').setDescription('The role to add to the users who react.').setRequired(true))
					.addStringOption((option) => option.setName('emoji').setDescription('The emoji to react with. Due to discord API limitations please use global or server emotes.').setRequired(true))
					.addBooleanOption((option) => option.setName('toggle').setDescription('Whether to toggle roles for this message. This only has to be set once.').setRequired(false))
				)
				.addSubcommand((subcommand) => subcommand.setName('remove').setDescription('Removes a react role from the message.')
					.addChannelOption((option) => option.setName('channel').setDescription('The channel the message is in.').setRequired(true))
					.addStringOption((option) => option.setName('message').setDescription('The message ID to remove the reaction from.').setRequired(true))
					.addStringOption((option) => option.setName('emoji').setDescription('The emoji to remove').setRequired(true))
				)
		})
	}

	async executeSlash(interaction) {
		await interaction.deferReply()
		const { guild } = interaction

		if (interaction.options.getSubcommand() === 'add') {
			console.log('Add subcommand')
			const { id } = interaction.options.getChannel('channel', true)
			const messageID = interaction.options.getString('message')
			guild.channels.fetch(id).then(async (channel) => {
				const message = await channel.messages.fetch(messageID)
				if (!message) {
					interaction.editReply('The message ID you provided did not give a message. Please check to make sure you gave the correct channel and ID')
					return
				}
				const role = interaction.options.getRole('role')
				let emoji = interaction.options.getString('emoji')
				const reactEmoji = emoji
				if (emoji.startsWith('<a:') || emoji.startsWith('<:'))
					emoji = emoji.split(':')[2].replace('>', '')

				let toggle = interaction.options.getBoolean('toggle') || false

				let doc = await reactSchema.findOne({ guildId: guild.id, messageId: messageID })
				if (!doc) {
					console.log('No doc found. Making a new one')
					new reactSchema({
						guildId: guild.id,
						channelId: channel.id,
						messageId: messageID,
						toggle: toggle,
						roles: {
							[`${emoji}`]: role.id
						}
					}).save()
					if (reactEmoji.startsWith('<a:') || reactEmoji.startsWith('<:'))
						emoji = guild.emojis.cache.get(emoji)
					await message.react(emoji)
					interaction.editReply('Added reaction to message')
					return
				}
				const { roles } = doc
				roles.set(`${emoji}`, role.id)
				if (doc.toggle) toggle = true
				await reactSchema.findOneAndUpdate({ guildId: guild.id, messageId: messageID }, { toggle, roles })
				if (reactEmoji.startsWith('<a:') || reactEmoji.startsWith('<:'))
					emoji = guild.emojis.cache.get(emoji)
				await message.react(emoji)
				interaction.editReply('Added reaction to message')
			})
		} else if (interaction.options.getSubcommand() === 'remove') {
			const { id } = interaction.options.getChannel('channel')
			const messageID = interaction.options.getString('message')
			guild.channels.fetch(id).then(async (channel) => {
				const message = await channel.messages.fetch(messageID)
				if (!message) {
					interaction.channel.send('The message ID you provided did not give a message. Please check to make sure you cave the correct channel and ID')
					return
				}
				let emoji = interaction.options.getString('emoji')
				const reactEmoji = emoji
				if (emoji.startsWith('<a:') || emoji.startsWith('<:'))
					emoji = emoji.split(':')[2].replace('>', '')
				let doc = await reactSchema.findOne({ guildId: guild.id, messageId: messageID })
				if (!doc) {
					interaction.editReply('There are no react roles set up for this server.')
					return
				}

				const { roles } = doc
				if (!roles.has(emoji)) {
					interaction.editReply(`There is no role reaction set up for that message with the emoji ${reactEmoji}`)
					return
				}

				let role = roles.get(emoji)
				roles.delete(emoji)

				if (!roles.size) await reactSchema.findOneAndDelete({ guildId: guild.id, messageId: messageID })
				else await reactSchema.findOneAndUpdate({ guildId: guild.id, messageId: messageID }, { roles })

				role = await guild.roles.fetch(role)
				await message.reactions.resolve(emoji).users.remove(this.client.user.id)
				interaction.editReply(`Removed react role for ${role}`)
			})
		} else interaction.editReply(`Please use one of the subcommands \`add\` or \`remove\` for this command.`)
	}

	async run(message, args) {
		const { guild } = message
		if (!args.length || (args[0] !== 'add' && args[0] !== 'remove')) {
			message.channel.send('You need to provide the arguments of `add` or `remove`, the channel, message, role and emoji if you are adding')
			return
		}

		if (args[0] === 'add') {
			args.shift()
			let channelStr = args.shift()
			if (channelStr.startsWith('<#'))
				channelStr = channelStr.slice(2, channelStr.length - 1)
			guild.channels.fetch(channelStr).then(async (channel) => {
				if (!channel) {
					message.channel.send(`The channel ID you gave didn't give a channel. Please tag the channel or make sure that the ID is correct.`)
					return
				}
				const messageID = args.shift()
				const reactMessage = await channel.messages.fetch(messageID)
				if (!reactMessage) {
					message.channel.send('The message ID you provided did not give a message. Please check to make sure you gave the correct channel and ID')
					return
				}
				let roleStr = args.shift()
				if (roleStr.startsWith('<@&'))
					roleStr = roleStr.slice(3, roleStr.length - 1)
				const role = await guild.roles.fetch(roleStr)
				if (!role) {
					message.channel.send(`The role ID you gave didn't give an id. Try tagging the role or check to make sure that the ID is correct.`)
					return
				}
				let emoji = args.shift()
				const reactEmoji = emoji
				if (emoji.startsWith('<a:') || emoji.startsWith('<:'))
					emoji = emoji.split(':')[2].replace('>', '')
				
				let toggle = args.shift()
				toggle = (toggle === 'true' || toggle === 'on')

				let doc = await reactSchema.findOne({ guildId: guild.id, messageId: messageID })
				if (!doc) {
					new reactSchema({
						guildId: guild.id,
						channelId: channel.id,
						messageId: messageID,
						toggle: toggle,
						roles: {
							[`${emoji}`]: role.id
						}
					}).save()
					if (reactEmoji.startsWith('<a:') || reactEmoji.startsWith('<:'))
						emoji = guild.emojis.cache.get(emoji)
					await reactMessage.react(emoji)
					message.channel.send('Added reaction to message')
					return
				}

				const { roles } = doc
				roles.set(`${emoji}`, role.id)
				if (doc.toggle) toggle = true
				await reactSchema.findOneAndUpdate({ guildId: guild.id, messageId: messageID }, { toggle, roles })
				if (reactEmoji.startsWith('<a:') || reactEmoji.startsWith('<:'))
					emoji = guild.emojis.cache.get(emoji)
				await reactMessage.react(emoji)
				message.channel.send('Added reaction to message')
			})
		} else if (args[0] === 'remove') {
			args.shift()
			let channelStr = args.shift()
			if (channelStr.startsWith('<#'))
				channelStr = channelStr.slice(2, channelStr.length - 1)
			guild.channels.fetch(channelStr).then(async (channel) => {
				const messageID = args.shift()
				const reactMessage = await channel.messages.fetch(messageID)
				if (!reactMessage) {
					message.channel.send('The message ID you provided did not give a message. Please check to make sure you cave the correct channel and ID')
					return
				}

				let emoji = args.shift()
				const reactEmoji = emoji
				if (emoji.startsWith('<a:') || emoji.startsWith('<:'))
					emoji = emoji.split(':')[2].replace('>', '')
				let doc = await reactSchema.findOne({ guildId: guild.id, messageId: messageID })
				if (!doc) {
					message.channel.send('There are no react roles set up for this server.')
					return
				}

				const { roles, toggle } = doc
				if (!roles.has(emoji)) {
					message.channel.send(`There is no role reaction set up for that message with the emoji ${reactEmoji}`)
					return
				}

				let role = roles.get(emoji)
				roles.delete(emoji)

				if (!roles.size) await reactSchema.deleteOne({ guildId: guild.id, messageId: messageID })
				else await reactSchema.findOneAndUpdate({ guildId: guild.id }, { guildId: guild.id, channelId: channel.id, messageId: messageID, toggle, roles }, { overwrite: true })

				role = await guild.roles.fetch(role)
				if (reactMessage.reactions.resolve(emoji))
					reactMessage.reactions.resolve(emoji).users.remove(this.client.user.id)
				message.channel.send(`Removed react role for ${role}`)
			})
		}
	}
}