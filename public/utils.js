// imports


// CLASSES //

class UGSong {
  constructor(title){
    this.title = title
    this.lyrics = []
    this.chords = []
    this.originalKey = ''
    this.contributor = ''
    this.link = ''
    this.currentKey = ''
    this.table = 'ugsongs'
  }
}




class Song {
  constructor(title){
    this.lyrics = []
    this.chords = []
    this.originalKey = ''
    this.currentKey = ''
    this.title = title
    this.contributor = ""
    this.videoId = ''
  }

  async upload() {
  const data = [this.lyrics, this.chords, this.originalKey, this.title, this.contributor, this.artist, this.videoId];
  const table = 'songs';
  const columns = ['lyrics', 'chords', 'originalKey', 'title', 'contributor', 'artist', 'videoId'];

  let x = await dbfunc('/enterData', [data, table, columns]);

  sessionStorage.setItem('currentLink', '')
}

  async showRecord(){
    let x = await dbfunc('/validate', [this.title, 'songs', 'title'])
    console.log(x)
    
  }

}


class User {
    constructor(username){
        this.username = username
        this.password = ""
        this.name = ""
        this.permissions = ""
    }

}



class Element {
  constructor(kind){
    this.kind = kind
    this.holder = this.init(kind)
  }


  init (type){
    return document.createElement(type)
  }


  deploy (parent){
    parent.appendChild(this.holder)
    
  }


}



// Define a reusable class for creating a nav bar
class NavBar {
  constructor() {
    this.navWrapper = document.createElement('div');
    this.navWrapper.className = 'nav-wrapper';

    this.hamburger = document.createElement('div');
    this.hamburger.className = 'hamburger';
    this.hamburger.innerHTML = '&#9776;';
    this.hamburger.addEventListener('click', () => {
      this.nav.classList.toggle('show');
    });

    this.nav = document.createElement('nav');
    this.nav.className = 'root-nav';

    this.navWrapper.appendChild(this.hamburger);
    this.navWrapper.appendChild(this.nav);
  }

  addLink(text, href, onClick = null) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  link.className = 'navbar-link';

  link.addEventListener('click', (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }

    // Auto-close on small screens
    if (window.innerWidth <= 768) {
      this.nav.classList.remove('show');
    }
  });

  this.nav.appendChild(link);
}

  deploy(parent = document.body) {
    parent.prepend(this.navWrapper);
  }
}



// FUNCTIONS //

function clean(input) {
  return input.trim().replace(/\s+/g, ' ');
}

function countWords(input) {
  return input.split(/\s+/)
}

function clearFields (){
  document.querySelector('.title-textarea').value = ""
  document.querySelector('.lyrics-textarea').value = ""
  document.querySelector('.artist-input').value = ''

}


function createCard(song, mode = 'full', parent = document.body){

  let el_list = []

  // creating current chordlist
  let chordList = []


  // creating the card-div
  let songCard = document.createElement('div')
  songCard.className = 'finished-song-div'
  songCard.style.fontFamily = 'monospace'
  songCard.style.fontSize = '15px'
  songCard.style.whiteSpace = 'pre'

  // edit button

  // attaching the command
  


  // creating song details div
  let sd = document.createElement('div')
  sd.className = 'song-details-div'

  
  // attaching song title and details
  let title = document.createElement('h2')
  title.textContent = song.title || 'Untitled'
  
  if (song.contributor === sessionStorage.getItem('currentUser')){
    title.contentEditable = true
    title.onblur = async function (){
      let oldTitle = song.title
      song.title = title.textContent
      let s = await dbfunc('/updateData', [song.title, 'songs', 'title', 'title', oldTitle])
    }
  }

  el_list.push(title)

  let artist = document.createElement('h4')
  artist.textContent = song.artist || 'No Artist Specified'
  
  if (song.contributor === sessionStorage.getItem('currentUser')){
    artist.contentEditable = true
    artist.onblur = async function (){
      song.artist = artist.textContent
      let s = await dbfunc('/updateData', [song.artist, 'songs', 'artist', 'title', song.title])
    }
  }


  let link = document.createElement('h5')
  link.textContent = song.videoId || 'No YouTube link Specified'
  
  if (song.contributor === sessionStorage.getItem('currentUser')){
    link.contentEditable = true
    link.onblur = async function (){
      song.videoId = link.textContent.trim()
      let s = await dbfunc('/updateData', [song.videoId, 'songs', 'videoid', 'title', song.title])
    }
  }

  el_list.push(artist)

  let contributor = document.createElement('h5')
  contributor.textContent = `Posted by : ${song.contributor}`
  el_list.push(contributor)
  

  sd.append(title, artist, link, contributor)


  songCard.appendChild(sd)


  
  // creating the element containing key note
  let key = document.createElement('p')
  key.className = 'key-container'
  key.contentEditable = song.contributor === sessionStorage.getItem('currentUser')
  
  key.innerHTML = `key of <b>${song.originalKey}</b>`
  key.style.marginBottom = '10px'
  key.style.display = 'inline-block'
  el_list.push(key)
  songCard.appendChild(key)


  // creating transpose button
  let transpose = document.createElement('button')
  transpose.textContent = ' + '
  transpose.style.display = 'inline-block'
  transpose.style.marginLeft = '30px'
  transpose.onclick = () => {
    // transposing the key
    const keyValue = document.querySelector('.key-container b')
    keyValue.textContent = transposer(keyValue.textContent, 1)

    // transposing the chords
    for (var i=0; i < chordList.length; i++){
      let e = transposer(chordList[i].textContent, 1)
      chordList[i].textContent = e
    }
    
    
  }
   


  let down = document.createElement('button')
  down.textContent = ' - '
  down.style.display = 'inline-block'
  down.style.marginLeft = '30px'
  down.onclick = () => {
    // transposing the key
    const keyValue = document.querySelector('.key-container b')
    keyValue.textContent = transposer(keyValue.textContent, -1)

    // transposing the chords
    for (var i=0; i < chordList.length; i++){
      let e = transposer(chordList[i].textContent, -1)
      chordList[i].textContent = e
    }
    
    
  }
  songCard.appendChild(down)
  songCard.appendChild(transpose) 

  let tempHolder = ""


  // looping through chords and lyrics
  for (let i=0; i < song.lyrics.length; i++){
    let l1 = document.createElement('p')
    l1.style.fontWeight = 'bold'
    if (mode === 'full'){
      l1.textContent = song.chords[i]
      if (song.contributor === sessionStorage.getItem('currentUser')){
        l1.contentEditable = true
        l1.onblur = async function (){
          song.chords[i] = l1.textContent
          let s = await dbfunc('/updateData', [song.chords, 'songs', 'chords', 'title', song.title])
        }
      } 
      chordList.push(l1)
      songCard.appendChild(l1) 

    }  else {
        let x = clean(song.chords[i]);
        
        if (countWords(x).length < 2) {
          if (tempHolder === '') {
            tempHolder = x;
          } else {
            l1.textContent = `${tempHolder} ${x}`;
            chordList.push(l1);
            songCard.appendChild(l1);
            tempHolder = '';
          }
        } else {
          if (tempHolder !== ''){
            let l5 = document.createElement('p')
            l5.style.fontWeight = 'bold'
            l5.textContent = tempHolder
            songCard.appendChild(l5)
            chordList.push(l5)
            tempHolder = ''
          }
          l1.textContent = x;
          chordList.push(l1);
          songCard.appendChild(l1);
        }
    }


    // show lyrics in full mode, just show songParts if not //

    if (mode === 'full'){
      let l2 = document.createElement('p')
      l2.textContent = song.lyrics[i]
      if (song.contributor === sessionStorage.getItem('currentUser')){
        l2.contentEditable = true
        l2.onblur = async function (){
          song.lyrics[i] = l2.textContent
          let s = await dbfunc('/updateData', [song.lyrics, 'songs', 'lyrics', 'title', song.title])
        }
      }

      songCard.appendChild(l2)

    } else {
      let songParts = ['verse', 'pre-chorus', 'chorus', 'instrumental', 'bridge', 'coda', 'refrain', 'ending', 'interlude', 'intro']
      let s = song.lyrics[i].toLowerCase()

      for (let c = 0; c < songParts.length; c++){
        if (s.includes(songParts[c])){
          let l2 = document.createElement('p')
          l2.textContent = `${songParts[c].toUpperCase()} : `
          songCard.appendChild(l2)
          break
        }
      }
    }
    



     
    
  }
  

  // deployment and clearing of fields and irrelevant divs
  parent.appendChild(songCard)
  let q = document.querySelector('.song-edit-div')
  if (q){
     q.remove()
  }
 
}




function edit(){
  let lyrics = document.querySelector('.lyrics-textarea')
  let c1 = document.createElement('div')
  c1.className = 'song-edit-div'
  c1.style.fontFamily = 'monospace'

  let w1 = document.createElement('h2')
  let link = document.querySelector('.link-input').value || 'No link placed'
  sessionStorage.setItem('currentLink', link)
  w1.textContent = document.querySelector('.title-textarea').value
  currentTitle = document.querySelector('.title-textarea').value
  currentArtist = document.querySelector('.artist-input').value

  c1.appendChild(w1)

  let w2 = document.createElement('div')

  // let w3 = document.createElement('p')
  // w3.textContent = "key of : " 
  // w3.style.display = 'inline-block'
  // w3.style.marginRight = '10px'

  let w4 = document.createElement('textarea')
  w4.rows = '1'
  w4.cols = '7'
  w4.placeholder = "key of"
  w4.style.marginBottom = "20px"
  w4.className = 'key-textarea'
  

  // w2.appendChild(w3)
  w2.appendChild(w4)
  c1.appendChild(w2)


  let lines = lyrics.value.split('\n')

  //loop for processing lines and inserting chord lines

  for (var i=0; i<lines.length; i++){
    // creating the lyric lines

    if (lines[i] !== ""){
      let z = document.createElement('p')
    z.className = `line${i}`
    z.innerHTML = `${lines[i]} <br>`
    currentLyrics.push(lines[i])

    //creating the chord textbox
    let y = document.createElement('textarea')
    y.rows = '1'
    y.cols = '75'
    y.className = `chord${i}`
    currentChordContainers.push(y)

     // deploying
    c1.appendChild(y)
    c1.appendChild(z)
      
    }

  }
    
  let ra = ['.title-textarea', '.btn-1', '.lyrics-textarea', '.btn-3', '.artist-input']
  for (var i=0; i<ra.length; i++){
    let n = document.querySelector(ra[i])
    n.remove()
  }


  document.body.appendChild(c1)
  let f = document.querySelector('.finished-song-div') || ""
  if (f !== ""){
    f.remove()
  }

  
}




function save(){
  let cu = sessionStorage.getItem('currentUser')
  let song = new Song(currentTitle || 'Untitled')
  song.lyrics = currentLyrics
  song.contributor = cu
  song.artist = currentArtist
  currentArtist = ""
  song.videoId = sessionStorage.getItem('currentLink')

  let k = document.querySelector('.key-textarea')
  song.originalKey = k.value
  
  // retrieving values of chord text areas
  for (var i=0; i<currentChordContainers.length; i++){
    song.chords.push(currentChordContainers[i].value)
  }



  song.upload()
  // console.log(song)

  song.showRecord()

  createCard(song)

}


function redirect(path, permission = 'private'){
  if (permission === 'public' || (sessionStorage.getItem('currentUser') && sessionStorage.getItem('currentUser') !== '')){
    window.location.href = path;
  }
}


function transposer(chordLine, steps) {
  let descNotes = ['C#', 'C', 'B', 'A#','A','G#','G','F#','F','E','D#','D'];
  let tempLine = chordLine;

  // pass 0: replace all Bb
  let reg = new RegExp('Bb', 'g')
  tempLine = tempLine.replace(reg, 'RR')

  // First pass: replace each note with a placeholder
  for (let i = 0; i < descNotes.length; i++) {

    // account for cases which results in Bb
    if ((i - steps) === 3){
      let regex = new RegExp(descNotes[i], 'g');
      tempLine = tempLine.replace(regex, 'SS');
    
    }else{
      // all other cases 
      let regex = new RegExp(descNotes[i], 'g');
      tempLine = tempLine.replace(regex, `__${i}__`);
    }
    
    
  }

  // Second pass: replace placeholders with the transposed notes
  for (let i = 0; i < descNotes.length; i++) {
    let placeholder = new RegExp(`__${i}__`, 'g');
    let replacement = descNotes[(i - steps + descNotes.length) % descNotes.length]; // wrap index
    tempLine = tempLine.replace(placeholder, replacement);
    
  }
  
  // Third pass: for Bb (special case)
  
  // changing results to Bb
  let regex = new RegExp('SS', 'g')
  tempLine = tempLine.replace(regex, 'Bb')


  // handling results from Bb
  let rx = new RegExp('RR', 'g')
  tempLine = tempLine.replace(rx, descNotes[3-steps])


  return tempLine;
}



async function dbfunc(func, args){
    const res = await fetch(func,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data : args[0] || "",
            table : args[1] || "",
            column : args[2] || "",
            key : args[3] || "",
            value : args[4] || ""
        })
    })

    const response = await res.json()
    return response.success
}



async function tester(){
    let j = await dbfunc('/updateData', ['Reuben John', 'users', 'name', 'username', 'marrbenn1'])
}



async function tester2(){
  let k = await dbfunc('/viewSelectedColumns', ['success', 'songs', ['* ']])
  console.log(k)
}




async function login(username, password2){
    const results = await dbfunc('/validate',[username, 'users', 'username'])
    if (results.length > 0){
        if (results[0].password === password2){
            console.log('Log in Success')
            console.log(results)
            return results[0]
        }
        else {
            console.log('Wrong Username or Password')
            return '❌ Wrong password.'
        }
    }
    else {
        console.log('Invalid credentials')
        return '❌ Invalid username.'
    }

    
}



function attachNav() {
  const navbar = new NavBar();
  navbar.addLink('Home', '/menu');
  navbar.addLink('Find A Song', '/song_catalog');
  navbar.addLink('Upload A Song', '/app');
  navbar.addLink('Sign Out', '#', () => {
    console.log('Signing out...');
    sessionStorage.clear();
    window.location.href = '/';
  });
  navbar.deploy();
}


function errorMessage(message){
  let z = document.querySelector('.error-div')
  console.log(z)
  if (z){
    z.remove()
  }

  let a = document.createElement('div')
  let b = document.createElement('h4')
  b.innerHTML = `<b> ${message} <b>`
  a.className = 'error-div'

  a.appendChild(b)
  document.body.appendChild(a)
} 


async function addUser(name, username, password){
  if (name !== '' && username !== '' && password !== ''){
    let a = await dbfunc('/enterData', [[name, username, password], 'users', ['name', 'username', 'password']] )
  return a
  }
  else{
    errorMessage('Please fill out all fields.')
  }
}



function makeEditable(list) {
  list.forEach((el, index) => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = el.textContent;

    input.onblur = function () {
      const newEl = document.createElement(el.tagName.toLowerCase());
      newEl.textContent = input.value;
      input.replaceWith(newEl);
      list[index] = newEl; // update reference
    };

    el.replaceWith(input);
    list[index] = input;
    input.focus();
  });
}


function displayChords(song){
  let mainDiv = document.createElement('div')


  let detDiv = document.createElement('div')
  let title = document.createElement('h3')
  title.textContent = song.title


}



function initYTplayer(div_id, video_id, onPlayerReady, onPlayerStateChange){
  const player = new YT.Player(div_id, {
    height: '360',
    width: '640',
    videoId: video_id,
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      start: 0,
    },
    events: {
      onReady: onPlayerReady || function() {},
      onStateChange: onPlayerStateChange || function() {}
    }
  });

}


function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;

  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}


