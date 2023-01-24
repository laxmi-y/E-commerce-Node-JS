
let username = $("#userName").text();
let userId = $("#userId").text();

let textarea = document.querySelector("#comment")
let submitBtn = document.querySelector("#submitBtn")
let commentArea = document.querySelector(".comment__box")
let socket = io()
let blogId = window.location.href.split("/")[4]
submitBtn.addEventListener("click", (e)=>{
    e.preventDefault()
    let comment = textarea.value
    if(!comment){
        return
    }
    postComment(comment)

})

function postComment(comment){
    debugger;
    let data = {
        username : username,
        comment : comment,
        blogId : window.location.href.split("/")[4],
    }

    //Append to client(DOM)
    appendToDom(data)
    textarea.value = ""

    //Broadcast to server
    broadcastComment(data)

    //Sync to the database
    syncWithDb(data)
   
}

function appendToDom(data)
{
    let ltag = document.createElement("li")
    ltag.classList.add("comment")
    ltag.classList.add("mb-3")
    let markup = `
        <div class="card border-light mb-3">
        <div class="card-body">
            <h6>${data.username}</h6>
            <p>${data.comment}</p>
            <div>
                <img src="/images/clock.png" alt="clock">
                <small>${moment(data.time).format('LT')}</small>
            </div>
        </div>
    </div>
    `
    ltag.innerHTML = markup
    commentArea.prepend(ltag)
}

// send user comment to the server  
function broadcastComment(data){
    socket.emit("comment", data)
}

// receive server broadcast comment event and show on client browser
socket.on("comment", (data)=>{
    appendToDom(data)
})

// show user is typing 
textarea.addEventListener("keyup", ()=>{
    socket.emit("typing", {username})
})

let typingDiv = document.querySelector(".typing")
function removeTyping() {
    typingDiv.innerText = " "
}

// API call for save comment
function syncWithDb(data) {
    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/api/comments', { method: 'Post', body:  JSON.stringify(data), headers})
        .then(response => response.json())
        .then(result => {
        })
}

// api call for show comment which is already saved on DB
function fetchComments(data){
    debugger
    fetch("/api/comments/"+blogId)
    .then(res => res.json())
    .then(result =>{
        result.forEach(comment => {
            comment.time = comment.createdAt
            appendToDom(comment)
        });
    })
}

window.onload = fetchComments