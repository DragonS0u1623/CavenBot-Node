const { Schema, model } = require('mongoose')
const { reqString, discordId } = require('../structures/Types')

const joinRoleSchema = new Schema({
	guildId: discordId,
	role: reqString
})

module.exports = model('joinrole', joinRoleSchema)