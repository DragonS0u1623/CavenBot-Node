import Event from '../../structures/Event'
import serverSchema, { serverSettings } from '../../models/serverSchema'
import { Colors, EmbedBuilder, GuildMember, TextChannel } from 'discord.js'
import joinRoleSChema, { joinRole } from '../../models/joinRole'
import adminSchema, { admin } from '../../models/admin'
import moment from 'moment'
import { FOOTER, OWNERPFP } from '../../utils/StaticVars'
import CavenBot from '../../structures/CavenBot'

export default class extends Event {
    constructor(client: CavenBot, name='guildMemberAdd') {
		super(client, name)
	}

	async run(member: GuildMember) {
        const { guild } = member
        const serverSettings = await serverSchema.findOne<serverSettings>({ guildId: guild.id })
        const { audits, welcome, joinrole } = serverSettings
        if ((!audits && !welcome && !joinrole) || member.user.bot) return

        const admin = await adminSchema.findOne<admin>({ guildId: guild.id })

        if (audits) {
            guild.channels.fetch(admin.audits).then((channel: TextChannel) => {
                const embed = new EmbedBuilder()
                    .setTitle(`Member Joined: ${member}`)
                    .setDescription(`Joined the server`)
                    .setThumbnail(`${member.avatarURL()}`)
                    .setColor(Colors.Green)
                    .setTimestamp()
                    .addFields(
                        { name: `Joined at`, value: `<t:${member.joinedTimestamp}>`, inline: false },
                        { name: `Created at`, value: `<t:${member.user.createdTimestamp}>`, inline: false })
                    .setFooter({ text: FOOTER, iconURL: OWNERPFP })
                
                const now = moment()
                const createDate = moment(member.user.createdAt)
                
                if (createDate.add(2, 'weeks').isAfter(now)) embed.addFields({ name: ':warning:Warning! This account is under 2 weeks old. Be careful!:warning:', value: '', inline: false })
                channel.send({ embeds: [embed] })
            })
        }

        if (welcome) {
            guild.channels.fetch(admin.welcome).then((channel: TextChannel) => {
                const embed = new EmbedBuilder()
                    .setTitle(`Member Joined: ${member}`)
                    .setDescription(`${admin.welcome_message}`)
                    .setColor(Colors.Green)
                    .setThumbnail(member.avatarURL())
                    .setTimestamp()
                    .setFooter({ text: FOOTER, iconURL: OWNERPFP })
                channel.send({ embeds: [embed] })
            })
        }

        if (joinrole) {
            const joinrole = await joinRoleSChema.findOne<joinRole>({ guildId: guild.id })
            const role = await guild.roles.fetch(joinrole.role)
            if (!member.manageable) return
            await member.roles.add(role)
        }
	}
}