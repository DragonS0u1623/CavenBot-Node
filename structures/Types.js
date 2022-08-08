module.exports.discordId = discordId = {
    type: String,
    required: true,
    unique: true
}

module.exports.reqString = reqString = {
    type: String,
    required: true
}

module.exports.reqNum = reqNum = {
    type: Number,
    required: true
}

module.exports.reqBool = reqBool = {
    type: Boolean,
    required: true
}