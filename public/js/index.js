const notifyMsg = document.querySelector(".nobody")
const chatPage = document.querySelector("#chatPage")
const msgContainer = document.querySelector("#msgContainer")
const inputMsg = document.querySelector("#msg")


let socket = io()
let roomId;


socket.emit("joinedRoom")

socket.on("joined", (id)=>{
    roomId = id;
})


msgContainer.addEventListener("submit", (e)=>{
    e.preventDefault()
    let message = inputMsg.value.trim()
    if(message === "") return
    senderMsg(message)
    console.log(roomId);
    socket.emit("message", {roomId, message})
    inputMsg.value = ""
})

socket.on("notify", ({exit, message})=>{
    notifyPeer(exit, message)
})


socket.on("message", (msg)=>{
    recieverMsg(msg)
})





function notifyPeer(exit=false, msg) {
    if(exit){
        notifyMsg.innerHTML = ""
        notifyMsg.innerHTML = msg
        window.location.href = "/"
    }else{
        notifyMsg.innerHTML = ""
        notifyMsg.innerHTML = msg
    }
}


function senderMsg(msg) {
    const localMessageDiv = document.createElement('div');
    localMessageDiv.id = 'localMessage';
    localMessageDiv.className = 'mine messages';
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message last';
    messageDiv.textContent = msg;
    localMessageDiv.appendChild(messageDiv);
    chatPage.appendChild(localMessageDiv);
}

function recieverMsg(msg) {
    const remoteMessageDiv = document.createElement('div');
    remoteMessageDiv.id = 'remoteMessage';
    remoteMessageDiv.className = 'yours messages';
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message last';
    messageDiv.textContent = msg;
    remoteMessageDiv.appendChild(messageDiv);
    chatPage.appendChild(remoteMessageDiv);
}