attachNav()

let m = document.createElement('h1')
m.textContent = 'Welcome, Administrator!'
m.style.marginLeft = '20px'
m.style.marginBottom = '40px'

document.body.appendChild(m)
// create admin div-1

let a = document.createElement('div')
a.className = 'admin-div1'

let a1 = document.createElement('input')
a1.type = 'text'
a1.size = '30'
a1.style.marginLeft = '20px'

let a2 = document.createElement('button')
a2.textContent = 'CREATE SECRET KEY'
a2.style.marginLeft = '20px'
a2.onclick =  async function () {
    if (a1.value !== ''){
        let s = await dbfunc('/enterData', [[a1.value], 'secrets', ['secret']])
        errorMessage(`Secret key "${a1.value}" successfully created and added to database!`)
    }
    else {
        errorMessage('Secret key cannot be blank!')
    }
    a1.value = ''
}


a.append(a1, a2)

document.body.appendChild(a)