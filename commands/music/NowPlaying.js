const Command = require('../../structures/Command')
const { EmbedBuilder } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { HOMESERVERID, NPEMOTE } = require('../../utils/StaticVars')

module.exports = class extends Command {
    constructor(client, name='nowplaying') {
        super(client, name, {
            aliases: ['np', 'now'],
            category: 'Music',
            description: 'Shows the currently playing song',
            slash: true,
            data: new SlashCommandBuilder().setName('nowplaying').setDescription('Shows the currently playing song').setDMPermission(false)
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const { player } = this.client
        if (!player.hasQueue(interaction.guild.id)) {
            interaction.editReply(`I am not in a voice channel and there is no music playing`)
            return
        }
        let queue = player.getQueue(interaction.guild.id)

        const homeServer = this.client.guilds.resolve(HOMESERVERID)
        const emote = homeServer.emojis.resolve(NPEMOTE)
       
        const song = queue.nowPlaying

        const embed = new EmbedBuilder().setTitle(`${emote} ${song.name} ${emote}`)
            .setURL(`${song.url}`)
            .setDescription(`${song.author}`)
            .setColor('#ff0000')
            .setThumbnail(`${song.thumbnail}`)
            .setTimestamp(new Date())
            .addFields({ name: 'Requested By', value: `${song.requestedBy}`, inline: false })

        interaction.editReply({ embeds: [embed] })
    }

    async run(message) {
        const { player } = this.client
        if (!player.hasQueue(message.guild.id)) {
            message.channel.send(`I am not in a voice channel and there is no music playing`)
            return
        }
        let queue = player.getQueue(message.guild.id)

        const homeServer = this.client.guilds.resolve(HOMESERVERID)
        const emote = homeServer.emojis.resolve(NPEMOTE)
        
        const song = queue.nowPlaying

        const embed = new EmbedBuilder().setTitle(`${emote} ${song.name} ${emote}`)
            .setURL(`${song.url}`)
            .setDescription(`${song.author}`)
            .setColor('#ff0000')
            .setThumbnail(`${song.thumbnail}`)
            .setTimestamp(new Date())
            .addFields({ name: 'Requested By', value: `${song.requestedBy}`, inline: false })

        message.channel.send({ embeds: [embed] })
    }
}