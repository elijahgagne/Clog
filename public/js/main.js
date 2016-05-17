$(function () {
	// Initialize variables
	var $window = $(window);
	var $inputMessage = $('.inputMessage'); // Input message input box
  var $currentInput = $inputMessage.focus();
  var $messages = $('.messages'); // Messages area
	var $chatPage = $('.chat.page'); // The chatroom page
 	var socket;
  openWebSocket();
  $chatPage.show();
	
	// https://learn.jquery.com/events/introduction-to-custom-events/
	$(document).on("myCustomEvent", { testing: 123 }, function (event, data) {
		console.log(data);
	});
	
	function openWebSocket() {
		wsURL = ((location.protocol == "http:") ? "ws:" : "wss:") + "//" + window.location.host + "/websocket";
		console.log("Connecting to websocker URL: " + wsURL);
		socket = new WebSocket(wsURL);
		
		socket.onmessage = function (e) {
			var data = JSON.parse(e.data);
			
			$(document).trigger("myCustomEvent", data);
			
			switch (data.ns) {
				case "chat":
					switch (data.cmd) {
						case "join":
							console.log('join chat');
							break;
						case "new message":
							addChatMessage(data);
							break;
						default:
							console.log('unknown/unspecified cmd');
					}
					break;
				case "system":
					switch (data.cmd) {
						case "connected":
							console.log('WebSocket Connected');
							break;
						default:
							console.log('unknown/unspecified cmd');
					}
					break;
				default:
					console.log('unknown/unspecified namespace');
			}
		};
		
		socket.onclose = function (e) {
			openWebSocket();
    };
    
    setTimeout(function () { joinChat() }, 2000);
	}
	
	function joinChat() {
		socket.send(JSON.stringify({ "ns": "system", "cmd": "set name", "name": "temp_ewg" }));
		socket.send(JSON.stringify({ "ns": "chat", "cmd": "join" }));
	}
	
	function sendMessage() {
		var message = $inputMessage.val();
		message = cleanInput(message);
		if (message) {
			$inputMessage.val('');
			//addChatMessage({username: username, message: message});
			socket.send(JSON.stringify({ "ns": "chat", "cmd": "new message", "msg": message }));
		}
	}
	
	function addChatMessage(data) {
		var $messageBodyDiv = $('<span class="messageBody">').text(data.name + ": " + data.msg);
		$messageBodyDiv.append('<div style="font-size: 11px;">' + data.time + '</div>');
		var $messageDiv = $('<li class="message"/>').append($messageBodyDiv);
		addMessageElement($messageDiv);
	}
	
	function addMessageElement(el) {
		var $el = $(el);
		$messages.append($el);
		$messages[0].scrollTop = $messages[0].scrollHeight;
	}
	
	// Prevents input from having injected markup
	function cleanInput(input) {
		return $('<div/>').text(input).text();
	}
	
	$window.keydown(function (event) {
		// Auto-focus the current input when a key is typed
		if (!(event.ctrlKey || event.metaKey || event.altKey)) {
			$currentInput.focus();
		}
		// When the client hits ENTER on their keyboard
		if (event.which === 13) {
      sendMessage();
		}
	});
	
	// Focus input when clicking on the message input's border
	$inputMessage.click(function () {
		$inputMessage.focus();
	});

});