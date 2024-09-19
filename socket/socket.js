import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const origin = process.env.ORIGIN
const io = new Server(server, {
	cors: {
		origin:["http://localhost:5173"],
		methods:["GET", "POST"],
		credentials: true,
		allowedHeaders:["Authorization","Access-Control-Allow-Origin","Access-Control-Allow-Credentials","Content-Type", "X-Requested-With"],
		
	}
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

try {
	io.on("connection", (socket) => {
		console.log("a user connected", socket.id);
	
		const userId = socket.handshake.query.userId;
		if (userId != "undefined") userSocketMap[userId] = socket.id;
	
		// io.emit() is used to send events to all the connected clients
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	
		// socket.on() is used to listen to the events. can be used both on client and server side
		socket.on("disconnect", () => {
			console.log("user disconnected", socket.id);
			delete userSocketMap[userId];
			io.emit("getOnlineUsers", Object.keys(userSocketMap));
		});
	});
} catch (error) {
	console.log(error);
}

export { app, io, server };
