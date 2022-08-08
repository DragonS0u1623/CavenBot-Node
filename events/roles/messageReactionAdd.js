const Event = require('./../../structures/Event')
const reactSchema = require('./../../models/reactRoles')
const serverSchema = require('./../../models/serverSchema')

module.exports = class extends Event {
	constructor(client, name='messageReactionAdd') {
		super(client, name)
	}

	async run(messageReaction, user) {
		const { message } = messageReaction
		const { guild } = message
		if (!guild || user.bot) return

		const doc = await reactSchema.findOne({ guildId: guild.id, messageId: message.id })
		if (!doc) return

		const { roledm } = await serverSchema.findOne({ guildId: guild.id })

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