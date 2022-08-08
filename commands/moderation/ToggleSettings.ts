import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Message, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import serverSchema, { serverSettings } from '../../models/serverSchema'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
    constructor(client: CavenBot, name='settings') {
        super(client, name, {
            category: 'Moderation',
            description: 'Command to toggle on and off different settings for the bot.\nSettings to change:\n\t`Audits`\n\t`Welcome`',
            expectedArgs: '<audits/welcome>',
            slash: true,
            data: new SlashCommandBuilder().setName('settings')
                .setDescription('Command to toggle on and off different settings for the bot.\nSettings to change:\n\t`Audits`\n\t`Welcome`')
                .addStringOption(option => option.setName('option').setDescription('Enable or disable Audits or Welcome Messages or both')
                    .setChoices(
                        {name: 'AUDITS', value: 'AUDITS'}, 
                        {name: 'WELCOME', value: 'WELCOME'},
                        {name: 'BOTH', value: 'BOTH'}
                    ).setRequired(true))
                .setDMPermission(false)
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        const { guild } = interaction

        const { welcome, audits } = await serverSchema.findOne<serverSettings>({ guildId: guild.id })
        switch(interaction.options.getString('option')) {
            case 'AUDITS':
                serverSchema.findOneAndUpdate<serverSettings>({ guildId: guild.id }, { audits: !audits })
                interaction.editReply(`Audit messages have been ${!audits ? 'enabled' : 'disabled' }`)
                break
            case 'WELCOME':
                serverSchema.findOneAndUpdate<serverSettings>({ guildId: guild.id }, { welcome: !welcome })
                interaction.editReply(`Welcome messages have been ${!welcome ? 'enabled' : 'disabled' }`)
                break
            case 'BOTH':
                serverSchema.findOneAndUpdate<serverSettings>({ guildId: guild.id }, { audits: !audits, welcome: !welcome })
                interaction.editReply(`Audit messages have been ${!audits ? 'enabled' : 'disabled' }\nWelcome messages have been ${!welcome ? 'enabled' : 'disabled' }`)
                break
            default:
                interaction.editReply(`You need to choose a correct argument for this command`)
                break
        }
    }

    async run(message: Message, args: string[]) {
        const { guild, member } = message

        if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            message.channel.send(`You don't have permission to use this command`)
			return
		}

        if (!args) {
           message.channel.send(`You need to add more arguments from one of the settings options`)
           return
        }

        const { welcome, audits } = await serverSchema.findOne<serverSettings>({ guildId: guild.id })
        switch (args[0].toUpperCase()) {
            case 'AUDITS':
                serverSchema.findOneAndUpdate<serverSettings>({ guildId: guild.id }, { audits: !audits })
                message.channel.send(`Audit messages have been ${!audits ? 'enabled' : 'disabled' }`)
                break
            case 'WELCOME':
                serverSchema.findOneAndUpdate<serverSettings>({ guildId: guild.id }, { welcome: !welcome })
                message.channel.send(`Welcome messages have been ${!welcome ? 'enabled' : 'disabled' }`)
                break
            case 'BOTH':
                serverSchema.findOneAndUpdate<serverSettings>({ guildId: guild.id }, { audits: !audits, welcome: !welcome })
                message.channel.send(`Audit messages have been ${!audits ? 'enabled' : 'disabled' }\nWelcome messages have been ${!welcome ? 'enabled' : 'disabled' }`)
                break
            default:
                message.channel.send(`You need to choose a correct argument for this command`)
                break
        }
    }
}