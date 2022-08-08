const Event = require('../../structures/Event')
const adminSchema = require('../../models/admin')
const serverSchema = require('../../models/serverSchema')
const { BOTID } = require('../../utils/StaticVars')
const axios = require('axios')

module.exports = class extends Event {
	constructor(client, name='guildDestroy') {
		super(client, name)
	}

	async run(guild) {
		await adminSchema.deleteOne({ guildId: guild.id })
		await serverSchema.deleteOne({ guildId: guild.id })

		await axios.post(`https://discord.bots.gg/api/v1/bots/${BOTID}/stats`, { shards: 1, guilds: this.client.guilds.cache.size }, { headers: { 'Authorization': `${process.env.DBOTS_KEY}` } })
	}
}