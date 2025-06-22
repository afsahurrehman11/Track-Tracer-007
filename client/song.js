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

let backGround = document.querySelector(".Picture");
let title = document.querySelector(".title");
let artist = document.querySelector(".artist");
let likeBtn = document.querySelector("#like");
let playlistBtn = document.querySelector("#addPlay");
let playlistDiv = document.querySelector(".playlistSelect");
let songInfo = document.querySelector(".info");
let form = document.querySelector(".playlistForm");

// logout button //
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

			if (response.redirected) {
				window.location.href = response.url;
			} else {
				return response.json();
			}
		})
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.error(
				"There was a problem with the fetch operation:",
				error
			);
		});
});

fetch("/api/song").then((res) => {
	res.json().then((song) => {
		title.textContent = "Title: " + song[0].title;
		artist.textContent = "Artist: " + song[1].artistName;
		backGround.setAttribute("src", song[0].coverPic);

		fetch("/api/getLiked").then((res) => {
			res.json().then((likes) => {
				console.log(likes);
				likes.likedSongs.forEach((s) => {
					if (("Title: "+s.title) == title.textContent) {
						likeBtn.textContent = "Liked";
						
						return;
					}
				});

				if (likeBtn.textContent == "")
					likeBtn.textContent = "Add to Liked Songs";
			});
		});
	});
});

likeBtn.addEventListener("click", () => {
	if(likeBtn.textContent != "Liked")
	{fetch("/api/likedSong", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => {
			if (!res) {
				throw new Error("Network response was not ok!");
			} else return res.json();
		})
		.then((data) => {
			console.log(data);
			likeBtn.textContent = "Liked";
		});}
});

playlistBtn.addEventListener("click", async () => {
	playlistDiv.classList.remove("hidden");
	songInfo.classList.add("hidden");

	try {
		let res = await fetch("/api/getPlaylist");
		let playList = await res.json();

		playList.forEach((play) => {
			form.innerHTML += `<label>${play.playlistName}
      <input class="checkbox" type="checkbox" name="${play.playlistName}"
    /></label>`;
		});
		form.innerHTML += "<button>Add</button>";
	} catch (err) {
		console.log(err);
	}
});