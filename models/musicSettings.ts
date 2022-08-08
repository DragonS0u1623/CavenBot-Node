import { Schema, model } from 'mongoose'
import { reqBool, discordId } from '../structures/Types'

export type musicSettings = {
    guildId: string,
    requesterNotInVCSkip: boolean
}

const musicSettingsSchema = new Schema<musicSettings>({
    guildId: discordId,
    requesterNotInVCSkip: reqBool
})

export default model('musicSettings', musicSettingsSchema)