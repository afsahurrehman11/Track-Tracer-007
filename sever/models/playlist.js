const mongoose = require("mongoose");
const schema = mongoose.Schema;
const playlistSchema = new schema({
  playlistName: {
    type: String,
    required: true,
  },
  isCollaborative: {
    type: Boolean,
    required: false,
    default: false,
  },
  users: [
    {
      type: schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  ],
  songs: [
    {
      type: schema.Types.ObjectId,
      ref: "song",
      required: false,
    },
  ],
});

const playlist = mongoose.model("playlist", playlistSchema);
module.exports = playlist;