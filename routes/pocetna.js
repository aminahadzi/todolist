var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    //ucitava se pocetni ekran gdje user moze izabrati hoce li login ili register da uradi
    res.render('pocetni');
});

module.exports = router;
