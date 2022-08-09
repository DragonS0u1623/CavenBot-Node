const Command = require('../../structures/Command')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/StaticVars')

module.exports = class extends Command {
    constructor(client, name='queue') {
        super(client, name, {
            aliases: ['q'],
            category: 'Music',
            description: 'Shows the current queue',
            slash: true,
            data: new SlashCommandBuilder().setName('queue').setDescription('Shows the current queue').setDMPermission(false)
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
       
        let embed = new EmbedBuilder().setTitle('Song Queue').setColor('#ff0000').setTimestamp(new Date()).setFooter({ text: FOOTER, iconURL: OWNERPFP })
        let songs = queue.songs.slice(1)
        let i = 1
        for (const song of songs) {
            embed.addFields({ name: `${i++}`, value: `[${song.name}](${song.url})`, inline: false })
            if (i == 25) {
                embed.addFields({ name: `${i}`, value: `And ${songs.length-i} more songs`, inline: false })
                break
            }
        }
        
        interaction.editReply({ embeds: [embed] })
    }

    async run(message) {
        const { player } = this.client
        if (!player.hasQueue(message.guild.id)) {
            message.channel.send(`I am not in a voice channel and there is no music playing`)
            return
        }
        let queue = player.getQueue(message.guild.id)

        let embed = new EmbedBuilder().setTitle('Song Queue').setColor('#ff0000').setTimestamp(new Date()).setFooter({ text: FOOTER, iconURL: OWNERPFP })
        let songs = queue.songs.slice(1)
        let i = 1
        for (const song of songs) {
            embed.addFields({ name: `${i++}`, value: `[${song.name}](${song.url})`, inline: false })
            if (i == 25) {
                embed.addFields({ name: `${i}`, value: `And ${songs.length-i} more songs`, inline: false })
                break
            }
        }
        
        message.channel.send({ embeds: [embed] })
    }
}