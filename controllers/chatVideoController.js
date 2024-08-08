
const chatVideoController = (io)=>{

    let waitingUsers = []

    io.on("connection", (socket)=>{
        
        if(waitingUsers.length > 0){
            try {
                let me = waitingUsers.shift();
                let partner = socket;
    
                let roomId = `${me.id}-${partner.id}`;
    
                me.join(roomId)
                partner.join(roomId)

                me.roomId = roomId;
                partner.roomId = roomId;
    
                socket.emit("joinedRoom", roomId)
                socket.on("notify", (notifymsg)=>{
                    io.to(roomId).emit("notify", notifymsg)
                })
            } catch (error) {
                console.log(error);
            }
        }else{
            waitingUsers.push(socket)
        }
        
        socket.on("disconnect", ()=>{
            console.log("User disconnected: ", socket.id);
            const userIdIndex = waitingUsers.findIndex((user)=> user.id === socket.id)
            waitingUsers.splice(userIdIndex, 1)

            if(socket.roomId){
                socket.to(socket.roomId).emit("notify", "Peer has left the chat, Refresh to connect with a new peer. ")
            }
        })
    })
}



module.exports = {chatVideoController}