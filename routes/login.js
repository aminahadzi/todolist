var express = require('express');
var router = express.Router();

var crypt = require("../helpers/crypto");
var db = require("../helpers/baza");

router.get('/', function(req, res, next) {
    res.render('login_forma');
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

    console.log('Korisnik se pokusava ulogovati');
    console.log("Trebamo provjeriti da li se on nalazi u nasoj bazi korisnika");

    db.checkUserPass(
        trenutni_user.username,
        crypt.encrypt(trenutni_user.pswd),
        function (ispravno) {
            if(ispravno){
                console.log("Korisnik i sifra su ispravni, moze se ulogovati");
                req.session.username = trenutni_user.username;
                res.redirect('/todo');
            } else {
                res.render('notlog', {
                    vrsta_problema: "Sifra nije ispravna ili korisnik ne postoji, molim Vas unesite ponovo"
                });
            }
        }
    )
});

module.exports = router;
