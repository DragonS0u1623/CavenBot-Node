const { Schema, model } = require('mongoose')
const { reqString, reqNum, discordId } = require('../structures/Types')

const remindSchema = new Schema({
	guildId: discordId,
	userId: reqString,
	reminders: [
		{
			num: reqNum,
			reminder: reqString
		}
	]
})

module.exports = model('reminders', remindSchema)