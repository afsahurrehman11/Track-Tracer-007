const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const path = require("path");
const artist = require("./models/artist");
const album = require("./models/album");
const song = require("./models/song");
const user = require("./models/user");
const playlist = require("./models/playlist");
const bodyParser = require("body-parser");
const { STATUS_CODES } = require("http");
const app = express();
app.use(express.static(path.join(__dirname, "..", "client")));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();

const connectString = process.env.MONGO_URI;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

let accessToken = null;
let logged_in = false;
let username = null;
const artist_list = [
    "Ben Howard",
    "Linkin Park",
    "Tamino",
    "Radiohead",
    "Arctic Monkeys",
    "Ed Sheeran",
    "Coldplay",
    "Linda Ronstadt",
    "Daughter",
    "Michael Jackson",
    "The Beatles",
    "Tom Odell",
    "The Weeknd",
    "Dr Dre",
    "Eminem",
    "xxxtentacion",
    "bee gees",
    "Post Malone",
    "Ice Cube",
    "Snoop Dogg",
];

mongoose
    .connect(connectString)
    .then((req, res) => {
        console.log("Connected");
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });

const getAccessToken = async() => {
    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            null, {
                params: {
                    grant_type: "client_credentials",
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Basic " +
                        Buffer.from(client_id + ":" + client_secret).toString("base64"),
                },
            }
        );
        accessToken = response.data.access_token;
        console.log("Access Token:", accessToken);
    } catch (error) {
        console.error("Failed to get access token:", error.response.data);
        accessToken = null;
    }
};

// app.get("/loadData", async (req, res) => {
// 	//let album_name = [];
// 	try {
// 		if (!accessToken) {
// 			await getAccessToken();
// 			if (!accessToken) {
// 				res.status(500).json({ error: "Failed to get access token" });
// 				return;
// 			}
// 		}
// 		for (let i = 0; i < artist_list.length; i++) {
// 			const response1 = await axios.get(
// 				"https://api.spotify.com/v1/search",
// 				{
// 					params: {
// 						q: artist_list[i],
// 						type: "artist",
// 					},
// 					headers: {
// 						Authorization: "Bearer " + accessToken,
// 					},
// 				}
// 			);

// 			let artist_data = response1.data.artists.items[0];
// 			let artist_ = new artist({
// 				artistName: artist_data.name,
// 				genre: artist_data.genres,
// 				profile_pic: artist_data.images[1].url,
// 				albums: [],
// 			});
// 			const response2 = await axios.get(
// 				"https://api.spotify.com/v1/artists/" +
// 					artist_data.id +
// 					"/albums",
// 				{
// 					headers: {
// 						Authorization: "Bearer " + accessToken,
// 					},
// 				}
// 			);
// 			let album_data = response2.data.items;
// 			for (let j = 0; j < album_data.length; j++) {
// 				let album_ = new album({
// 					title: album_data[j].name,
// 					release_date: album_data[j].release_date,
// 					no_of_songs: album_data[j].total_tracks,
// 					image: album_data[j].images[0].url,
// 					songs: [],
// 				});

// 				const response3 = await axios.get(
// 					"https://api.spotify.com/v1/albums/" +
// 						album_data[j].id +
// 						"/tracks",
// 					{
// 						headers: {
// 							Authorization: "Bearer " + accessToken,
// 						},
// 					}
// 				);
// 				let song_data = response3.data.items;

// 				for (let k = 0; k < song_data.length; k++) {
// 					let song_ = new song({
// 						title: song_data[k].name,
// 						artist: artist_,
// 						coverPic: album_data[j].images[0].url
// 					});
// 					song_.save();
// 					album_.songs.push(song_);
// 				}
// 				album_.save();
// 				artist_.albums.push(album_);
// 			}
// 			artist_.save();
// 		}
// 		res.send("Success");
// 	} catch (error) {
// 		console.log(error);
// 	}
// });

app.get("/", async(req, res) => {
    if (!logged_in) {
        res.redirect("/login");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "home.html"));
    }
});

app.get("/search", async(req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "search.html"));
});

let artist_res, album_res, song_res;

app.post("/api/search", async(req, res) => {
    console.log(req.body);
    let to_search = req.body.query;
    const find_artist = artist.findOne({ artistName: to_search });
    const find_album = album.findOne({ title: to_search });
    const find_song = song.findOne({ title: to_search });

    Promise.all([find_artist, find_album, find_song]).then(
        ([res1, res2, res3]) => {
            artist_res = res1;
            album_res = res2;
            song_res = res3;

            if (artist_res) {
                res.redirect("/artist");
            } else if (album_res) res.redirect("/album");
            else res.redirect("/song");
        }
    );
});

app.get("/api/artist", async(req, res) => {
    try {
        const artistRes = await artist.findById(artist_res._id).populate("albums");
        const songsResult = await album
            .findById(artistRes.albums[0])
            .populate("songs");

        if (!artistRes) {
            return res.status(404).json({ error: "Artist not found" });
        }

        res.json([artistRes, songsResult]);
    } catch (err) {
        console.error("Error fetching artist data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/api/album", async(req, res) => {
    try {
        const albumRes = await album.findById(album_res._id).populate("songs");

        if (!albumRes) {
            console.log("Album not found");
            return;
        }
        res.json(albumRes);
    } catch (error) {
        console.error("Error:", error.message);
    }
});

app.get("/album", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "album.html"));
});

app.get("/api/song", async(req, res) => {
    try {
        let artistName = await artist.findById(song_res.artist);

        if (!song_res) {
            console.log("Song not found");
            return;
        }
        res.json([song_res, artistName]);
    } catch (error) {
        console.error("Error:", error.message);
    }
    try {
        let artistName = await artist.findById(song_res.artist);
        if (!song_res) {
            console.log("Song not found");
            return;
        }
        res.json([song_res, artistName]);
    } catch (error) {
        console.error("Error:", error.message);
    }
});

app.get("/artist", async(req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "artist.html"));
});

app.get("/song", async(req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "song.html"));
});

app.get("/signup", async(req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "signup.html"));
});

app.post("/signup", async(req, res) => {
    console.log(req.body);
    let newUser = new user({
        displayName: req.body.displayname,
        userName: req.body.username,
        password: req.body.password,
        following: [],
    });
    username = req.body.displayname;
    newUser.save().then((result) => {
        logged_in = true;
        res.redirect("/");
    });
});

app.post("/api/registerArtist", async(req,res) => {
    let newArtist = new artist({
        artistName: req.body.username,
        genre: [],
        profile_pic: req.body.pic,
        albums: []
    });
    newArtist.genre.push(req.body.genre);
    newArtist.save().then((result)=>{
        console.log(result);
        user.findOne({displayName: username}).then(usr => {
            usr.isArtist = true;
            usr.save().then(r => {
                
                res.json(result);
            }) 
        })
    })
})

app.get("/login", async(req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "login.html"));
});
let verification_res = null;

app.post("/login", async(req, res) => {
    user.findOne({ userName: req.body.username }).then((result) => {
        verification_res = result;
        if (!verification_res) {
            //console.log("user not found");
            verification_res = "error";
            res.redirect("/login");
        } else if (verification_res.password == req.body.password) {
            //console.log("successfull");
            logged_in = true;
            username = verification_res.displayName;
            res.redirect("/");
        } else {
            res.redirect("/login");
            verification_res = "error";
            //console.log("incorrect UserNmae or password");
        }
    });
});

app.get("/api/login", async(req, res) => {
    res.json(verification_res);
});

app.post("/api/songs", async(req, res) => {
    if (req.body.album) {
        album_res = req.body.album;
    }
    console.log(req.body.songName);
    try {
        const albumRes = await album.findById(album_res._id).populate("songs");
        albumRes.songs.forEach((song) => {
            if (song.title === req.body.songName) {
                song_res = song;

                res.redirect("/song");
            }
        });
    } catch (err) {
        console.log(err);
    }
});

app.post("/api/artist", async(req, res) => {
    try {
        const albumRes = await album
            .findOne({ title: req.body.album.title })
            .populate("songs");
        res.send(albumRes);
    } catch (err) {
        console.log(err);
    }
});

app.get("/api/username", async(req, res) => {
    res.send({ usr: username });
});

app.post("/api/followArtist", async(req, res) => {
    console.log(artist_res);
    console.log(username);
    let usr = await user.findOne({ displayName: username });
    console.log(usr);
    usr.following.push(artist_res);
    await usr.save();
    res.send({ nth: "hello" });
});

app.get("/api/getFollowing", async(req, res) => {
    let usr = await user.findOne({ displayName: username }).populate("following");
    res.send(usr);
});

app.post("/api/likedSong", async(req, res) => {
    let usr = await user.findOne({ displayName: username });
    usr.likedSongs.push(song_res);
    await usr.save();
    res.send({ message: "Successful" });
});

app.get("/api/getLiked", async(req, res) => {
    let usr = await user
        .findOne({ displayName: username })
        .populate("likedSongs");
    res.send(usr);
});

// app.get("/loadPlay", async (req, res) => {
//   let playlist_ = new playlist({
//     playlistName: "Test",
//     isCollaborative: true,
//     users: ["6644d4425c7040daa972ad32", "6644e0921ed4a034fccece6c"],
//     songs: ["664302e40d273de2c9f29858", "664302e40d273de2c9f2985a"],
//   });
//   playlist_.save();
//   res.send("Done");
// });

app.post("/api/playlist", async(req, res) => {
    let playlist_ = new playlist({
        playlistName: req.body.name,
        isCollaborative: false,
        users: [],
    });
    if (req.body.collab === "on") {
        playlist_.isCollaborative = true;
        let users = req.body.username.split(",");
        let defaultUser = await user.findOne({ displayName: username });
        users.push(defaultUser.userName);
        let validPlay = true;

        (async() => {
            for (let idx = 0; idx < users.length; idx++) {
                let userRes = await user.findOne({ userName: users[idx] });
                if (!userRes) {
                    validPlay = false;
                } else {
                    // console.log(idx);
                    playlist_.users.push(userRes);
                    userRes.playlist.push(playlist_);
                    userRes.save();
                    if (idx === users.length - 1) {
                        if (validPlay === true) {
                            playlist_.save();
                            res.redirect("/");
                        } else {
                            res.send({ error: "User not found!" });
                        }
                    }
                }
            }
        })();
    } else {
        playlist_.isCollaborative = false;
        let userRes = await user.findOne({ displayName: username });
        if (!userRes) {
            res.send({ error: "User not found!" });
        } else {
            playlist_.users.push(userRes);
            userRes.playlist.push(playlist_);
            userRes.save();
            playlist_.save();
            res.redirect("/");
        }
    }
});

app.get("/api/getPlaylist", async(req, res) => {
    let usr = await user.findOne({ displayName: username });
    let result = await playlist.find({ users: usr._id });
    res.send(result);
});

app.post("/api/addSong", async(req, res) => {
    const keys = Object.keys(req.body);
    if (keys.length === 0) {
        return res.send({ error: "No playlists selected", STATUS_CODES: 400 });
    }
    keys.forEach(async(key) => {
        let result = await playlist.findOne({ playlistName: key });
        if (!result) {
            return res.send({ error: "Playlist not found", STATUS_CODES: 404 });
        }
        result.songs.push(song_res);
        await result.save();
    });
    res.redirect("/song");
});

app.get("/api/allUsers", async(req, res) => {
    try {
        const users = await user.find({});
        let result = users.filter((user) => user.displayName !== username);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send("An error occurred while fetching users.");
    }
});

app.get("/api/getFriends", async(req, res) => {
    try {
        let currentUser = await user
            .findOne({ displayName: username })
            .populate("friends");
        res.status(200).json(currentUser.friends);
    } catch (err) {
        res.status(500).send("An error occured while fetching friends.");
    }
});

app.post("/api/addFriends", async(req, res) => {
    try {
        const keys = Object.keys(req.body);
        let currentUser = await user.findOne({ displayName: username });

        // Collect all promises for finding friends
        const friendPromises = keys.map((key) => user.findOne({ userName: key }));
        let friends = await Promise.all(friendPromises);

        // Update friends and currentUser's friends list
        friends.forEach((friend) => {
            if (friend) {
                currentUser.friends.push(friend);
                friend.friends.push(currentUser);
            }
        });

        // Save all friend documents sequentially
        for (let friend of friends) {
            if (friend) {
                await friend.save();
            }
        }

        // Save currentUser after all friends have been saved
        await currentUser.save();
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while adding friends.");
    }
});

app.post("/api/getFriendLiked", async(req, res) => {
    const value = Object.values(req.body);
    console.log(value);
    try {
        let result = await user.findOne({ userName: value }).populate("likedSongs");
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send("An error occurred while fetching users.");
    }
});

app.post("/api/getFriendFollowing", async(req, res) => {
    const value = Object.values(req.body);
    try {
        let result = await user.findOne({ userName: value }).populate("following");
        console.log(result);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send("An error occurred while fetching users.");
    }
});

app.get("/api/friendPage", async(req, res) => {
    res.redirect({ url: "friends.html" });
});

app.get("/api/logout", async(req, res) => {
    logged_in = false;
    res.redirect("/login")
})

app.get("/api/getFollowing", async(req,res)=>{
    try {
        let result = await user.findOne({username: username}).populate("following");
        res.json(result)
    }
    catch (err) {
        res.status(500).send("An error occurred while fetching users.");
    }
})

app.get("/api/getLiked", async(req,res)=>{
    try {
        let result = await user.findOne({username: username}).populate("likedSongs")
        res.json(result);
    }
    catch {
        res.status(500).send("An error occurred while fetching users.");
    }
})

app.get("/profile", async(req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "profile.html"));
});

app.get("/api/getUserStatus", async(req,res)=>{
    try {
        let result = await user.findOne({displayName:username}).populate("artistRef"); 
        console.log(result);
        res.json(result);
    }
    catch {
        res.status(500).send("An error occurred while fetching users.");
    }
})