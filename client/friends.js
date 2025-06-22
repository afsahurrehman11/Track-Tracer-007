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

let friends = document.querySelector(".currentFriends");
let addFriend = document.querySelector(".newFriend");
let friendListDiv = document.querySelector(".select");
let likedSongs = document.querySelector(".likedSongs");
let followedArtists = document.querySelector(".followedArtists");
let likeTitle = document.querySelector(".likeTitle");
let followTitle = document.querySelector(".followTitle");
let firstFriend = null;




fetch("/api/getFriends")
  .then((res) => res.json())
  .then((data) => {
    firstFriend = data[0].userName;
    data.forEach((user, idx) => {
      friends.innerHTML += <li class="friend${idx}">${user.userName}</li>;
    });
    let firstFriendDOM = document.querySelector(".friend0");

    let friendItem = document.querySelectorAll("li");
    friendItem.forEach((friend) => {
      friend.addEventListener("click", (e) => {
        likedSongs.innerHTML = "";
        followedArtists.innerHTML = "";
        let friendName = e.target.textContent;
        fetch("/api/getFriendLiked", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: friendName }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            likeTitle.textContent = ${friendName}'s Liked Songs;
            data.likedSongs.forEach((song) => {
              likedSongs.innerHTML += <li>${song.title}</li>;
            });
            // songs.innerHTML = "";
            // data.songs.forEach((song) => {
            //   songs.innerHTML += <li>${song.title}</li>;
            //   songCount++;
            // });
            // console.log(songCount);
            // if (songCount <= 12) {
            //   songs.style.overflowY = "hidden";
            //   songCount = 0;
            // } else {
            //   songs.style.overflowY = "scroll";
            //   songCount = 0;
            // }
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });

        fetch("/api/getFriendFollowing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: friendName }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            return response.json();
          })
          .then((data) => {
            followTitle.textContent = ${friendName}'s Followed Artists;
            data.following.forEach((follow) => {
              followedArtists.innerHTML += <li>${follow.artistName}</li>;
            });
            // songs.innerHTML = "";
            // data.songs.forEach((song) => {
            //   songs.innerHTML += <li>${song.title}</li>;
            //   songCount++;
            // });
            // console.log(songCount);
            // if (songCount <= 12) {
            //   songs.style.overflowY = "hidden";
            //   songCount = 0;
            // } else {
            //   songs.style.overflowY = "scroll";
            //   songCount = 0;
            // }
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
      });
    });
    firstFriendDOM.click();
  });

addFriend.addEventListener("click", (e) => {
  let friendForm = document.querySelector(".friendForm");
  friendListDiv.classList.remove("hidden", "select");
  friendListDiv.classList.add("friendlistWrap");
  fetch("/api/allUsers").then((res) => {
    res.json().then((data) => {
      console.log(data);
      data.forEach((user) => {
        console.log(user);
        friendForm.innerHTML += <label>${user.userName}<input type="checkbox" name="${user.userName}"></label>;
      });
      friendForm.innerHTML += <button class="submit">Submit</button>;
      friendForm.innerHTML += <button class = "close"> Close </button>;

      let closeBtn = document.querySelector(".close");

      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        friendListDiv.classList.add("hidden", "select");
        friendListDiv.classList.remove("friendlistWrap");
        friendForm.innerHTML = "";
      });
    });
  });
});