const notifyMsg = document.querySelector(".nobody")
const chatPage = document.querySelector("#chatPage")
const msgContainer = document.querySelector("#msgContainer")
const inputMsg = document.querySelector("#msg")

// const mainPage = document.querySelector("#mainPage")
// const {showDangerToast} = require('./alert.js')


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









