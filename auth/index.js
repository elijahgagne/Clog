// /auth/index.js
(function (auth) {
	var jwt = require('jwt-simple')
	  , moment = require('moment');
	
	// JWT config
	var jwtTokenSecret = 'm7A03LwUN5VCXYw0';
	
	auth.ensureAuthenticated = function (req, res, next) {
		var token = req.cookies['access_token'] || (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
		if (token) {
			try {
				var decoded = jwt.decode(token, jwtTokenSecret);
				req.user = decoded.iss;
				next();
			} catch (err) {
				return res.end('Authentication error', 400);
			}
		}
		return res.end('No auth token found', 400);
  };
  
  auth.getUsername = function (req) {
    var token = req.cookies['access_token'] || (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    return auth.getUsernameFromToken(token);
  };
  
  auth.getUsernameFromToken = function (token) {
    if (token) {
      try {
        var decoded = jwt.decode(token, jwtTokenSecret);
        return decoded.iss;
      } catch (err) { }
    }
    return "";
  }

	auth.init = function (app) {
		app.get("/login", function (req, res) {
			if (req.query.guest == "true") {
				res.render("guest-login.ejs", {
					layout: "layout",
					title: "Clog - login"
				});
			} else {
				res.status(401).send("Login method not supported");
			}
		});
		
		app.post("/login", function (req, res) {
			if (req.query.guest == "true" && req.body.username) {
				var token = jwt.encode({
					iss: req.body.username
				}, jwtTokenSecret);
				res.cookie('access_token', token, { maxAge: 604800000, httpOnly: true });
				res.redirect("/");
			} else {
				res.status(401).send("Login method not supported");
			}
		});
    
    app.get("/logout", function (req, res) {
      res.clearCookie("access_token");
      res.redirect("/");
    });

	}

})(module.exports);