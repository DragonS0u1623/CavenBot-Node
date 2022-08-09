const Event = require('../../structures/Event')
const adminSchema = require('../../models/admin')
const serverSchema = require('../../models/serverSchema')
const musicSettingsSchema = require('../../models/musicSettings')
const { BOTID } = require('../../utils/StaticVars')
const axios = require('axios')

module.exports = class extends Event {
	constructor(client, name='guildCreate') {
		super(client, name)
	}

	async run(guild) {
		new adminSchema({
			guildId: guild.id,
			audits: '0',
			welcome: '0',
			welcome_message: 'Welcome to the server',
			language: 'en_US'
		}).save()
		new serverSchema({
			guildId: guild.id,
			prefix: 'm?',
			welcome: false,
			audits: false,
			roledm: true,
			joinrole: false
		}).save()
		new musicSettingsSchema({
			guildId: guild.id,
			requesterNotInVCSkip: false
		}).save()

		await axios.post(`https://discord.bots.gg/api/v1/bots/${BOTID}/stats`, { shards: 1, guilds: this.client.guilds.cache.size }, { headers: { 'Authorization': `${process.env.DBOTS_KEY}` } })
	}
}