(function (websocketController) {

	websocketController.init = function (app, server, ws) {

		app.get('/websocket', function (req, res) {
			res.send({ msg: "websocket endpoint" });
		});

		chats = {};

		wss = ws.Server({ server: server, path: "/websocket" });
		wss.on('connection', function (socket) {
			// you might use location.query.access_token to authenticate or share sessions
			// or socket.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
			var username = "undefined";

			socket.on('message', function (data, flags) {
				console.log('received: %s', data + " " + socket.upgradeReq.url);
				data = JSON.parse(data);
				console.log('ns = ' + data.ns);
				switch (data.ns) {
					case "chat":
						switch (data.cmd) {
							case "join":

								console.log('join');
								var ch = "default";
								if (typeof chats[ch] === 'undefined') {
									chats[ch] = {};
									chats[ch]['log'] = [];
									chats[ch]['clients'] = [];
								}
								chats[ch].clients.push(socket);
								//wss.clients.forEach();
								msgTime = new Date();
								chats[ch].log.forEach(function each(msg) {
									socket.send(JSON.stringify(msg));
								});
								var myMsg = { ns: "chat", cmd: "new message", msg: username + " has joined the chat", name: "System", time: new Date() };
								chats[ch].log.push(myMsg);
								chats[ch].clients.forEach(function each(client) {
									client.send(JSON.stringify(myMsg));
								});
								break;

							case "new message":
								var ch = "default";
								msgTime = new Date();
								var myMsg = { ns: "chat", cmd: "new message", msg: data.msg, name: username, time: msgTime };
								chats[ch].log.push(myMsg);
								chats[ch].clients.forEach(function each(client) {
									client.send(JSON.stringify(myMsg));
								});
								break;

							default:
								console.log('unknown/unspecified cmd');
						}
						break;
					case "system":
						switch (data.cmd) {
							case "set name":
								console.log('cmd: set username: ' + data.name);
								username = data.name;
								break;
							default:
								console.log('unknown/unspecified cmd');
						}
						break;
					default:
						console.log('unknown/unspecified namespace');
				}

				// {ns: "", cmd: "", ch: "", d: ""}

				//wss.clients.forEach(function each(client) {
				//  client.send(data);
				//});
			});

			socket.on('ping', function (data, flags) {
				console.log('ping');
			});

			socket.on('pong', function (data, flags) {
				console.log('pong');
			});

			socket.on('close', function (code, message) {
				console.log('disconnected');
				// Remove socket from all channel
				// Loop through channels
				for (ch in chats) {
					var index = chats[ch].clients.indexOf(socket);
					if (index != -1) {
						chats[ch].clients.splice(index, 1);
						// Notify other clients that user left
						var myMsg = { ns: "chat", cmd: "new message", msg: username + " has left the chat", name: "System", time: new Date() };
						chats[ch].log.push(myMsg);
						chats[ch].clients.forEach(function each(client) {
							client.send(JSON.stringify(myMsg));
						});
					}
				}
			});

			socket.on('error', function (error) {
				console.log('Error from client: %s', error);
			});

			console.log('connected');
			socket.send(JSON.stringify({ ns: "system", cmd: "connected" }));

		});

	}


})(module.exports)