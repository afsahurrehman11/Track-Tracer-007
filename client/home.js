// function call() {
//   return fetch("/api/username").then((res) => {
//     res.json().then((result) => {
//       accountInfo.textContent = result.usr;
//       console.log(result.usr);
//       return result;
//     });
//   });
// }
// let userName = call().then((res) => {});
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
accountInfo.textContent = username;
let artistsList = document.querySelector(".artistList");
let songList = document.querySelector(".songList");
let newPlayBtn = document.querySelector(".newPlay");
let mainContent = document.querySelector(".mainContent");
let playlistForm = document.querySelector(".form");
let playlist = document.querySelector(".playlistData");
let checkbox = document.querySelector(".checkbox");
let userDiv = document.querySelector(".username");
let friendBtn = document.querySelector(".friend");

// let viewBtn = document.querySelector(".viewFriends");
let usrDta = null;
try {
    let res = await fetch("/api/getFollowing");
    usrDta = await res.json();
    console.log(usrDta);
    usrDta.following.forEach((artist) => {
        artistsList.innerHTML += <li>${artist.artistName}</li>;
    });
} catch (err) {
    console.log(err);
}
let songData = null;
try {
    let res = await fetch("/api/getLiked");
    songData = await res.json();
    songData.likedSongs.forEach((song) => {
        songList.innerHTML += <li>${song.title}</li>;
    });
} catch (err) {
    console.log(err);
}
export default username;

newPlayBtn.addEventListener("click", () => {
    playlistForm.classList.remove("hidden");
    mainContent.style.filter = "blur(5px)";
    checkbox.addEventListener("click", () => {
        userDiv.classList.toggle("hidden");
    });
});

try {
    let res = await fetch("/api/getPlaylist");
    let playList = await res.json();

    playList.forEach((play) => {
        playlist.innerHTML += <li>${play.playlistName}</li>;
    });
} catch (err) {
    console.log(err);
}

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


// logout button //
let logoutBtn = document.querySelector("#Logoutbtn");
logoutBtn.addEventListener("click", (e) => {
    fetch("/api/logout").then((response) => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    });
});