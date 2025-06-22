const mongoose = require('mongoose');
const schema = mongoose.Schema;
const artist = require("./artist");
const songSchema = new schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: schema.Types.ObjectId,
        required: true
    },
    coverPic: {
        type: String,
        required: true
    }
})

const song = mongoose.model('song', songSchema);
module.exports = song;