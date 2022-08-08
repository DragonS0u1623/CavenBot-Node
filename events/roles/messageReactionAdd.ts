import Event from './../../structures/Event'
import reactSchema, { reactRole } from './../../models/reactRoles'
import serverSchema, { serverSettings } from './../../models/serverSchema'
import { MessageReaction, User } from 'discord.js'
import CavenBot from '../../structures/CavenBot'

export default class extends Event {
	constructor(client: CavenBot, name='messageReactionAdd') {
		super(client, name)
	}

	async run(messageReaction: MessageReaction, user: User) {
		const { message } = messageReaction
		const { guild } = message
		if (!guild || user.bot) return

		const doc = await reactSchema.findOne<reactRole>({ guildId: guild.id, messageId: message.id })
		if (!doc) return

		const { roledm } = await serverSchema.findOne<serverSettings>({ guildId: guild.id })

		const { emoji } = messageReaction
		const { roles, toggle } = doc
		if (!roles.has(emoji.id) && !roles.has(emoji.name)) return

		const roleID = emoji.id === null ? roles.get(emoji.name) : roles.get(emoji.id)
		if (!roleID) return
		const role = guild.roles.resolve(roleID)

		const member = guild.members.resolve(user)
		if (!member?.manageable) return

		if (toggle)
			roles.forEach(role => {
				if (member.roles.cache.has(role) && role !== roleID) member.roles.remove(role)
			})

		await member.roles.add(roleID)
		if (roledm) user.send(`Added role \`${role?.name}\` in ${guild.name}`)
	}
}