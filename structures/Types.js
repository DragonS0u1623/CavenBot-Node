module.exports = {
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    reqString: {
        type: String,
        required: true
    },
    reqNum: {
        type: Number,
        required: true
    },
    reqBool: {
        type: Boolean,
        required: true
    }
}