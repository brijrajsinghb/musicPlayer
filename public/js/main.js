function myFunction(fileName) {
  console.log(fileName);
  const audio = document.querySelector('#audio');
  const audiosource = document.querySelector('#audiosource'); //
  audiosource.src="http://"+fileName;
  console.log('loading');
  audio.load();
  audio.play();
}

function myOnCanPlayFunction() {
  console.log('play');
}
//https://f001.backblazeb2.com/file/IsckonDesireTreeAudio/
