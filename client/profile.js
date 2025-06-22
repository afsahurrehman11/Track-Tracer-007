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

let nonArtistInfo = document.querySelector(".NonArtist");
let artistInfo = document.querySelector(".artist");
let Uname = document.querySelector(".name");
try {
    let res = await fetch("/api/getUserStatus");
    let resJson = await res.json(); 
    console.log(resJson);

    if(resJson.isArtist) {
        artistInfo.classList.remove("hidden");
        }
        else {
            nonArtistInfo.classList.remove("hidden");
            Uname.textContent = resJson.displayName;
    }

}
catch(err) {
    console.log(err);
}

let regBtn = document.querySelector(".registor");
let form = document.querySelector(".registorForm");
regBtn.addEventListener("click", (e) =>{
    form.classList.remove("hidden");
})

document.querySelector('.registorForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.querySelector('.username').value;
    const genre = document.querySelector('.genre').value;
    const pic = document.querySelector('.pic').value;

    const response = await fetch('/api/registerArtist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            genre: genre,
            pic: pic
        })
    });

    const result = await response.json();
    form.classList.add("hidden");
    nonArtistInfo.classList.add("hidden");
    artistInfo.classList.remove("hidden");
    console.log(result);

    try {
        let res = await fetch("/api/getUserStatus");
        let resJson = await res.json(); 
        console.log(resJson);    
    }
    catch(err) {
        console.log(err);
    }

});

document.querySelector(".closeform1").addEventListener("click", (e)=> {
    form.classList.add("hidden");
})