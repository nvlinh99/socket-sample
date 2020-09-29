const socket = io("https://socket-server-azi.herokuapp.com");

socket.on("server-res-register-fail", () => {
	alert("Username has been used!");
});

socket.on("server-res-register-success", (data) => {
	$("#currentUser").html(data);
	$("#loginForm").hide(2000);
	$("#chatForm").show(1000);
})

socket.on("server-send-listUsers", (data) => {
	$("#users").html("");
	data.forEach(user => {
		$("#users").append("<div class='user'>" + user +"</div>");
	})
})

socket.on("server-send-message", (data) => {
	$("#listMessages").append("<div class='ms'>" + data.username + " : " + data.content + "</div>");
});

socket.on("someone-typing", (data) => {
	$("#notify").html(data + "<img width='50px' src='typing.gif'/>");
});

socket.on("someone-stop-typing", () => {
	$("#notify").html("");
})

$(document).ready(()=>{
	$("#loginForm").show();
	$("#chatForm").hide();
	$("#register").click(()=>{
		socket.emit("client-send-username", $("#username").val());
	});
	$("#logout").click(()=>{
		socket.emit("client-logout");
		$("#chatForm").hide(2000);
		$("#loginForm").show(1000);
	});

	$("#sendMessage").click(()=>{
		socket.emit("client-send-message", $("#message").val());
	});

	$("#message").focusin(()=>{
		socket.emit("client-typing");
	});

	$("#message").focusout(()=>{
		socket.emit("client-stop-typing");
	});
});