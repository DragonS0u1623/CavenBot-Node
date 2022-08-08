import { Schema, model } from 'mongoose'
import { discordId } from '../structures/Types'

export type blacklist = {
    guildId: string
    channels: string[]
    users: string[]
}

const blacklistSchema = new Schema<blacklist>({
	guildId: discordId,
	channels: [String],
	users: [String]
})

export default model('blacklist', blacklistSchema)