const mongoose = require('mongoose');
const schema = mongoose.Schema;
const song = require('./song')
 
const albumSchema = new schema({
    title: {
        type:String,
        required: true
    },
    release_date: {
        type:Date,
        required: true
    },
    no_of_songs: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true 
    },
    songs:
        [{type:schema.Types.ObjectId, 
        ref: 'song',
        required: true
    }]
        
});

const album = mongoose.model('album', albumSchema);
module.exports = album;