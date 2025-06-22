# TrackTracer
An interactive music platform with cross-user collaboration and collaborative playlists.

### Project Overview
TrackTracer is a dynamic database application designed to revolutionize the way users interact with music. It allows users to follow artists, like songs, create playlists, and even follow other users. With TrackTracer, users can also view others' followed artists and liked songs, and collaborate on playlists with mutual followers, giving a community-based music experience.
<br />
<br />
### Problem Statement
To build an music app in which one can follow their favourite artists, save the songs they like, make friends and share along their musical experiences via collaborative playlists styles and exploring each others music tastes. 
<br />
<br />
### Tech Stack
#### Frontend:
- HTML5
- CSS3
- JavaScript
#### Backend:
- Node.js with Express framework
#### Database
- MongoDB with Mongoose ODM for Node.js

<br />

### Project Features
1. **Artist Management**
Browse different artists and their discography.
View detailed artist information including country, genre, and albums.
Follow artists to stay updated with their latest releases.

2. **Album and Song Management**
Explore albums and the songs within them.
Search for specific artists or albums.
Like favorite songs for easy access in the liked songs section.

3. **Playlist Creation**
Create custom playlists to organize favorite songs.
Add songs from different artists and albums to playlists.
Personalize music collections based on individual preferences.

4. **Cross-User Interaction**
Follow other users to discover new music based on their preferences.
View followed artists and liked songs of other users.

5. **Collaborative Playlists**
Create and edit collaborative playlists with mutual followers.
Add songs in a shared playlist environment.

6. **Register as an Artist**
If you are an artist, you can register your self on the app. 
Registered artists can create albums and add songs, visible to all users and followers.

<br />
<br />

### Database Design
#### ERD:
Our database includes the following entities:

![Screenshot 2024-06-11 001213](https://github.com/AsimMasood99/TrackTracer007/assets/130085532/8109bb9c-d99a-4718-af14-dfbc03785400)
(OLD ERD)
#### Description:

1. **Album**
Attributes: Album_ID (primary key), Title, Number_of_songs, Release_date, Artist_id (foreign key).
2. **Artist**
Attributes: Artist_ID (primary key), Artist_name, Country, Joining_date.
3. **Song**
Attributes: Song_ID (primary key), Title, Duration, Album_ID (foreign key).
4. **User**
Attributes: User_ID (primary key), Username, Password.
5. **Playlist**
Attributes: Playlist_ID (primary key), Title.
6. **Liked Songs**
Attributes: User_ID (foreign key), Song_ID (foreign key).
7. **Access**
Attributes: User_ID (foreign key), Playlist_ID (foreign key).
8. **Playlist_Songs**
Attributes: Playlist_ID (foreign key), Song_ID (foreign key).
9. **Follower**
Attributes: User_ID (foreign key), Artist_ID (foreign key).
10. **Friend**
Attributes: User_ID (foreign key), Friend_ID (foreign key).

<br />

### Schmema (Latest Database State)
#### Albums
```ruby
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
```

##### Artists
```ruby
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const user = require("./user");
const album = require("./album");
const artistSchema = new schema({
  artistName: {
    type: String,
    required: true,
  },

  genre: [
    {
      type: String,
      required: true,
    },
  ],
  
  profile_pic: {
    type: String,
    required: true,
  },
  follower: [{ type: schema.Types.ObjectId, ref: "user", required: false }],
  albums: [{ type: schema.Types.ObjectId, ref: "album", required: true }],
});
const artist = mongoose.model("artist", artistSchema);
module.exports = artist;
```
#### Playlist 
```ruby
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
```
#### Songs 
```ruby
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
```
#### Users 
```ruby
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const artist = require("./artist");
const userSchema = new schema({
  displayName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  following: [
    {
      type: schema.Types.ObjectId,
      ref: "artist",
      required: false,
    },
  ],
  likedSongs: [
    {
      type: schema.Types.ObjectId,
      ref: "song",
      required: false,
    },
  ],
  playlist: [
    {
      type: schema.Types.ObjectId,
      ref: "playlist",
      required: false,
    },
  ],
  friends: [
    {
      type: schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
  ],
  isArtist: {
      type: Boolean,
      required: false,
      default: false,
  },
  
  artistRef: {
    type: schema.Types.ObjectId, 
    ref: "artist",
    requried: false, 
  },

});

const user = mongoose.model("user", userSchema);
module.exports = user;
```

### Support
Support us by giving an A. 
