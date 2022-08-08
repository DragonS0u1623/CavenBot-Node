const Event = require('./../../structures/Event')
const reactSchema = require('./../../models/reactRoles')
const serverSchema = require('./../../models/serverSchema')

module.exports = class extends Event {
	constructor(client, name='messageReactionRemove') {
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
		const { roles } = doc
		if (!roles.has(emoji.id) && !roles.has(emoji.name)) return

		const roleID = emoji.id === null ? roles.get(emoji.name) : roles.get(emoji.id)
		const role = guild.roles.resolve(roleID)

		const member = guild.members.resolve(user)
		if (!member?.manageable) return

		if (!member.roles.cache.has(roleID)) return

		await member.roles.remove(roleID)
		if (roledm) user.send(`Removed role \`${role.name}\` in ${guild.name}`)
	}
}