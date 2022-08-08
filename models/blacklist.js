const { Schema, model } = require('mongoose')
const { discordId } = require('../structures/Types')

const blacklistSchema = new Schema({
	guildId: discordId,
	channels: [String],
	users: [String]
})

module.exports = model('blacklist', blacklistSchema)