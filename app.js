var express = require('express');
var app = express();

app.use(express.static('public'));
const B2 = require('backblaze-b2');
// setting pug as view engine
//app.set('views', './views');
app.set('view engine', 'ejs');

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/mydb', (err) => {
  if (err) {
    console.error(err.message);
    exit();
  }
  console.log('Connected to the mydb database.');
});

var filesData = [];
async function getResultsFromDb() {
  let sql = 'SELECT * FROM kirtanlist';
  await db.each(sql, [], (err, row) => {
  if (err) {
    throw err;
  }

  filesData.push({ name:row.name, artist: row.artist, album: row.album, cover_art_url: "img/album-art/die-digital.jpg", duration: row.duration, id: row.id, url: row.url});
  //console.log(`${row.name} ${row.url}`);
  });
  //console.log('test======>');
}
getResultsFromDb();

const b2 = new B2({
  applicationKeyId: 'ac1520ab0f3e', // or accountId: 'accountId'
  applicationKey: '001b8a73c121f3ec8929fe82253ff43c31b22b2028' // or masterApplicationKey
});
var fileNames;
async function listFileNames() {
  try {
    //await b2.authorize(); // must authorize first
    //fileNames = await b2.listFileNames({ bucketId: 'ba2c1135d2701a1b600f031e', maxFileCount: 100 });
    //console.log(fileNames.data);

    app.get('/', function(req, res){
       //let files = JSON.stringify(fileNames.data.files);
       //files = JSON.parse(files);
       //console.log(files);
       //console.log(JSON.stringify(fileNames.data.files[0].fileName));
       var songsJson = JSON.stringify(filesData);
       res.render('index1', {title: 'Hare Krishna', filesData: filesData, songCount: 4, songsJson: songsJson} );
    });
    console.log('app started');
  } catch (err) {
    console.log('Error getting bucket:', err);
  }
}

listFileNames();

//app.get('/api', (req, res) => res.send("Hello World! " + JSON.stringify(fileNames.data.files[0].fileName ) ) );
//console.log(typeof(fileNames));
//console.log(JSON.parse('{ "name": "brijraj"}'));

app.get('/api', function(req, res){
    res.send('this is api response...');
});

const port =  3000;
app.listen(port, () =>
	console.log(`Example app listening on port ${port}!`)
);
