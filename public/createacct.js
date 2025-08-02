
// creating main-div

let a = document.createElement('div')
a.className = 'registration-div'

let n = document.createElement('h2')
n.textContent = 'Account Creation'
a.appendChild(n)

let b = document.createElement('p')
b.textContent = 'Name :'


let c = document.createElement('p')
c.textContent = 'New Username :'


let d = document.createElement('p')
d.textContent = 'New Password :'


let e = document.createElement('input')
e.type = 'text'
e.size = '50'


let f = document.createElement('input')
f.type = 'text'
f.size = '50'
    

let g = document.createElement('input')
g.type = 'text'
g.size = '50'

let h = document.createElement('div')

let h1= document.createElement('button')
h1.textContent = 'CREATE NEW ACCOUNT'
h1.onclick = async function () {
    let k = await addUser(e.value, f.value, g.value)
    if (k === true){
        errorMessage(`Account Created! Name: ${e.value}, Username: ${f.value} <br>
            You will be redirected to login page shortly.`)
        setTimeout(() => {
            redirect('/', 'public')
        }, 7000)
    }
    else {
        errorMessage('There was an error. Please contact administrator.')
    }

    e.value = ""
    f.value = ''
    g.value = ''
}


let h2 = document.createElement('button')
h2.textContent = 'GO BACK TO LOGIN PAGE'
h2.onclick = function() {
    redirect('/', 'public')
}

h.append(h1, h2)


a.append(b, e, c, f, d, g, h)
document.body.appendChild(a)


