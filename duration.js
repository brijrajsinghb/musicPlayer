
const wget = require('node-wget');
const getMP3Duration = require('get-mp3-duration');
const fs = require('fs');
var url = require("url");
var path = require("path");
var exec = require('child_process').exec;

var child;
var mp3Duration = require('mp3-duration');

var line = "http://audio.iskcondesiretree.com/06_-_More/10_-_Audio_Books/Chaitanya_Bhagavat_recitation_by_His_Grace_Damodar_Prabhu/55_-_Caitanya_Bhagavata_Antya_10_-_Sri_Pundarika-Vidyanidhi-lila_-_Sri_Pundarika-Vidyanidhi%27s_pastimes.mp3";

async function getFromGitHub() {

  try {
console.log(line);
  myexec = await exec('wget -x -nc -P ./CB/ ' + line,
     function (error, stdout, stderr) {
       //console.log('stdout: ' + stdout);
       console.log('stderr: ' + stderr);
       if (error !== null) {
         console.log('exec error: ' + error);
       }
   });

  var parsed = url.parse(line);
  console.log(path.basename(parsed.pathname));
  var localpath = line.replace(/^http?:\/\//,'');

  // fileName = './CB/53_-_Caitanya_Bhagavata_Antya_08_-_Jala-kridadi_-_Water-pastimes_and_other_pastimes.mp3';
  // parsed = url.parse(line);
  // console.log('sdf sdf sdf sd fsd fs df sdf sdf sd f ' + path.basename(parsed.pathname));
  //
  // fileName = './CB/'+path.basename(parsed.pathname);
  // console.log(fileName);


  } catch (error) {
     console.log(error);
  }

}
getFromGitHub();
