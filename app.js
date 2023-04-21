


require('dotenv').config();
const express = require("express");
const axios = require("axios");
const app = express();
const mysql = require("mysql");

const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const oneHour = 1000 * 60 * 60 * 1;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));


const PORT = process.env.PORT || 4000;

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:10,
    port:process.env.DB_PORT,
    multipleStatements: true
});

connection.getConnection((err)=>{
    if(err) return console.log(err.message);
    console.log("connected to local mysql db using .env properties");
});

const server = app.listen(PORT, () => {
  console.log(`API started on port ${server.address().port}`);
});


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








app.get('/addalbum', (req, res)=> { 

  let ep = "http://localhost:4000/albumoutput/"

  axios.get(ep).then((response) => {
    let albumdata = response.data;
    res.render('addalbum', {titletext: 'Albums', albumdata});
  });





});


app.get('/display', (req, res)=> {  
  let ep = `http://localhost:4000/albumoutput/ `;

  axios.get(ep).then((response) => {
    let albumdata = response.data;
    res.render('apialbuminfo', {titletext: 'Albums', albumdata});
  });

  });

  

//row id of API output

app.get('/inspect', (req, res)=> { 

    let item_id = req.query.item;
    let endp = `http://localhost:4000/albumoutput/${item_id}`;

      
      axios.get(endp).then((response)=>{
          // res.send(response.data);

          let albumdata = response.data;

          res.render('albuminfo', {albumdata});
    
  
  });

});
  


app.get('/albumoutput', (req, res)=> { 
  let allalbums = `SELECT * From album;`



  db.query(allalbums, (err, data) => {
    if (err) throw err;
    res.json({data});
  });

});


app.get('/albumoutput/:rowid', (req, res)=> { 
    let rowid = req.params.rowid;

  let getalbum = `SELECT album.album_title, album.artist, album.album_desc, album.year_of_release, genre.name, GROUP_CONCAT(song.title SEPARATOR ' ') AS songtitle
  FROM album
  INNER JOIN genre
  ON album.genre_id = genre.genre_id
  INNER JOIN album_tracklist
  ON album.album_id = album_tracklist.album_id
  INNER JOIN song
  ON album_tracklist.song_id = song.song_id
  WHERE album.album_id = ${rowid}
  GROUP BY album.album_id;`

    
    db.query(getalbum, (err, data) => {
      if (err) throw err;
      res.json({data});
    });

});




//Posting stuff to albums
app.get('/addanalbum', (req, res)=> { 
    res.render('addrecord', {message: 'Make your addition to the Stack of Wax'});
});


app.post('/addanalbum', (req, res)=> {  

  let album = req.body.albumField;
  let artist = req.body.artistField;
  let albumyear = req.body.albumyear;
  let desc = req.body.descField;
  let genre = req.body.genretypes;


  const insertData = { 
    albumField: album,
    artistField: artist,
    albumyear: albumyear,
    descField: desc, 
    genretypes: genre,

};


const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
 }
}

  let endpoint="http://localhost:4000/albumoutput/add";


  axios.post(endpoint, insertData, config).then((response) => {
       
    let insertedid = response.data.respObj.id; 
    let resmessage = response.data.respObj.message;

    // res.send(`${resmessage}. INSERTED DB id ${insertedid}`);

    // res.render('addrecord', { message: `${resmessage}. INSERTED DB id ${insertedid}` });
      res.render('addrecord', { message: `${resmessage}. Would you like to add another?` });

   }).catch((err)=>{
  console.log(err.message);
});

});



app.post('/albumoutput/add', (req, res)=> { 

  let album = req.body.albumField;
  let artist = req.body.artistField;
  let album_desc = req.body.descField;
  let year_of_release = req.body.albumyear
  let genre = req.body.genretypes;



  let addalbum = `INSERT INTO album (album_title, artist, year_of_release, album_desc, genre_id)  
                  VALUES('${album}', '${artist}', ${year_of_release}, '${album_desc}', ${genre} ); `;

  db.query(addalbum, (err, data) => {  
      if(err) {
          res.json({err});
          throw err;
      }

      if(data){
          let respObj ={
              id: data.insertId,
              title: album,
              message: `${album} album added to Stack of Wax`,
          };
          res.json({respObj});
      }
      
  });
});

//Posting song to albums
app.get('/addsong', (req, res)=> { 
  res.render('addasong', {message: 'Add your song to the Stack of Wax'});
});



//Posts song through axios on the web app
app.post('/addsong', (req, res)=> {  

let title = req.body.titleField;
let time = req.body.timeField;



const insertData = { 
  titleField: title,
  timeField: time,

};


const config = {
headers: {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
}
}

let endpoint="http://localhost:4000/songoutput/add";


axios.post(endpoint, insertData, config).then((response) => {
     
  let insertedid = response.data.respObj.id; 
  let resmessage = response.data.respObj.message;

  // res.send(`${resmessage}. INSERTED DB id ${insertedid}`);

  // res.render('addrecord', { message: `${resmessage}. INSERTED DB id ${insertedid}` });
    res.render('addasong', { message: `${resmessage}. Would you like to add another?` });

 }).catch((err)=>{
console.log(err.message);
});

});

//adding a song to Stack of Wax, the API route
app.post('/songoutput/add', (req, res)=> { 

  let title = req.body.titleField;
  let time = req.body.timeField;
 



  let addsong = `INSERT INTO song (title, time)  
                  VALUES('${title}', '${time}'); `;

  db.query(addsong, (err, data) => {  
      if(err) {
          res.json({err});
          throw err;
      }

      if(data){
          let respObj ={
              id: data.insertId,
              message: `${title} added to Stack of Wax`,
          };
          res.json({respObj});
      }
      
  });
});

//gets song amd albums, uses for each loop to display them in select
app.get('/addsongtoalbum', (req, res)=> { 

  let ep = `http://localhost:4000/songstoalbums/ `;

  axios.get(ep).then((response) => {
    let albumandsonginfo = response.data;
    res.render('addsongtoalbum', {message: 'Albums', albumandsonginfo});
  });

});


//sql query run to get the songs and albums, nothing shared between rows, ergo 1=1 to ensure join
app.get('/songstoalbums', (req, res)=> { 
  // let songtoalbums = `SELECT album.album_id, album.album_title, song.song_id, song.title
  // FROM album
  // INNER JOIN song
  // WHERE 1 = 1;`

  let songtoalbums = ` SELECT album.album_id, album.album_title, NULL AS song_id, NULL AS title
  FROM album
  UNION
  SELECT NULL AS album_id, NULL AS album_title, song.song_id, song.title
  FROM song;`


  db.query(songtoalbums, (err, data) => {
    if (err) throw err;
    res.json({data});
  });

});


//web page to link song to album.
app.post('/addsongtoalbum', (req, res)=> {  

  let albumValue = req.body.albumValue;
  let songValue = req.body.songValue;
  
  console.log(req.body.albumValue);
  console.log(req.body.songValue);
  
  
  const insertData = { 
    albumValue: albumValue,
    songValue: songValue,
  
  };
  
  
  const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  }
  
  let endpoint="http://localhost:4000/albumtracklist/add";
  
  
  axios.post(endpoint, insertData, config).then((response) => {
       
    let insertedid = response.data.respObj.id; 
    let resmessage = response.data.respObj.message;
  
    // res.send(`${resmessage}. INSERTED DB id ${insertedid}`);
  


    // res.render('addrecord', { message: `${resmessage}. INSERTED DB id ${insertedid}` });
      // res.redirect('addsongtoalbum', {message: 'Your song and album have been joined in the Stack of Wax, would you like to add another?', albumandsonginfo})
  
   }).catch((err)=>{
  console.log(err.message);
  });


  let ep = `http://localhost:4000/songstoalbums/ `;

  axios.get(ep).then((response) => {
    let albumandsonginfo = response.data;
    res.redirect('addsongtoalbum');
  });
  
  });



  //API route to link album and song together. Redirects back to page to add another. 
app.post('/albumtracklist/add', (req, res)=> { 

  let album = req.body.albumValue;
  let song = req.body.songValue;



  let addtracklist =  `INSERT INTO album_tracklist (album_id, song_id)  
                        VALUES(${album}, ${song}); `;

                 

  db.query(addtracklist, (err, data) => {  
      if(err) {
          res.json({err});
          throw err;
      }

      if(data){
          let respObj ={
              id: data.insertId,
              message: `Your song and album have have been joined in the Stack of Wax`,
          };
          res.json({respObj});
      }
      
  });
});


app.post('/addsongtoalbum', (req, res)=> {  

  let albumValue = req.body.albumValue;
  let songValue = req.body.songValue;
  
  console.log(req.body.albumValue);
  console.log(req.body.songValue);
  
  
  const insertData = { 
    albumValue: albumValue,
    songValue: songValue,
  
  };
  
  
  const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  }
  
  let endpoint="http://localhost:4000/albumtracklist/add";
  
  
  axios.post(endpoint, insertData, config).then((response) => {
       
    let insertedid = response.data.respObj.id; 
    let resmessage = response.data.respObj.message;
  
    // res.send(`${resmessage}. INSERTED DB id ${insertedid}`);
  


    // res.render('addrecord', { message: `${resmessage}. INSERTED DB id ${insertedid}` });
      // res.redirect('addsongtoalbum', {message: 'Your song and album have been joined in the Stack of Wax, would you like to add another?', albumandsonginfo})
  
   }).catch((err)=>{
  console.log(err.message);
  });


  let ep = `http://localhost:4000/songstoalbums/ `;

  axios.get(ep).then((response) => {
    let albumandsonginfo = response.data;
    res.redirect('addsongtoalbum');
  });
  
  });

//rendering webapp  to review album
// app.get('/review', (req, res)=> { 


//   //get user cookie for authentication
//    let userId = req.session.authen;

   
//    let getUser = "SELECT * FROM auth_user WHERE user_id = ?";
 
//    db.query(getUser, [userId], (err, rows) => {
//      if (err) throw err;
 
     
//      if (rows.length > 0) {
//        let user = rows[0];
//        res.render('review', {user});
//      } else {
      
//        res.redirect('/')
//      }
//    });

//   let ep = `http://localhost:4000/albumsavailable/ `;

//   axios.get(ep).then((response) => {
//     let albumavailable = response.data;
//     res.render('postalbumreview', {message: 'Albums', albumavailable});
//   });

// });

// app.get('/review', (req, res)=> {

//   let sessionobj = req.session;
  
//   if(sessionobj.authen){
//     let userid = sessionobj.authen;
//     let user = "SELECT * FROM auth_user WHERE user_id = ?";

//     db.query(user, [userid], (err, row) => {
//       let firstrow = row[0];
//       res.render('home', {userdata:firstrow});
//     });
//   let userId = req.session.authen;

//   let getUser = "SELECT * FROM auth_user WHERE user_id = ?";

 

//       let ep = `http://localhost:4000/albumsavailable/`;
      
//       axios.get(ep).then((response) => {
//         let albumavailable = response.data;
//         res.render('postalbumreview', {message: 'Albums', albumavailable, user});
//       }).catch((error) => {
//         console.log(error);
//         res.status(500).send('Internal server error');
//       });
//     } else {
//       res.redirect('/');
//     }
// });

// app.get('/review', (req, res)=> { 


//   //get user cookie for authentication
//     console.log(req.session.authen);
//    let userId = req.session.authen;
//    console.log(userId);

   
//    let getUser = "SELECT * FROM auth_user WHERE user_id = ?";
 
//    db.query(getUser, [userId], (err, rows) => {
//      if (err) throw err;
 
     
//      if (rows.length > 0) {
//        let user = rows[0];
//        res.render('postalbumreview', {user});
//      } else {
      
//        res.redirect('/')
//      }
//    });

//   let ep = `http://localhost:4000/albumsavailable/ `;

//   axios.get(ep).then((response) => {
//     let albumavailable = response.data;
//     res.render('postalbumreview', {message: 'Albums', albumavailable});
//   });

// });

app.get('/review', (req, res) => {

  let sessionobj = req.session;
  
  if(sessionobj.authen){
    let userId = sessionobj.authen;
    let user = "SELECT * FROM auth_user WHERE user_id = ?";

    db.query(user, [userId], (err, row) => {
      let firstrow = row[0];

      let ep = `http://localhost:4000/albumsavailable/`;
      
      axios.get(ep).then((response) => {
        let albumavailable = response.data;
        res.render('postalbumreview', {message: 'Albums', albumavailable, user: firstrow});
      }).catch((error) => {
        console.log(error);
        res.status(500).send('Internal server error');
      });
    });
  } else {
    res.redirect('/');
  }
});



//Posts song through axios on the web app
app.post('/review', (req, res)=> {  
  let reviewcontent = req.body.descField;
  let userid = req.body.userid;
  let album = req.body.albumValue;

  console.log(req.body.descField);
  console.log(req.body.userid);
  console.log(req.body.albumValue)


  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  };

  let endpoint="http://localhost:4000/addingreview/";

  let insertData = `descField=${reviewcontent}&userid=${userid}&albumValue=${album}`;

  axios.post(endpoint, insertData, config).then((response) => {
    // console.log(response.data);
    // console.log(response.data.respObj.message);      
    // let insertedid = response.data.data.insertId; 
    // let resmessage = response.data.respObj.message;

    // res.send(`${resmessage}. INSERTED DB id ${insertedid}`);
    res.redirect('/review');
  }).catch((err)=>{
    console.log(err.message);
  });
});


// app.post('/addingreview', (req, res)=> { 

//   let reviewcontent = req.body.descField;
//   let userid = req.body.userid;

//   console.log(reviewcontent, userid);
//   let addreview =  `INSERT INTO review (review_content, user_id)  
//                         VALUES('${reviewcontent}', ${userid}); `;


//   db.query(addreview, (err, data) => {
//     if (err) throw err;
//     res.json({data});

//     let addAlbumTracklist = `INSERT INTO album_tracklist (album_id, review_id,)  
//     VALUES (${album_id}, ${review_id}, '');`;

//     db.query(addtoAlbumTracklist, (err, result) => {
//       if (err) throw err;

//       res.json({ message: 'Review added and album tracklist updated' });
//   });
//   });
// });

app.post('/addingreview', (req, res) => {
  let reviewcontent = req.body.descField;
  let userid = req.body.userid;
  let album_id = req.body.albumValue;

  console.log(reviewcontent, userid);

  let addreview = `INSERT INTO review (review_content, user_id) VALUES('${reviewcontent}', ${userid})`;

  db.query(addreview, (err, result) => {
    if (err) throw err;

    // Get the last inserted review id
    let review_id = result.insertId;

    let addtoAlbumTracklist = `INSERT INTO album_review (album_id, review_id)  
    VALUES (${album_id}, ${review_id});`;

    db.query(addtoAlbumTracklist, (err, result) => {
      if (err) throw err;

      res.json({ message: 'Review added and album reviewlist updated' });
    });
  });
});





//displaying review page and sql query to get all albums 
app.get('/albumsavailable', (req, res)=> { 


  let albumsavailable = ` SELECT * FROM album;`



  db.query(albumsavailable, (err, data) => {
    if (err) throw err;
    res.json({data});
  });

});



app.get('/addtoreviewlist', (req, res)=> { 


  let songtoalbums = ` SELECT * FROM album;`


  db.query(songtoalbums, (err, data) => {
    if (err) throw err;
    res.json({data});
  });

});











//Log in 
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", (req, res) => {
  let username = req.body.emailString;
  let userpassword = req.body.passwordString;

  let checkuser = "SELECT * FROM auth_user WHERE username = ? AND password = ?";

  db.query(checkuser, [username, userpassword], (err, rows) => {
    if (err) throw err;
    let numRows = rows.length;

    if (numRows > 0) {
      let sessionobj = req.session;
      sessionobj.authen = rows[0].user_id;
      res.redirect('/home');
    } else {
      res.redirect('/')
    }
  });
});


app.get("/register", (req, res) => {
  res.render("register");
});

app.post('/admin/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let usertype = req.body.status;


  
  let albumsql = "INSERT INTO auth_user (username, password, first_name, last_name, status) VALUES( ? , ? , ? , ? , ?)";
  db.query(albumsql,[username, password, firstname, lastname, usertype],(err, rows)=>{
    if(err) throw err;
    res.redirect('/');
});
});

app.get('/home', (req,res) => {
  let sessionobj = req.session;
  if(sessionobj.authen){
    let userid = sessionobj.authen;
    let user = "SELECT * FROM auth_user WHERE user_id = ?";

    db.query(user, [userid], (err, row) => {
      let firstrow = row[0];
      res.render('home', {userdata:firstrow});
    });
      
  }else{
      res.send("Access has been denied");
  } 
});


app.get('/session', (req, res) => {
  console.log(req.session); // print out the session object
  res.send('Session information printed to console'); // send a response back to the client
});

//gets song amd albums, uses for each loop to display them in select
app.get('/addsongtoalbum', (req, res)=> { 

  let ep = `http://localhost:4000/songstoalbums/ `;

  axios.get(ep).then((response) => {
    let albumandsonginfo = response.data;
    res.render('addsongtoalbum', {message: 'Albums', albumandsonginfo});
  });

});




//sql query run to get the songs and albums, nothing shared between rows, ergo 1=1 to ensure join
app.get('/songstoalbums', (req, res)=> { 
  // let songtoalbums = `SELECT album.album_id, album.album_title, song.song_id, song.title
  // FROM album
  // INNER JOIN song
  // WHERE 1 = 1;`

  let songtoalbums = ` SELECT album.album_id, album.album_title, NULL AS song_id, NULL AS title
FROM album
UNION
SELECT NULL AS album_id, NULL AS album_title, song.song_id, song.title
FROM song;`



  db.query(songtoalbums, (err, data) => {
    if (err) throw err;
    res.json({data});
  });

});


//API to join songs and albums together
app.post('/albumtracklist/add', (req, res)=> { 

  let album_id = req.body.albumValue;
  let song_id = req.body.songValue;


  let tracklistquery = `INSERT INTO album_tracklist (album_id, song_id)  
                    VALUES(${album_id}, ${song_id});`


  db.query(tracklistquery, (err, data) => {  
      if(err) {
          res.json({err});
          throw err;
      }

      if(data){
          let respObj ={
              id: data.insertId,
              message: `Tracklist updated`,
          };
          res.json({respObj});
      }
      
  });
});











app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running at port 3000");
});




