const { Schema, model } = require('mongoose')
const { reqString, reqBool, discordId } = require('../structures/Types')

const serverSchema = new Schema({
	guildId: discordId,
	prefix: reqString,
	welcome: reqBool,
	audits: reqBool,
	roledm: reqBool,
	joinrole: reqBool,
	customVC: reqBool
})

module.exports = model('serversettings', serverSchema)