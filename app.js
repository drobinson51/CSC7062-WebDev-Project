const express = require("express");
const app = express();
const mysql = require("mysql");

const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const oneHour = 1000 * 60 * 60 * 1;

app.set("view engine", "ejs");




app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use( sessions({
    secret: "stacksofwax1234567",
    saveUninitialized: true,
    cookie: { maxAge: oneHour },
    resave: false,
  })
);



let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cs7062project",
  port: "3306",
});

db.connect((err) => {
  if (err) throw err;
});



app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", (req, res) => {
  let useremail = req.body.emailString;
  let userpassword = req.body.passwordString;

  let checkuser = "SELECT * FROM my_users WHERE email = ? AND password = ?";

  db.query(checkuser, [useremail, userpassword], (err, rows) => {
    if (err) throw err;
    let numRows = rows.length;

    if (numRows > 0) {
      let sessionobj = req.session;
      sessionobj.authen = rows[0].id;
      res.redirect('/home');
    } else {
      res.redirect('/')
    }
  });
});


app.get('/home', (req,res) => {
  let sessionobj = req.session;
  if(sessionobj.authen){
    let userid = sessionobj.authen;
    let user = "SELECT * FROM my_users WHERE id = ?";

    db.query(user, [userid], (err, row) => {
      let firstrow = row[0];
      res.render('home', {userdata:firstrow});
    });
      
  }else{
      res.send("Access has been denied");
  } 
});

app.get('/admin/add', (req, res) => {
  res.render("addrecord");
});

app.post('/admin/add', (req, res) => {
    let albumname = req.body.albumField;
    let artistname = req.body.artistField;
    let albumdesc = req.body.descField;
    // let albumdesc = "Troubleshooting as we speak";
    let releaseyear = req.body.albumyear;
    let genre = req.body.genretypes;

    if (genre === 'Nu Metal') {
      genre = 1;
    } else if (genre === 'Rock n Roll') {
      genre = 2;
    }
    
    // res.send(`You have not added ${albumname}, ${artistname}, ${albumdesc}, ${releaseyear}, ${genre}`);
    let albumsql = "INSERT INTO album (album_title, artist, album_desc, year_of_release, genre_id) VALUES( ? , ? , ? , ? , ?)";
    db.query(albumsql,[albumname, artistname, albumdesc, releaseyear, genre],(err, rows)=>{
      if(err) throw err;
      res.send(`You have added: <p>${albumname}</p> <p>${artistname}</p> <p>${albumdesc}</p> <p>${releaseyear}</p> <p>${genre}</p>` );
  });
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running at port 3000");
});





// app.listen(3000, () => {
//   console.log("Server on port 3000");
// });