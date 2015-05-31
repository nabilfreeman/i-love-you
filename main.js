var http = require("http");
var faye = require("faye");

//easier than socket.io, right?
var server = http.createServer();

//i for input
var i = new faye.NodeAdapter({
	mount: "/",
	timeout: 45
});

i.attach(server);


//defaults: port 80 & 127.0.0.1. you can override this with "port=1234 node X.js" on CLI
var port = process.env.port !== undefined ? process.env.port : 80;
var ip = "127.0.0.1";

//RedHat Openshift stuff. ignore or delete if you are not hosting on Openshift.
port = process.env.OPENSHIFT_NODEJS_PORT !== undefined ? process.env.OPENSHIFT_NODEJS_PORT : port;
ip = process.env.OPENSHIFT_NODEJS_IP !== undefined ? process.env.OPENSHIFT_NODEJS_IP : ip;

console.log("Attempting to listen on " + ip + ":" + port + "...");
server.listen(port, ip);