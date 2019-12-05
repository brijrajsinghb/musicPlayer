
const B2 = require('backblaze-b2');

var exec = require('child_process').exec;
var mp3Duration = require('mp3-duration');

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/mydb', (err) => {
  if (err) {
    console.error('Error is '+err.message);
    exit();
  }
  console.log('Connected to the mydb database.');
});

var stream;
var fileName;
var parsedl;

async function downloadFile(line) {
  const fileName = line.replace(/^http?:\/\//,'');
  const exactFileName = fileName.substring(fileName.lastIndexOf('/')+1);
  const localpath = 'audio/'+exactFileName;
  const myexec = await exec('wget -nc -O ' + localpath +' '+line,
     async function (error, stdout, stderr) {
       console.log('stdout: ' + stdout);
       // console.log('stderr: ' + stderr);
       if (error !== null) {
         console.log('exec error: ' + error);
       }
       else
       {
         await db.run(`INSERT INTO kirtanlist(name,artist,album,cover_art_url,duration,url) VALUES(?,?,?,?,?,?)`, [exactFileName,'','','','',line], function(err) {
           if (err) {
             return console.log(err.message);
           }
         });
         console.log('downloaded file is'+line);
       }

   });


}

async function getmp3Duration(line) {
  var fileName;
  try {

    (async () => {
    fileName = line.replace(/^http?:\/\//,'');
    var exactFileName = fileName.substring(fileName.lastIndexOf('/')+1);
    var localpath = 'audio/'+exactFileName;


     let duration = await mp3Duration(localpath, async function (err, duration) {
       if (err) return console.log('duration error' + err.message);
         var d = Number(duration);
         var h = Math.floor(d / 3600);
         var m = Math.floor(d % 3600 / 60);
         var s = Math.floor(d % 3600 % 60);
         if(h==0) {
            if(m<10) m='0'+m;
            if(s<10) s='0'+s;
            duration=m+':'+s;
         } else {
            if(h<10) h='0'+h;
            if(m<10) m='0'+m;
            if(s<10) s='0'+s;
            duration=h+':'+m+':'+s;
         }

         var exactFileName = fileName.substring(fileName.lastIndexOf('/')+1);

         console.log('Your file is '+exactFileName+ ' has duration '+ duration + ' seconds long');

         await db.run(`UPDATE kirtanlist SET duration = ? WHERE url = ?`, [duration,line], function(err) {
           if (err) {
             return console.log(err.message);
           }
         });
         return duration;
     });

   })();
     //return duration;
   } catch (error) {
      console.log(error);
   }
}

function readLine() {
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./download_list/aindrap.txt')
  });
  return lineReader;
}

(async() => {

  let promise = new Promise((res, rej) => {
    db.run('CREATE TABLE IF NOT EXISTS kirtanlist(id INTEGER PRIMARY KEY AUTOINCREMENT, name char(50), artist char(50), album char(50), cover_art_url char(50), duration char(50), url char(200))');
      setTimeout(() => {
        res("Now it's done!");
      }, 3000);
  });

  let result = await promise;
  console.log('Table created or replaced');

  let lines = await require('fs').readFileSync('./download_list/aindrap.txt', 'utf-8')
    .split('\n')
    .filter(Boolean);
  console.log(lines.length);
  let count = 0;
   for(const line of lines) {
       count++;
      console.log(count);
      await new Promise( resolve => setTimeout(resolve, 100));
      await db.all(`SELECT COUNT(id) as c, duration FROM kirtanlist WHERE url = ? and (duration != ? and duration IS NOT NULL and duration != '00:00' )`, [line,''], async (err, res) => {
        if (err) {
            throw err;
          }
          console.log(res[0].duration);
          await new Promise( resolve => setTimeout(resolve, 100));
        if(res[0].c == 0) {
          console.log(line + count);
          await downloadFile(line).then( ()=> {
            getmp3Duration(line);
          });
          //getmp3Duration(line);
        }
      });
   }

})();

/*
const b2 = new B2({
  applicationKeyId: 'ac1520ab0f3e', // or accountId: 'accountId'
  applicationKey: '001b8a73c121f3ec8929fe82253ff43c31b22b2028' // or masterApplicationKey
});
var fileNames;
async function listFileNames() {
  try {
    await b2.authorize(); // must authorize first
    fileNames = await b2.listFileNames({ bucketId: 'ba2c1135d2701a1b600f031e', maxFileCount: 100 });
    //console.log(fileNames.data);
    console.log('Data sync completed');
  } catch (err) {
    console.log('Data sync failed', err);
  }
}

listFileNames();
*/
