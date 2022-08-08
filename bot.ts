import CavenBot from './structures/CavenBot'
import { Player } from 'discord-music-player'
import { config } from 'dotenv'

config()

const client = new CavenBot()

const player = new Player(client, {
    leaveOnEnd: false,
    leaveOnEmpty: true,
    timeout: 60,
})

client.player = player

client.start()