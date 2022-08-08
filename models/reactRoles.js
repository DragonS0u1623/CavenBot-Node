const { Schema, model } = require('mongoose')
const { reqBool, discordId } = require('../structures/Types')

const reactSchema = new Schema({
	guildId: discordId,
	channelId: discordId,
	messageId: discordId,
	toggle: reqBool,
	roles: {
		type: Map,
		of: String
	}
})

module.exports = model('reactroles', reactSchema)