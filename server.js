const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 8000;

server.listen(PORT);

app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set("views", "./views");

let listUsers = [];

// Listen connect
io.on("connection", (socket) => {
	console.log(`${socket.id} CONNECTED!`);
	
	socket.on("client-send-username", (data) => {
		if(listUsers.indexOf(data) >= 0) {
			socket.emit("server-res-register-fail");
		}
		else {
			listUsers.push(data);
			socket.emit("server-res-register-success", data);
			// Set new field for socket
			socket.username = data;
			io.sockets.emit("server-send-listUsers", listUsers);
		}
	});

	socket.on("client-send-message", (data) => {
		io.sockets.emit("server-send-message", {username: socket.username, content: data});
	});

	socket.on("client-logout", () => {
		listUsers.splice(listUsers.indexOf(socket.username), 1);
		socket.broadcast.emit("server-send-listUsers", listUsers);
	})

	socket.on("client-typing", () => {
		const noty = `${socket.username} typing...`;
		io.sockets.emit("someone-typing", noty);
	});

	socket.on("client-stop-typing", () => {
		io.sockets.emit("someone-stop-typing");
	});

	socket.on("disconnect", () => {
		console.log(`${socket.id} DISCONNECTED!`);
		listUsers.splice(listUsers.indexOf(socket.username), 1);
		socket.broadcast.emit("server-send-listUsers", listUsers);
	})
});

// Routes
app.get("/",  (req, res) => {
	res.render("index");
	// res.json({
	// 	"message": "Hello Socket Server!"
	// })
})



