var http = require("http");
var faye = require("faye");

var server = http.createServer();

var i = new faye.NodeAdapter({
	mount: "/",
	timeout: 45
});

i.attach(server);

var port = process.env.port !== undefined ? process.env.port : 80;

console.log("Attempting to listen on port " + port + "...");
server.listen(process.env.port);