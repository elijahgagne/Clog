var http = require("http")
 ,  express = require('express')
 ,  app = express()
 ,  ws = require('ws')
 ,  expressLayouts = require('express-ejs-layouts')
 ,  controllers = require("./controllers");

// Server config
var port = process.env.port || 5000;
var server = http.createServer(app);

// View config
app.set('view engine', 'ejs');
app.set("layout extractScripts", true);
app.use(expressLayouts);

// Public static resources
app.use(express.static(__dirname + "/public"));

// Controller initialization
controllers.init(app, server, ws);

// Start server
server.listen(port, function () {
	console.log('Express server listening on port ' + port);
});



