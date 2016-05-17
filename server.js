// Packages and controllers
var http           = require("http")
  , express        = require('express')
  , app            = express()
  , bodyParser     = require("body-parser")
	, cookieParser   = require("cookie-parser")
  , ws             = require('ws')
  , expressLayouts = require('express-ejs-layouts')
  , controllers    = require("./controllers")
	, auth           = require("./auth");

// Enable services
app.use(express.static(__dirname + "/public"));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Enable authentication
auth.init(app);

// View config
app.set('view engine', 'ejs');
app.set("layout extractScripts", true);

// Server config
var port = process.env.port || 5000;
var server = http.createServer(app);

// Controller initialization
controllers.init(app, server, ws);

// Start server
server.listen(port, function () { console.log('Express server listening on port ' + port); });
