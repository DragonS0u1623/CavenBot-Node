import Event from '../../structures/Event'
import adminSchema from '../../models/admin'
import serverSchema from '../../models/serverSchema'
import { Guild } from 'discord.js'
import { BOTID } from '../../utils/StaticVars'
import axios from 'axios'
import CavenBot from '../../structures/CavenBot'

export default class extends Event {
	constructor(client: CavenBot, name='guildCreate') {
		super(client, name)
	}

	async run(guild: Guild) {
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

		await axios.post(`https://discord.bots.gg/api/v1/bots/${BOTID}/stats`, { shards: 1, guilds: this.client.guilds.cache.size }, { headers: { 'Authorization': `${process.env.DBOTS_KEY}` } })
	}
}