let username = null;
let result = null;
try {
	let res = await fetch("/api/username");
	result = await res.json();
} catch (err) {
	console.log(err);
}

username = result.usr;
let accountInfo = document.querySelector(".account");
accountInfo.innerHTML = username;


let ablumName = document.querySelector(".albumName");
let followBtn = document.querySelector("#followBtn");
let reqAlbum;
let postData = {
	album: {},
	songName: "",
};
let songCount = 0;
fetch("/api/artist").then((res) => {
	res.json().then((artist) => {
		name.textContent = artist[0].artistName;
		artist[0].albums.forEach((album, idx) => {
			albums.innerHTML += <li>${album.title}</li>;
		});
		reqAlbum = artist[0];
		postData.album = reqAlbum.albums[0];
		ablumName.textContent = artist[1].title;
		artist[1].songs.forEach((song, idx) => {
			songs.innerHTML += <li>${song.title}</li>;
			songCount++;
		});
		if (songCount <= 12) {
			songs.style.overflowY = "hidden";
			songCount = 0;
		} else {
			songs.style.overflowY = "scroll";
			songCount = 0;
		}
		profilePic.setAttribute("src", artist[0].profile_pic);
		loader.classList.add("remove");
		mainBody.classList.remove("mainDataBefore");
		mainBody.classList.add("mainDataAfter");

		fetch("/api/getFollowing").then((res) => {
			res.json().then((following) => {
				console.log(following);
				following.following.forEach((i) => {
					if (i.artistName == name.textContent) {
						followBtn.textContent = "Following";
						return;
					}
				});
				if (followBtn.textContent == "")
					followBtn.textContent = "Follow";
			});
		});
	});
});

let name = document.querySelector(".name");
let loader = document.querySelector(".loading");
let mainBody = document.querySelector(".mainDataBefore");
let songs = document.querySelector(".songs");
let albums = document.querySelector(".albumNames");
let profilePic = document.querySelector(".profilePicture");
let followbtn = document.querySelector("#followBtn");
followbtn.addEventListener("click", (e) => {
	if (followbtn.textContent != "Following") {
		console.log("follow ");
		fetch("/api/followArtist", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				if (!response.ok)
					throw new Error("Network response was not ok");
				else return response.json();
			})
			.then((data) => {
				console.log(data);
				followBtn.textContent = "Following";
			});
	}
});

albums.addEventListener("click", (e) => {
	reqAlbum.albums.forEach((album, idx) => {
		if (album.title === e.target.textContent) {
			postData.album = album;
			console.log(postData);
		}
	});
	console.log(postData);
	fetch("/api/artist", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(postData),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			ablumName.textContent = postData.album.title;
			songs.innerHTML = "";
			data.songs.forEach((song) => {
				songs.innerHTML += <li>${song.title}</li>;
				songCount++;
			});
			console.log(songCount);
			if (songCount <= 12) {
				songs.style.overflowY = "hidden";
				songCount = 0;
			} else {
				songs.style.overflowY = "scroll";
				songCount = 0;
			}
		})
		.catch((error) => {
			console.error(
				"There was a problem with the fetch operation:",
				error
			);
		});
});

songs.addEventListener("click", (e) => {
	postData.songName = e.target.textContent;
	console.log(postData);
	fetch("/api/songs", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(postData),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			// Check if the response indicates a redirect
			if (response.redirected) {
				// If redirected, change the location of the window to the redirect URL
				window.location.href = response.url;
			} else {
				// Otherwise, log the response data or handle it as needed
				return response.json();
			}
		})
		.then((data) => {
			// Handle the response data if needed
			console.log(data);
		})
		.catch((error) => {
			console.error(
				"There was a problem with the fetch operation:",
				error
			);
		});
});

let logoutBtn = document.querySelector("#Logoutbtn");
logoutBtn.addEventListener("click", (e) => {
	fetch("/api/logout").then((response) => {
		if (response.redirected) {
			window.location.href = response.url;
		}
	});
});

let friendBtn = document.querySelector(".friend");

friendBtn.addEventListener("click", () => {
	window.location.href = "friends.html";
	fetch("/api/friendPage")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			// Check if the response indicates a redirect
			if (response.redirected) {
				// If redirected, change the location of the window to the redirect URL
				window.location.href = response.url;
			} else {
				// Otherwise, log the response data or handle it as needed
				return response.json();
			}
		})
		.then((data) => {
			// Handle the response data if needed
			console.log(data);
		})
		.catch((error) => {
			console.error(
				"There was a problem with the fetch operation:",
				error
			);
		});
});