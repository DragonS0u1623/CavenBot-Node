import Command from '../../structures/Command'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Message, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import adminSchema, { admin } from '../../models/admin'
import CavenBot from '../../structures/CavenBot'

export default class extends Command {
    constructor(client: CavenBot, name='editwelcome') {
        super(client, name, {
            category: 'Moderation',
            description: 'Edits the message of the welcome embeds',
            expectedArgs: '<message>',
            slash: true,
            data: new SlashCommandBuilder().setName('editwelcome').setDescription('Edits the message of the welcome embeds')
                .addStringOption(option => option.setName('message').setDescription('The message you want to appear in your welcome messages').setRequired(true))
                .setDMPermission(false)
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        })
    }

    async executeSlash(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()
        const { guild } = interaction

        const welcomeMessage = interaction.options.getString('message')

        adminSchema.findOneAndUpdate<admin>({ guildId: guild.id }, { welcome_message: welcomeMessage })
        interaction.editReply(`Welcome message changed to: "${welcomeMessage}"`)
    }

    async run(message: Message, args: string[]) {
        const { guild, member } = message

        if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            message.channel.send(`You don't have permission to use this command`)
            return
        }
        
        if (!args) {
            message.channel.send(`You need to provide at least 1 word argument in this command`)
            return
        }

        const welcomeMessage = args.join(' ')

        adminSchema.findOneAndUpdate<admin>({ guildId: guild.id }, { welcome_message: welcomeMessage })
        message.channel.send(`Welcome message changed to: "${welcomeMessage}"`)
    }
}