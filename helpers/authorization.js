var db = require('../helpers/baza');

var authorization = function(req, res, next){
    if(
        req.session.username == null
    ){
        if (
            req.path !== "/register" &&
            req.path !== "/login" &&
            req.path !== "/"
        ){
            console.log("Nema dodijeljen username u sesiji, vrati ga na pocetnu");
            res.redirect("/");
            next();
        } else {
            next();
            return;
        }
    } else if(
        req.session.username != null
    ) {
        db.checkUser(req.session.username, function (postoji) {
            if(postoji){
                console.log("Postoji u bazi");
            } else{
                console.log("Ne postoji u bazi");
                req.session.username = null;
                res.redirect("/");
            }
        });
        next();
    }
};

module.exports = authorization;
