(function (controllers) {
  
	var homeController = require("./homeController.js");
	var websocketController = require("./websocketController.js");
    
  controllers.init = function (app, server, ws) {
		homeController.init(app);
		websocketController.init(app, server, ws);

		app.use(function (req, res) {
			res.status(404).render("404", { layout: "404.ejs", url: req.url });
		});
  };

})(module.exports);

