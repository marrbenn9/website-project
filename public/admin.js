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
a1.placeholder = 'Custom secret key'

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


let b = document.createElement('div')
b.className = 'admin-delete'
b.style.marginTop = '20px'


let b1 = document.createElement('input')
b1.placeholder = 'TABLE TO DELETE FROM'
b1.style.marginRight = '5px'

let b3 = document.createElement('input')
b3.placeholder = 'WHERE COLUMN'
b3.style.marginRight = '5px'

let b2 = document.createElement('input')
b2.placeholder = 'ROW TO BE DELETED'
b2.style.marginRight = '5px'


let b4 = document.createElement('button')
b4.textContent = 'DELETE DATA'
b4.onclick = async function () {
    if (b1.value !== '' && b2.value !== '' && b3.value !== ''){
        let n = await dbfunc('/deleteRow', [ b2.value, b1.value, b3.value ])
        if (n === true){
            errorMessage('Data successfully deleted!')
        }
    }

    b1.value = ''
    b2.value = ''
    b3.value = ''
    
}


a.append(a1, a2)
b.append(b1, b3, b2, b4)

document.body.appendChild(a)
document.body.appendChild(b)


