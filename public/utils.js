// imports


// CLASSES //


class Song {
  constructor(title){
    this.lyrics = []
    this.chords = []
    this.originalKey = ''
    this.currentKey = ''
    this.title = title
    this.contributor = ""
  }

  async upload() {
  const data = [this.lyrics, this.chords, this.originalKey, this.title, this.contributor];
  const table = 'songs';
  const columns = ['lyrics', 'chords', 'originalKey', 'title', 'contributor'];

  let x = await dbfunc('/enterData', [data, table, columns]);
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
    this.nav = document.createElement('nav');
    this.nav.style.display = 'flex';
    this.nav.style.justifyContent = 'space-between';
    this.nav.style.padding = '1rem 2rem';
    this.nav.style.backgroundColor = '#333';
    this.nav.style.color = 'white';
  }

  addLink(text, href, onClick = null) {
    const link = document.createElement('a');
    link.textContent = text;
    link.href = href;
    link.style.color = 'white';
    link.style.textDecoration = 'none';
    link.style.margin = '0 1rem';
    link.style.cursor = 'pointer';

    if (onClick) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        onClick();
      });
    }

    this.nav.appendChild(link);
  }

  deploy(parent = document.body) {
    parent.prepend(this.nav); // Add at top of page
  }
}




// FUNCTIONS //

function clearFields (){
  document.querySelector('.title-textarea').value = ""
  document.querySelector('.lyrics-textarea').value = ""

}


function createCard(song){

  // creating current chordlist
  let chordList = []


  // creating the card-div
  let songCard = document.createElement('div')
  songCard.className = 'finished-song-div'
  songCard.style.marginLeft = '30px'
  songCard.style.whiteSpace = 'pre'
  songCard.style.fontFamily = 'monospace'
  songCard.style.fontSize = '15px'


  // creating song details div
  let sd = document.createElement('div')
  sd.className = 'song-details-div'

  
  // attaching song title and details
  let title = document.createElement('h2')
  title.textContent = song.title

  let artist = document.createElement('h4')
  if (song.artist){
    artist.textContent = `by ${song.artist}`
  }
  

  let contributor = document.createElement('h5')
  contributor.textContent = `Contributed by : ${song.contributor}`

  sd.append(title, artist, contributor)
  
  songCard.appendChild(sd)


  
  // creating the element containing key note
  let key = document.createElement('p')
  key.className = 'key-container'
  
  key.innerHTML = `key of <b>${song.originalKey}</b>`
  key.style.marginBottom = '30px'
  key.style.display = 'inline-block'
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

  // looping through chords and lyrics
  for (var i=0; i < song.lyrics.length; i++){
    let l1 = document.createElement('p')
    l1.style.fontWeight = 'bold'
    l1.textContent = song.chords[i]
    chordList.push(l1)

    let l2 = document.createElement('p')
    l2.textContent = song.lyrics[i]

    songCard.appendChild(l1)
    songCard.appendChild(l2)
  }
  

  // deployment and clearing of fields and irrelevant divs
  document.body.appendChild(songCard)
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
  w1.textContent = document.querySelector('.title-textarea').value
  currentTitle = document.querySelector('.title-textarea').value
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
    
  let ra = ['.title-textarea', '.btn-1', '.lyrics-textarea', '.btn-3']
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
  let song = new Song(currentTitle)
  song.lyrics = currentLyrics
  song.contributor = cu

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


function redirect(path){
  window.location.href = path
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
            return false
        }
    }
    else {
        console.log('Invalid credentials')
        return false
    }

    
}



function attachNav (){

// Usage
const navbar = new NavBar();
navbar.addLink('Home', '/menu');
navbar.addLink('Find A Song', '/song_catalog')
navbar.addLink('Upload A Song', '/app')
navbar.addLink('Sign Out', '#', () => {
  console.log('Signing out...');
  // You could clear sessionStorage or redirect here
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
  a.style.marginTop = '30px'
  a.style.marginLeft = '20px'

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

