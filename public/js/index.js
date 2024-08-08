const notifyMsg = document.querySelector(".nobody")


let socket = io()
let roomId;



socket.on("joinedRoom", (id)=>{
    roomId = id
    socket.emit("notify", "Peer has Joined, Enjoy!!")
})

socket.on("notify", (notifyMsgData)=>{
    console.log("notify");
    notifyPeer(notifyMsgData)
})

socket.on("sessionClosed", (closedMsg)=>{
    
})


function notifyPeer(data) {
    notifyMsg.innerHTML = ""
    notifyMsg.innerHTML = data
}
