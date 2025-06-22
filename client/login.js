fetch("/api/login").then((res) =>{
    res.json().then((result) =>{
        console.log(result);
        if(result == "error")
            error_div.classList.remove("no_error_msg");
    })
        
}); 

let error_div = document.querySelector(".no_error_msg");