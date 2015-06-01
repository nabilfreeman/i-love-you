//this is to figure out later on if the source of a realtime message came from this browser instance. the timestamp / random number combo is to minimize  UID conflicts.
var current_timestamp = Math.floor(Date.now() / 1000).toString();
var random_number = Math.floor(Math.random() * 1000000000).toString();
var identifier = current_timestamp + "" + random_number;

//play a sound when a ripple occurs using the WebAudio API.
var sound;

function playSound() {
	if(sound !== undefined){
	    var source = audio_context.createBufferSource();
	    source.buffer = sound;
	    source.connect(audio_context.destination);

	    source.start(0);
	}
}

//check that our browser supports the web audio api.
if(window.AudioContext || window.webkitAudioContext){
	var audio_url = '/sounds/hero.mp3';

	var audio_context = new (window.AudioContext || window.webkitAudioContext)();
	var sound_request = new XMLHttpRequest();
	sound_request.open('GET', audio_url, true);
	sound_request.responseType = 'arraybuffer';
	sound_request.onload = function() {
	    audio_context.decodeAudioData(sound_request.response, function(buffer) {
	        sound = buffer;
	    });
	};
	sound_request.send();
}

//set up our canvas data.
var canvas = document.querySelector("#ripples");
var canvas_data = {
	center_x: 0,
	center_y: 0
};
var ctx = canvas.getContext('2d');
var ripples = [];
// set channame based #
var channame = (Boolean(location.hash)) ? location.hash.substr(1) : "default_chan_name"

//simple function. cut off the first 1/10th of a second from the audio file to make rapid playing sound good.
//also, if the ripple is "mine" i.e. this user triggered the ripple, format it differently.
var ripple = function(mine){
	playSound();

	var obj = {
		size: 0,
		opacity: 1,
		mine: false
	};

	if(mine){
		obj.mine = true;
	}

	ripples.push(obj);
}

var updateCanvasData = function(){
	canvas.setAttribute("width", window.innerWidth * 2);
	canvas.setAttribute("height", window.innerHeight * 2);
	canvas_data.center_x = window.innerWidth;
	canvas_data.center_y = window.innerHeight;
};

window.addEventListener("resize", updateCanvasData);
updateCanvasData();

var draw = function(){
	requestAnimationFrame(draw);

	//wipe the frame.
	ctx.clearRect(0, 0, window.innerWidth * 2, window.innerHeight * 2);

	//for each ripple in existence...
	ripples.forEach(function(obj, index){
		//increment circle size and draw the cirlce.
		obj.size += 6;

		ctx.beginPath();
		ctx.arc(
			canvas_data.center_x, 
			canvas_data.center_y, 
			obj.size, 0, 2 * Math.PI, 
			false
		);

		//fade out the object. 
		//this gradation was calculated with 1/(1000/6) to reduce at the same race as circle grows.
		obj.opacity -= 0.006;

		ctx.fillStyle = 'transparent';
		ctx.fill();
		ctx.lineWidth = 2;

		//depending on whether the ripple was user triggered or server triggered, set color to white/black.
		if(obj.mine){
			ctx.strokeStyle = 'rgba(255,255,255,' + obj.opacity + ")";
		} else {
			ctx.strokeStyle = 'rgba(0,0,0,' + obj.opacity + ")";
		}

		ctx.stroke();

		//delete the ripple from our array when it gets too big.
		if(obj.size > 1000){
			ripples.splice(index, 1);
		}
	});
}

draw();

//simple FAYE code
// var client = new Faye.Client("http://localhost:8123");
var client = new Faye.Client("http://cosmic-nfrmn.rhcloud.com:8000");
client.subscribe("/"+channame, function(message){
	//we are already providing instant response to the user when they click a heart, so we want to disregard the message from the server if it is that same user.
	if(message.sender !== identifier){
		ripple(false);
	}
});

var heart = document.querySelector("#heart");
var handler = function(e){
	e.preventDefault();
	client.publish('/'+channame, {sender: identifier});
	ripple(true);
	return false;
}

heart.addEventListener("click", handler);
heart.addEventListener("touchstart", handler);