(function (chatController) {
  
  var auth = require("../auth");
  
  chatController.init = function (app) {
    
    app.get("/chat", function (req, res) {
      res.render("chat", {
        layout: "layout",
        title: "Clog",
        user: auth.getUsername(req)
      });
    });

  }


})(module.exports)