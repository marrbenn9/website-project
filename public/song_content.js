attachNav()

let currentSong


let b1 = document.createElement('button')
b1.textContent = 'SHOW CHORDS ONLY'
b1.onclick = function (){
  let a = document.querySelector('.finished-song-div') || ""
  if (a){
    a.remove()
  }
  createCard(currentSong, 'short')
}

document.body.appendChild(b1)



document.addEventListener('DOMContentLoaded', async () => {
  const pathParts = window.location.pathname.split('/');
  const title = decodeURIComponent(pathParts[pathParts.length - 1]);

  // Fetch the song
  const result = await dbfunc('/validate', [title, 'songs', 'title']);
  const songData = result[0];

  if (songData) {
    const song = new Song(songData.title);
    song.lyrics = songData.lyrics;
    song.chords = songData.chords;
    song.originalKey = songData.originalKey || songData.originalkey;
    song.contributor = songData.contributor;
    song.artist = songData.artist

    currentSong = song

    createCard(song);  // now works safely
  } else {
    document.body.innerHTML = '<h2>Song not found</h2>';
  }
});
