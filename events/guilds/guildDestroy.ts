import Event from '../../structures/Event'
import adminSchema from '../../models/admin'
import serverSchema from '../../models/serverSchema'
import { Guild } from 'discord.js'
import axios from 'axios'
import { BOTID } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

export default class extends Event {
	constructor(client: CavenBot, name='guildDestroy') {
		super(client, name)
	}

	async run(guild: Guild) {
		await adminSchema.deleteOne({ guildId: guild.id })
		await serverSchema.deleteOne({ guildId: guild.id })

		await axios.post(`https://discord.bots.gg/api/v1/bots/${BOTID}/stats`, { shards: 1, guilds: this.client.guilds.cache.size }, { headers: { 'Authorization': `${process.env.DBOTS_KEY}` } })
	}
}