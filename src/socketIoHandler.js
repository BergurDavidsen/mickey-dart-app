import { Server } from 'socket.io';


export default function injectSocketIO(server) {
    const io = new Server(server);
    let socketsToUser = {};
    const roomPlayers = {}; // Object to track players in each room
    
    io.on('connection', (socket) => {
        socket.on("join-room", (room, name)=>{
            
            socket.join(room);
            console.log("joined room: "+room + " User: "+name);
            if (!roomPlayers[room]) {
                roomPlayers[room] = [];
            }
            
            if (!roomPlayers[room].includes(name)) {
                roomPlayers[room].push(name);
            }
            socketsToUser[socket.id]=name;
            io.to(room).emit("people-in-room", roomPlayers[room]);
        });
        socket.on('disconnect',() => {
            let name = socketsToUser[socket.id]
            let currentRooms = Object.keys(roomPlayers);

            for(let room of currentRooms){
                let index = roomPlayers[room].indexOf(name);
                if(index !== -1){
                    roomPlayers[room].splice(index,1);
                    io.to(room).emit("remove-player", name)
                }
            }

          });
        
        socket.on("button-clicked", (room, user, key)=>{
            io.to(room).emit("button-clicked-return", room, user, key);
            
        })

        socket.on("finished-hit", (room, user, key)=>{
            io.to(room).emit("remove-key", room, user, key);
            
        })
        
        socket.on("winner-found", (name, room)=>{
            io.to(room).emit("show-winner", name);
            
        });
        socket.on("undo-button-click", (room, user, key)=>{
            io.to(room).emit("reduce-score", room, user, key);
            
        });

        socket.on("undo-key-removal", (room, user, key)=>{
            io.to(room).emit("re-enter-key", room, user, key);
        })
        socket.on('pass-turn', (room, user) => {
            io.to(room).emit('turn-passed', room, user);
            
        });

        let username = `User ${Math.round(Math.random() * 999999)}`;
        socket.emit('name', username);

        socket.on('message', (message) => {
            io.emit('message', {
                from: username,
                message: message,
                time: new Date().toLocaleString()
            });
        });
        
    });
    

    console.log('SocketIO injected');
}