var express = require('express');
var router = express.Router();
var fs = require('fs');
var db = require('../helpers/baza');

  
router.get('/', function(req, res, next) {
    var username = req.session.username;
    console.log(req.session);

    db.getTasks(username, function (izgradjena_lista) {
        res.render('todo', {
            lista: izgradjena_lista,
            username: username
        });
    });
});

router.post('/', function(req, res, next){
    var username = req.session.username;
    var novi_task = req.body.task;
    console.log("Novi task je: "+novi_task+" by "+username);
    console.log(db.getUserID(username));
    db.addTask(username, novi_task, function () {
        res.redirect('/todo');
    });
});

module.exports = router;
