var http = require("http");
var faye = require("faye");

var server = http.createServer();

var i = new faye.NodeAdapter({
	mount: "/",
	timeout: 45
});

i.attach(server);
server.listen(8123);