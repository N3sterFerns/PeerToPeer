const chatVideoController = (io)=>{

    let waitingUsers = []

    io.on("connection", (socket)=>{
        socket.on("joinedRoom", ()=>{
            if(waitingUsers.length > 0){
                let me = waitingUsers.shift();
                let partner = socket;
    
                let roomId = `${me.id}-${partner.id}`;
    
                me.join(roomId)
                partner.join(roomId)

                me.roomId = roomId;
                partner.roomId = roomId;
    
                io.to(roomId).emit("joined", roomId)

                io.to(roomId).emit("notify", {exit: false, message: "Peer has Joined"})
            }else{
                waitingUsers.push(socket)
            }
        })


        socket.on("message", ({roomId, message})=>{     
            socket.broadcast.to(roomId).emit("message", message)
        })
        
        socket.on("typing", ({roomId})=>{
            socket.broadcast.to(roomId).emit("typing")
        })
        
        socket.on("signalingMessage", (data)=>{
            const {roomId, message} = data;
            socket.broadcast.to(roomId).emit("signalingMessage",message)
        })

        socket.on("startVideoCall", (roomId)=>{
            socket.broadcast.to(roomId).emit("incomingCall")
        })

        socket.on("accept-call", ({roomId})=>{
            socket.broadcast.to(roomId).emit("callAccepted")
        })
        
        socket.on("disconnect", ()=>{
            console.log("User disconnected: ", socket.id);
            const userIdIndex = waitingUsers.findIndex((user)=> user.id === socket.id)
            waitingUsers.splice(userIdIndex, 1)

            if(socket.roomId){
                socket.to(socket.roomId).emit("notify", {exit: true, message: "Peer has left the chat, Refresh to connect with a new peer."})
            }
        })
    })
}



module.exports = {chatVideoController}