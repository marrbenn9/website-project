attachNav()


const mainDiv = document.createElement('div')

const sd1 = document.createElement('div')

const p0 = document.createElement('p')
p0.textContent = "Please insert info about the song :"

const title = document.createElement('input')
title.placeholder = 'Song Title'
title.className = 'link-input'

const artist = document.createElement('input')
artist.placeholder = 'Performed by'
artist.className = 'link-input'

const link = document.createElement('input')
link.placeholder = 'Insert YouTube link'
link.className = 'link-input'

const p1 = document.createElement('p')
p1.textContent = "Paste Ultimate-Guitar Song URL :"

const i1 = document.createElement('input')
i1.className = 'link-input'
i1. placeholder = 'Insert Link'



const b1 = document.createElement('button')
b1.className = 'btn-3'
b1.textContent = "IMPORT"
b1.onclick = async function () {
    const input = i1.value
    const response = await fetch('/scrape', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({url : input })
    })
    
    const data = await response.json()
    const div1 = document.createElement('div')
    div1.innerHTML = data.element;
    document.body.appendChild(div1)

    let [chords, lyrics]  = extract('.xNWlr.hjutX.PBFx0')
    chords.splice(0, 1)

    const s = new Song(title.value || 'Untitled')
    s.chords = chords || "No chords"
    s.lyrics = lyrics || "No lyrics"
    s.contributor = sessionStorage.getItem('currentUser')
    s.originalKey = 'C'
    s.artist = artist.value || "No artist specified"
    s.videoId = link.value || "Please insert YouTube link"
    s.upload()



    alert('Song successfully uploaded to database!')

    }


const b2 = document.createElement('button');
b2.textContent = 'SHOW CHORDS ONLY';
b2.className = 'btn-3';

b2.onclick = () => {

    const parent = document.querySelector('.xNWlr.hjutX.PBFx0');

    let buffer = [];
    for (const child of [...parent.childNodes]) {
        const isChordSpan =
        child.nodeType === Node.ELEMENT_NODE &&
        child.tagName === 'SPAN' &&
        child.classList.contains('iGhjU') &&
        child.classList.contains('xXjiq') &&
        child.classList.contains('VcfKs');

    const isLineBreak =
      child.nodeType === Node.ELEMENT_NODE &&
      child.tagName === 'BR';

    if (isChordSpan || isLineBreak) {
      // Flush lyrics buffer if exists before this span or BR
      if (buffer.length) {
        const br = document.createElement('br');
        parent.insertBefore(br, child);
        buffer.forEach(n => parent.removeChild(n));
        buffer = [];
      }

      continue; // Keep span or br
    }

    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() === '') {
      // whitespace text node — do nothing
      continue;
    }

    // Otherwise, assume it's a lyric text node — buffer it to replace with <br>
    buffer.push(child);
  }

  // Flush any remaining lyric text at the end
  if (buffer.length) {
    const br = document.createElement('br');
    parent.appendChild(br);
    buffer.forEach(n => parent.removeChild(n));
  }
};

document.body.appendChild(b2);



const b3 = document.createElement('button')
b3.className = 'btn-3'
b3.textContent = 'BTN 3'
b3.onclick = () => {
    const [chords, lyrics]  = extract('.xNWlr.hjutX.PBFx0')
    console.log(`chords (${chords.length}): ${chords}\n
        lyrics (${lyrics.length}): ${lyrics}`)


    for (let i = 0; i<lyrics.length; i++){
        console.log(chords[i+1])
        console.log(lyrics[i])
    }
}





sd1.append(p0, title, artist, link, p1, i1, b1, b2, b3)

mainDiv.appendChild(sd1)
document.body.appendChild(mainDiv)


function extractChordsAndLyrics() {
  const container = document.querySelector('.xNWlr.hjutX.PBFx0');
  const chords = [];
  const lyrics = [];

  const lines = [];
  let currentLine = [];

  // Group child nodes into lines by <br>
  for (let node of container.childNodes) {
    if (node.tagName === 'BR') {
      lines.push(currentLine);
      currentLine = [];
    } else {
      currentLine.push(node);
    }
  }
  if (currentLine.length > 0) lines.push(currentLine);

  for (const line of lines) {
    let chordLine = '';
    let lyricLine = '';

    for (const node of line) {
      const isChord =
        node.nodeType === Node.ELEMENT_NODE &&
        node.tagName === 'SPAN' &&
        node.classList.contains('iGhjU') &&
        node.classList.contains('xXjiq') &&
        node.classList.contains('VcfKs');

      if (isChord) {
        chordLine += node.textContent;
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Preserve spacing between chords
        chordLine += node.textContent;
        lyricLine += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        lyricLine += node.textContent;
      }
    }

    // If it's purely lyrics (no chords), ensure alignment by pushing empty chord line
    if (chordLine.trim() && !lyricLine.trim()) {
      chords.push(chordLine);
      lyrics.push('');
    } else if (!chordLine.trim() && lyricLine.trim()) {
      chords.push('');
      lyrics.push(lyricLine);
    } else {
      chords.push(chordLine);
      lyrics.push(lyricLine);
    }
  }

  return { chords, lyrics };
}


function reassembleSong(chords, lyrics) {
  if (chords.length !== lyrics.length) {
    throw new Error("Chords and lyrics arrays must be of the same length.");
  }

  let result = '';

  for (let i = 0; i < chords.length; i++) {
    const chordLine = chords[i];
    const lyricLine = lyrics[i];

    // Add chord line if it has content
    if (chordLine.trim()) result += chordLine + '\n';

    // Add lyric line (always, even if empty, to keep structure)
    result += lyricLine + '\n';
  }

  return result.trim(); // Remove final newline
}



function extract (parentIdentifier){
    const parent = document.querySelector(parentIdentifier)
    const children = parent.childNodes
    let buffer = ""
    let previousType = "lyrics"
    let chorLines = []
    let lyrics = []

    for (let child of children) {

        if (child.nodeType !== 1 && !/^\s*$/.test(child.textContent)) {
            lyrics.push(child.textContent.trim())
            if (previousType === 'lyrics'){
                chorLines.push(' ')
            }

            previousType = 'lyrics'
        }

        else if (child.nodeType === 1){
            if (previousType !== 'lyrics'){
                buffer = buffer + child.textContent
                
            } else {
                chorLines.push(buffer)
                buffer = ''
                buffer = child.textContent
                
            }

            previousType = 'element'
        }

        else if (/^\s*$/.test(child.textContent)) {
            buffer = buffer + child.textContent
            
            previousType = 'whitespace'
        }

        else {
            chorLines.push({
                'others' : child.textContent,
                'node-type' : child.nodeType
            })
        }



    }

    return [chorLines, lyrics]
}






