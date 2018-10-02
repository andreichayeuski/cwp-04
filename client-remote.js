const net = require('net');

const port = 8124;

const client = new net.Socket();
client.setEncoding('utf8');

// let countOfArgs = 0;
// process.argv.forEach((element)=>
// {
// 	countOfArgs += 1;
// });
//
// if (countOfArgs != 5)
// {
// 	console.log("Don't found an argument");
// 	process.exit(1);
// }
client.connect(port, function (err) {
	if (err) {
		throw err;
	}
	console.log('Connected');
	client.write("REMOTE");
});

let isConnected = false;
client.on('data', function (data) {
	console.log("Received from server: " + data);
	if (isConnected) {
	}
	else {
		if (data === "ACK") {
			isConnected = true;
			console.log(`${process.argv[2]} \"${process.argv[3]}\" \"${process.argv[4]}\" ${process.argv[5] === undefined ? "" : process.argv[5]}`);
			client.write(`${process.argv[2]} \"${process.argv[3]}\" \"${process.argv[4]}\" ${process.argv[5] === undefined ? "" : process.argv[5]}`);
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
