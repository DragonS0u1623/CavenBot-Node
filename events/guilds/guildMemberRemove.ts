import Event from '../../structures/Event'
import { Colors, EmbedBuilder, GuildMember, TextChannel } from 'discord.js'
import serverSchema, { serverSettings } from '../../models/serverSchema'
import adminSchema, { admin } from '../../models/admin'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

export default class extends Event {
    constructor(client: CavenBot, name='guildMemberRemove') {
		super(client, name)
	}

	async run(member: GuildMember) {
        const { guild } = member
        const serverSettings = await serverSchema.findOne<serverSettings>({ guildId: guild.id })
        const { audits } = serverSettings
        if (!audits || member.user.bot) return

        const admin = await adminSchema.findOne<admin>({ guildId: guild.id })

        guild.channels.fetch(admin.audits).then((channel: TextChannel) => {
            const embed = new EmbedBuilder()
                .setTitle(`Member Left: ${member}`)
                .setDescription('Left the server')
                .setThumbnail(member.avatarURL())
                .setColor(Colors.Purple)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            let rolesString = ''
            member.roles.cache.forEach(role => rolesString += `${role} `)
            embed.addFields({ name: 'Roles At Time:', value: rolesString, inline: false })

            channel.send({ embeds: [embed] })
        })
	}
}