

// CREATING MAIN DIV

let a = document.createElement('div')
a.className = 'secret-div'

let b1 = document.createElement('p')
b1.textContent = 'Please enter secret key : '

let b2 = document.createElement('input')
b2.type = 'text'
b2.size = '30'
b2.style.marginRight = '20px'

let c1 = document.createElement('button')
c1.textContent = '  GO  '
c1.onclick = async function () {
    let n = b2.value
    
    let rows = await dbfunc('/validate', [n, 'secrets', 'secret'])

    if (rows.length > 0){
        let x = await dbfunc('/deleteRow', [b2.value, 'secrets', 'secret'])
        redirect('/createacct')
    }
    else {
        errorMessage('Invalid secret key!')
    }
    b2.value = ''
}

a.append(b1, b2, c1)
document.body.appendChild(a)

