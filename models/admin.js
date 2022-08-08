const { Schema, model } = require('mongoose')
const { reqString, discordId } = require('../structures/Types')

const adminSchema = new Schema({
	guildId: discordId,
	audits: reqString,
	welcome: reqString,
	welcome_message: reqString,
	language: reqString,
	customVC: reqString
})

module.exports = model('admin', adminSchema)