import Command from '../../structures/Command'
import blacklistSchema from '../../models/blacklist'
import { Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
	constructor(client: CavenBot, name='blacklist') {
		super(client, name, {
			category: 'Anon',
			description: 'Blacklists the channel or the user from using anon commands',
			expectedArgs: '[user/channel]'
		})
	}

	async run(message: Message, args: string[]) {
		const { guild } = message
		if (!args.length) {
			message.channel.send(`You need to tag either a member or channel for this command`)
			return
		}
		let tag = args.shift()
		const isChannel = tag.startsWith('<#')
		const isUser = tag.startsWith('<@')

		if (!isUser && !isChannel) {
			const channel = await guild.channels.fetch(tag)
			if (!channel) {
				const user = await guild.members.fetch(tag)
				if (!user) {
					message.channel.send(`You need to give either the ID or tag a member or channel for this command. Please make sure that the ID given is correct`)
					return
				}

				const doc = await blacklistSchema.findOne({ guildId: guild.id })
				if (!doc) {
					new blacklistSchema({
						guildId: guild.id,
						channels: [],
						users: [user.id]
					}).save()
					message.channel.send(`Blacklisted the user ${user}`)
					return
				}

				const { users } = doc
				if (users.includes(user.id)) {
					message.channel.send(`That user is already blacklisted from anon commands`)
					return
				}

				await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $push: { users: user.id } })
				message.channel.send(`Blacklisted the user ${user}`)
				return
			}

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) {
				new blacklistSchema({
					guildId: guild.id,
					channels: [channel.id],
					users: []
				}).save()
				message.channel.send(`Blacklisted the channel ${channel}`)
				return
			}

			const { channels } = doc
			if (channels.includes(channel.id)) {
				message.channel.send(`That channel is already blacklisted from anon commands`)
				return
			}

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $push: { channels: channel.id } })
			message.channel.send(`Blacklisted the channel ${channel}`)
		} else if (isChannel) {
			tag = tag.slice(2, tag.length - 1)
			const channel = await guild.channels.fetch(tag)
			if (!channel) {
				message.channel.send(`Please tag a channel within this server`)
				return
			}

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) {
				new blacklistSchema({
					guildId: guild.id,
					channels: [channel.id],
					users: []
				}).save()
				message.channel.send(`Blacklisted the channel ${channel}`)
				return
			}

			const { channels } = doc
			if (channels.includes(channel.id)) {
				message.channel.send(`That channel is already blacklisted from anon commands`)
				return
			}

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $push: { channels: channel.id } })
			message.channel.send(`Blacklisted the channel ${channel}`)
		} else if (isUser) {
			tag = tag.slice(2, tag.length - 1)
			const user = await guild.members.fetch(tag)
			if (!user) {
				message.channel.send(`Please tag a user in this server`)
				return
			}

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) {
				new blacklistSchema({
					guildId: guild.id,
					channels: [],
					users: [user.id]
				}).save()
				message.channel.send(`Blacklisted the user ${user}`)
				return
			}

			const { users } = doc
			if (users.includes(user.id)) {
				message.channel.send(`That user is already blacklisted from anon commands`)
				return
			}

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $push: { users: user.id } })
			message.channel.send(`Blacklisted the user ${user}`)
		}
	}
}