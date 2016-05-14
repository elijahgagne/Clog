(function (homeController) {
	
	homeController.init = function (app) {
		
		app.get("/", function (req, res) {
			res.render("index", {
				layout: "layout",
				title: "Clog"
			});
		});

	}


})(module.exports)