const net = require('net');
const getArrayOfQA = require('./getArrayOfQA');

const port = 8124;

const client = new net.Socket();
let questionAndAnswers = getArrayOfQA('qa.json');

client.setEncoding('utf8');

client.connect(port, function (err) {
	if (err) {
		throw err;
	}
	console.log('Connected');
	client.write("REMOTE");
});

let counter = 0;
let isConnected = false;
client.on('data', function (data) {
	console.log("Received from server: " + data);
	if (isConnected) {

		if (counter === questionAndAnswers.length) {
			client.destroy();
			process.exit(0);
		}
		else {
			client.write(`Question: ${questionAndAnswers[counter++].question}`);
		}
	}
	else {
		if (data === "ACK") {
			isConnected = true;
			client.write(`COPY  ${process.argv[2]}  ${process.argv[3]}`);
		}
		else {
			client.destroy();
			process.exit(0);
		}
	}

});

client.on('close', function () {
	console.log('Connection closed');
});
