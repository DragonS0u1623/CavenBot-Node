const { Schema, model } = require('mongoose')
const { reqBool, discordId } = require('../structures/Types')

const musicSettingsSchema = new Schema({
    guildId: discordId,
    requesterNotInVCSkip: reqBool
})

module.exports = model('musicSettings', musicSettingsSchema)