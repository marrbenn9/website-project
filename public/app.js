attachNav()


// creating user greeting //

let ux = sessionStorage.getItem('currentUser')
let greeting = document.createElement('h3')
greeting.innerHTML = `Welcome back, ${ux}! <br> <h4> Put song details then press "Put Some Chords " 
</h4>`

document.body.appendChild(greeting)



// creating containers for current lyrics and chords

let currentChordContainers = []
let currentLyrics = []
let currentTitle = ""
let currentArtist = ""

// create a textarea for the title

let t3 = document.createElement('textarea')
t3.className = 'title-textarea'
t3.rows = '1'
t3.cols = '70'
t3.placeholder = 'Put Song Title Here'


let j3 = document.createElement('div')
j3.style.marginTop = '15px'
j3.style.marginBottom = '15px'
let j4 = document.createElement('input')
j4.placeholder = 'Performed by '
j4.size = '40'
j4.className = 'artist-input'

j3.appendChild(j4)

document.body.appendChild(t3)
document.body.appendChild(j3)



// create a button to click to add chords

let d1 = document.createElement('div')
let b1 = document.createElement('button')
b1.className = 'btn-1'
b1.textContent = "Put Some Chords"
b1.onclick = () => edit()
d1.appendChild(b1)
document.body.appendChild(d1)

// creating the textbox

let t1 = document.createElement('textarea')
t1.className = 'lyrics-textarea'
t1.placeholder = 'Paste lyrics here'
t1.style.marginTop = '15px'
t1.rows = '7'
t1.cols = '75'
document.body.appendChild(t1)


// creating the button to display the edited results and save the card??
let d2 = document.createElement('div')
let b2 = document.createElement('button')
b2.className = 'btn-2'
let b3 = document.createElement('button')
b3.className = 'btn-3'

b2.textContent = 'Save Changes'
b2.onclick = () => save()

b3.textContent = 'Clear all fields'
b3.onclick = () => clearFields()


d2.appendChild(b2)
d2.appendChild(b3)
document.body.appendChild(d2)





