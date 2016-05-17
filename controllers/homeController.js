(function (homeController) {
  
  var auth = require("../auth");

	homeController.init = function (app) {
		
		app.get("/", function (req, res) {
			res.render("index", {
				layout: "layout",
        title: "Clog",
        user: auth.getUsername(req)
			});
		});

	}


})(module.exports)