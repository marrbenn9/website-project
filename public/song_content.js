attachNav();

let currentSong = null;

// Create layout and add to body
const mainDiv = createMainLayout();
document.body.appendChild(mainDiv);

// === Layout creation === //
function createMainLayout() {
  const container = document.createElement('div');
  container.className = 'main-div'; // Styling in CSS

  // Content column
  const contentSection = document.createElement('div');
  contentSection.id = 'content-section';

  // Button
  const chordsOnlyButton = document.createElement('button');
  chordsOnlyButton.id = 'chords-only-btn';
  chordsOnlyButton.textContent = 'SHOW CHORDS ONLY';
  chordsOnlyButton.onclick = () => {
    const existingCard = document.querySelector('.finished-song-div');
    if (existingCard) existingCard.remove();

    if (chordsOnlyButton.textContent === 'SHOW CHORDS ONLY') {
      chordsOnlyButton.textContent = 'VIEW FULL CONTENT';
      createCard(currentSong, 'short', contentSection);
    } else {
      chordsOnlyButton.textContent = 'SHOW CHORDS ONLY';
      createCard(currentSong, 'full', contentSection);
    }
  };
  contentSection.appendChild(chordsOnlyButton);

  // Video section (appended below content)
  const videoSection = createVideoSection();

  // Append both sections
  contentSection.appendChild(videoSection); // place video inside scrollable column
  container.appendChild(contentSection);


  return container;
}

// === Video Player Container === //
function createVideoSection() {
  const vidDiv = document.createElement('div');
  vidDiv.id = 'vid-div';

  const placeholder = document.createElement('p');
  placeholder.textContent = 'Loading video...';
  vidDiv.appendChild(placeholder);

  return vidDiv;
}

// === Load song and build page === //
async function loadSong() {
  const pathParts = window.location.pathname.split('/');
  const title = decodeURIComponent(pathParts[pathParts.length - 1]);

  const result = await dbfunc('/validate', [title, 'songs', 'title']);
  const data = result[0];

  if (!data) {
    document.body.innerHTML = '<h2>Song not found</h2>';
    return;
  }

  const song = new Song(data.title);
  song.lyrics = data.lyrics;
  song.chords = data.chords;
  song.originalKey = data.originalKey || data.originalkey;
  song.contributor = data.contributor;
  song.artist = data.artist;
  song.videoId = data.videoid;

  currentSong = song;

  const contentSection = document.getElementById('content-section');
  createCard(song, 'full', contentSection);

  if (song.videoId) {
    const id = extractYouTubeId(song.videoId);
    if (id) {
      if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        window.onYouTubeIframeAPIReady = () => initYTplayer('vid-div', id);
      } else {
        initYTplayer('vid-div', id);
      }
    }
  }
}

// === Start === //
loadSong();
