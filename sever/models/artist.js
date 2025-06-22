const mongoose = require("mongoose");
const schema = mongoose.Schema;
const user = require("./user");
const album = require("./album");
const artistSchema = new schema({
  artistName: {
    type: String,
    required: true,
  },
  // country:{
  //     type:String,
  //     required:true
  // },
  genre: [
    {
      type: String,
      required: true,
    },
  ],
  // about:{
  //     type: String,
  //     required: true
  // },
  // joinDate:{
  //     type:Date,
  //     required:true
  // },
  profile_pic: {
    type: String,
    required: true,
  },
  follower: [{ type: schema.Types.ObjectId, ref: "user", required: false }],
  albums: [{ type: schema.Types.ObjectId, ref: "album", required: true }],
});
const artist = mongoose.model("artist", artistSchema);
module.exports = artist;