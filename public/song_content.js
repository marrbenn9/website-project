attachNav()




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

    createCard(song);  // now works safely
  } else {
    document.body.innerHTML = '<h2>Song not found</h2>';
  }
});
