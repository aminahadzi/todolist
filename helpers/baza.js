var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('baza'); //ako ne postoji, pravi se baza 'baza', a ako postoji, koristi se ona

var setupDB = function () {
    // pomocu ove funkcije postavljamo nasu bazu na samom pocetku pokretanja stranice
    // ako je prvi put, tabele ce se kreirati
    // ako nije, ne desi se nista iz ove funkcija
    // ovu funkciju pozivamo u app.js
  db.run(
      "CREATE TABLE IF NOT EXISTS korisnik(" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
      "username TEXT UNIQUE NOT NULL," +
      "password TEXT NOT NULL)"
  );

  db.run(
      "CREATE TABLE IF NOT EXISTS todo(" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
      "id_username INTEGER NOT NULL," +
      "task TEXT NOT NULL," +
      "FOREIGN KEY (id_username) REFERENCES korisnik(id) )"
  );
};


var getUserID = function (user) {
    // vraca ID nekog usera, brza je pretraga sa INT kao primarnim kljucem
    db.get(
        "SELECT id FROM korisnik WHERE username=?",
        [user],
        function (err, row) {
            if(err) {
                return console.log(err.message);
            }
            console.log("id od "+user+" je "+row.id);
            return row.id;
        }
    );
};

var addUser = function (user, pass, log_in){
    //na ovaj nacin mi kreiramo korisnika i ubacujemo u bazu
    db.run(
        "INSERT INTO korisnik(username, password) VALUES(?, ?)",
        [user, pass],
        function (err) {
            if(err){
                return console.log(err.message);
            }
            log_in();
            console.log("Korisnik uspjesno dodat u tabelu");
        }
    );
};

var checkUser = function (user, exists) {
    // s ovim pri registraciji provjeravamo da li je zauzeto korisnicko ime ili ne
    db.get(
       "SELECT COUNT(*) AS broj FROM korisnik WHERE username=?",
       [user],
       function (err, row) {
           if(err){
               return console.log(err.message);
           }
           if(row.broj === 1) exists(true);
           else exists(false);
       }
    );
};

var checkUserPass = function (user, pass, ispravno) {
    // s ovim provjeravamo da li postoji user u nasoj bazi
    db.get(
        "SELECT COUNT(*) AS broj FROM korisnik WHERE username=? AND password=?",
        [user, pass],
        function (err, row) {
            if(err){
                return console.log(err.message);
            }
            if(row.broj === 1){
                ispravno(true);
            } else{
                ispravno(false);
            }
        }
    );
};

var addTask = function (user, task, reload){
    // s ovim dodajemo novi task korisniku nekom
    db.run(
        "INSERT INTO todo(id_username, task) " +
        "VALUES(" +
            "(SELECT id " +
            "FROM korisnik " +
            "WHERE username=?), " +
        "?)",
        [user, task],
        function (err) {
            if(err){
                return console.log(err.message);
            }
            console.log("Task uspjesno dodat u tabelu");
            reload();
        }
    );
};

var getTasks = function(user, render_tasks){
    // s ovim dobijamo spisak taskova,
    // ovo koristimo kada zelimo ispisati sve taskove korisniku
    db.all(
        "SELECT task " +
        "FROM todo " +
        "INNER JOIN korisnik ON korisnik.id=todo.id_username " +
        "WHERE korisnik.username=?",
        [user],
        function (err, rows) {
            if(err){
                console.log(err.message);
            }

            var user_tasks = [];
            rows.forEach(function (row) {
                console.log(row.task);
                user_tasks.push(row.task);
            });

            render_tasks(user_tasks);
        }
    );
};

var deleteTask = function(user, task) {
    db.run(
        "DELETE FROM todo WHERE user=? AND task=?",
        [user, task],
        function (err) {
            if(err){
                console.log(err.message);
            }
            console.log("Task uspjesno izbrisan iz baze");
        }
    );
};

// sada kada smo kreirali sve nase pomocne metode, trebamo ih exportovati
// tj. nabrojati koje metode su dozvoljene nekom da koristi odavde

module.exports = {
    "db": db,
    "serialize": db.serialize,
    "setupDB": setupDB,
    "addUser": addUser,
    "addTask": addTask,
    "getUserID": getUserID,
    "checkUserPass": checkUserPass,
    "checkUser": checkUser,
    "getTasks": getTasks
};