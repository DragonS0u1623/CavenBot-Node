import { Schema, model } from 'mongoose'
import { reqBool, discordId } from '../structures/Types'

export type reactRole = {
    guildId: string
    channelId: string
    messageId: string
    toggle: boolean
    roles: Map<string, string>
}

const reactSchema = new Schema<reactRole>({
	guildId: discordId,
	channelId: discordId,
	messageId: discordId,
	toggle: reqBool,
	roles: {
		type: Map,
		of: String
	}
})

export default model('reactroles', reactSchema)