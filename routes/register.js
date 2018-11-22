var express = require('express');
var router = express.Router();
var db = require('../helpers/baza'); // s ovim smo importovali metode iz pomocnog fajla baza.js
var crypt =require('../helpers/crypto');


router.get('/', function(req, res, next) {
    // ucitava se register forma
    // ovdje je bitno provjeriti da li je username zauzet
    // u nasoj bazi username je definisan kao unique atribut

    res.render('register_forma');
});

router.post('/', function(req, res, next){
    console.log(req.body);
    console.log(
        "Trenutni user je: "+req.body.username+' '+req.body.pswd
    );

    var trenutni_user = {
        username: req.body.username,
        pswd: req.body.pswd
    };

    console.log('Korisnik se pokusava registrovat');
    db.checkUser(
        trenutni_user.username,
        function (zauzeto) {
            if(zauzeto) {
                console.log("Zauzeto ime");
                res.render('registered');
                next();
            } else{
                db.addUser(
                    trenutni_user.username,
                    crypt.encrypt(trenutni_user.pswd),
                    function () {
                        req.session.username = trenutni_user.username;
                        res.redirect('/todo');
                    }
                )
            }

        }
    )
});

module.exports = router;
