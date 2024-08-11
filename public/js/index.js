const notifyMsg = document.querySelector(".nobody")
const chatPage = document.querySelector("#chatPage")
const msgContainer = document.querySelector("#msgContainer")
const inputMsg = document.querySelector("#msg")
const localVideo = document.querySelector("#localVideo")
const remoteVideo = document.querySelector("#remoteVideo")
const videoCallCon = document.querySelector("#video-call-con")
const videoCall = document.querySelector("#video-call")
const incomingCall = document.querySelector("#incoming-call")
const rejectCall = document.querySelector("#reject-call")
const acceptCall = document.querySelector("#accept-call")


// const mainPage = document.querySelector("#mainPage")
// const {showDangerToast} = require('./alert.js')


let socket = io()
let roomId;
let localPeer;
let remotePeer;
let peerConnection;
let inCall = false;
const configrations = {
    iceServers:[
        {urls: "stun:stun.l.google.com:19302"}
    ]
}


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
    chatPage.scrollTo = chatPage.scrollHeight;
})

socket.on("notify", ({exit, message})=>{
    notifyPeer(exit, message)
})


socket.on("message", (msg)=>{
    recieverMsg(msg)
})



inputMsg.addEventListener("input", ()=>{
    if (inputMsg.value.trim()) {
        socket.emit("typing", { roomId });
    } else {
        socket.emit("typing", { roomId }); 
    }
})

socket.on("typing", ()=>{
    typing()
})


// Video Call Feature

// for local input device access
async function initialize() { 
    try {
        socket.on("signalingMessage", handleSignaling)
        localPeer = await navigator.mediaDevices.getUserMedia({audio: true, video: true}) // video is still left to add;
        localVideo.srcObject = localPeer;
        initializeOffer()
    } catch (error) {
        console.log(error);
    }
}

// initializeOffer for local peer
async function initializeOffer() {
    try {
        await createPeerConnection()
        let offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)
        socket.emit("signalingMessage", {roomId, message: JSON.stringify({type: "offer", offer})})
        inCall = true;
    } catch (error) {
        console.log(error);
    }
}

// to create a peer connection
async function createPeerConnection() {
    try {
        peerConnection = new RTCPeerConnection(configrations)

        remotePeer = new MediaStream()
        remoteVideo.srcObject = remotePeer;

        localPeer.getTracks().forEach((track)=> {
            peerConnection.addTrack(track, localPeer)
        })

        peerConnection.ontrack = (event)=>{
            event.streams[0]?.getTracks().forEach((track)=>remotePeer.addTrack(track))
            
        }

        peerConnection.onicecandidate = (e)=>{
            if(e.candidate){
                socket.emit("signalingMessage", {roomId, message: JSON.stringify({type: "candidate", candidate: e.candidate})})
            }
        }

        peerConnection.onconnectionstatechange = (e)=>{
            console.log("Connection Changed: ", e.connectionState);
        }

        console.log(peerConnection);
    } catch (error) {
        console.log(error);
    } 
}


async function handleSignaling(data) {
    const {type, offer, answer, candidate} = JSON.parse(data)
    
    switch (type) {
        case "offer":
            handleOffer(offer)
            break;
        case "answer":     
            handleAnswer(answer)
            break;
        case "candidate":
            if(type === candidate && peerConnection){
                await peerConnection.addIceCandidate(candidate)
            }
            break;
    
    }

}


async function handleOffer(offer) {
    try {
        await createPeerConnection()
        await peerConnection.setRemoteDescription(offer)
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        socket.emit("signalingMessage", {roomId, message: JSON.stringify({type: "answer", answer})})

    } catch (error) {
        console.log(error);
    }
}

async function handleAnswer(answer) {
    try {
        if(answer){
            await peerConnection.setRemoteDescription(answer)
        }
    } catch (error) {
        console.log(error);
    }
}


videoCall.addEventListener("click", ()=>{
    if(inCall) return;
    socket.emit("startVideoCall", roomId)
    // videoCallCon.classList.remove("hidden")
})


socket.on("incomingCall", ()=>{
    incomingCall.classList.remove("hidden")
})

acceptCall.addEventListener("click", ()=>{
    incomingCall.classList.add("hidden")
    initialize()
    videoCallCon.classList.remove("hidden")
    socket.emit("accept-call", {roomId})
})

socket.on("callAccepted", ()=>{
    initialize();
    videoCallCon.classList.remove("hidden")
})


// false 




function typing() {
    let replyDiv = document.getElementById('reply');

    if (!replyDiv) {
        // Create the outer container
        replyDiv = document.createElement('div');
        replyDiv.id = 'reply';
        replyDiv.className = 'chat-bubble fixed left-2 bottom-20 z-[999]';

        // Create the typing container
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing';

        // Create the dot elements
        const dot1 = document.createElement('div');
        dot1.className = 'dot';
        const dot2 = document.createElement('div');
        dot2.className = 'dot';
        const dot3 = document.createElement('div');
        dot3.className = 'dot';

        // Append the dot elements to the typing container
        typingDiv.appendChild(dot1);
        typingDiv.appendChild(dot2);
        typingDiv.appendChild(dot3);

        // Append the typing container to the outer container
        replyDiv.appendChild(typingDiv);

        // Append the outer container to the body or another parent element
        chatPage.appendChild(replyDiv);
    } else {
        // Make sure it's visible
        replyDiv.classList.remove('hidden');
    }

    // Automatically hide typing indicator after some time
    setTimeout(() => {
        if (replyDiv) {
            replyDiv.classList.add('hidden');
        }
    }, 1000);
}


function notifyPeer(exit=false, msg) {
    if(exit){
        notifyMsg.innerHTML = ""
        notifyMsg.innerHTML = msg
        window.location.href = "/"
    }else{
        notifyMsg.innerHTML = ""
        notifyMsg.innerHTML = msg
        successToast(msg)
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
    chatPage.scrollTop = chatPage.scrollHeight;
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
    chatPage.scrollTo = chatPage.scrollHeight;
}

function successToast(message) {
    // Create the main toast container
    const toast = document.createElement('div');
    toast.id = 'toast-success';
    toast.className = 'flex absolute left-1/2 -translate-x-1/2 items-center w-full max-w-xs p-4 py-3 mb-4 text-gray-500 bg-white rounded-lg shadow';
    toast.setAttribute('role', 'alert');

    // Create the icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg';
    
    // Create the SVG icon
    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.classList.add('w-5','h-5');
    svgIcon.setAttribute('aria-hidden', 'true');
    svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgIcon.setAttribute('fill', 'currentColor');
    svgIcon.setAttribute('viewBox', '0 0 20 20');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z');
    
    svgIcon.appendChild(path);
    iconContainer.appendChild(svgIcon);
    
    // Create the text container
    const textContainer = document.createElement('div');
    textContainer.className = 'ms-3 text-sm text-green-600 font-semibold';
    textContainer.textContent = message;
    
    // Append all elements to the toast container
    toast.appendChild(iconContainer);
    toast.appendChild(textContainer);
    // toast.appendChild(closeButton);

    // Append the toast to the body
    chatPage.appendChild(toast);

    // Add functionality to close the toast when the button is clicked
    setTimeout(() => {
        chatPage.removeChild(toast);
    }, 1500);
}
