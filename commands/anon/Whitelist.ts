import Command from '../../structures/Command'
import blacklistSchema from '../../models/blacklist.js'
import { Message } from 'discord.js'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
	constructor(client: CavenBot, name='whitelist') {
		super(client, name, {
			category: 'Anon',
			description: 'Whitelists the channel or the user from using anon commands',
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
					message.channel.send(`There are no blacklisted users or channels in your server`)
					return
				}

				const { users } = doc
				if (!users.includes(user.id)) {
					message.channel.send(`That user is not blacklisted from anon commands`)
					return
				}

				await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $pull: { users: user.id } })
				message.channel.send(`Whitelisted the user ${user}`)
				return
			}

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) {
				message.channel.send(`There are no blacklisted users or channels in your server`)
				return
			}

			const { channels } = doc
			if (!channels.includes(channel.id)) {
				message.channel.send(`That channel is not blacklisted from anon commands`)
				return
			}

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $pull: { channels: channel.id } })
			message.channel.send(`Whitelisted the channel ${channel}`)
		} else if (isChannel) {
			tag = tag.slice(2, tag.length - 1)
			const channel = await guild.channels.fetch(tag)
			if (!channel) {
				message.channel.send(`Please tag a channel within this server`)
				return
			}

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) {
				message.channel.send(`There are no blacklisted users or channels in your server`)
				return
			}

			const { channels } = doc
			if (!channels.includes(channel.id)) {
				message.channel.send(`That channel is not blacklisted from anon commands`)
				return
			}

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $pull: { channels: channel.id } })
			message.channel.send(`Whitelisted the channel ${channel}`)
		} else if (isUser) {
			tag = tag.slice(2, tag.length - 1)
			const user = await guild.members.fetch(tag)
			if (!user) {
				message.channel.send(`Please tag a user in this server`)
				return
			}

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) {
				message.channel.send(`There are no blacklisted users or channels in your server`)
				return
			}

			const { users } = doc
			if (!users.includes(user.id)) {
				message.channel.send(`That user is not blacklisted from anon commands`)
				return
			}

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $pull: { users: user.id } })
			message.channel.send(`Whitelisted the user ${user}`)
		}
	}
}