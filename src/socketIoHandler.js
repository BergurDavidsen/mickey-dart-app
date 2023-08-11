import { redirect } from '@sveltejs/kit';
import { Server } from 'socket.io';


export default function injectSocketIO(server) {
    const io = new Server(server);
    let socketsToUser = {};
    const roomPlayers = {};
    const gameStarted = {};
    const validRoomPins = [] // Object to track players in each room
    
    io.on('connection', (socket) => {
        socket.on("join-room", (room, name, isStarted)=>{
            
            if(gameStarted[room]){
                socket.emit('gameAlreadyStarted')
                return
            }

            if (!roomPlayers[room]) {
                roomPlayers[room] = [];
                validRoomPins.push(room);
                console.log(validRoomPins)
                io.emit("new-room-created", validRoomPins)
            }
            
            if (!roomPlayers[room].includes(name)) {
                roomPlayers[room].push(name);
            }

            socket.join(room)
            console.log("joined room: "+room + " User: "+name);
            socketsToUser[socket.id]=name;
            io.to(room).emit("people-in-room", roomPlayers[room]);
        });
        socket.on("opened-page",()=>{
            console.log(validRoomPins, "player opened page")
            io.emit("valid-room-pins", validRoomPins);
        })
        socket.on("startGame", (room, user)=>{
            if(gameStarted[room]){
                return
            }
            gameStarted[room] = true;
            io.to(room).emit("isStarted", user);
        })

        socket.on('disconnect',() => {
            let name = socketsToUser[socket.id]
            let currentRooms = Object.keys(roomPlayers);

            for(let room of currentRooms){
                let index = roomPlayers[room].indexOf(name);
                if(index !== -1){
                    roomPlayers[room].splice(index,1);
                    io.to(room).emit("remove-player", name)
                    
                }
                if(roomPlayers[room].length<1){
                    console.log(validRoomPins, "before");
                     validRoomPins.splice(validRoomPins.indexOf(room),1);
                     console.log(validRoomPins);
                     delete roomPlayers[room];
                     console.log(roomPlayers);
                     io.emit("room-deleted", validRoomPins)
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