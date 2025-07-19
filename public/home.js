
// CREATING THE LOG IN DIV AND ITS COMPONENTS //

let a = document.createElement('div')
a.className = 'login-div'
a.style.border = '1px solid gray'

let b1 = document.createElement('p')
b1.textContent = 'USERNAME : '

let b2 = document.createElement('p')
b2.textContent = 'PASSWORD : '

let c1 = document.createElement('input')
c1.className = 'username-input'
c1.type = 'text'
// c1.style.marginLeft = '19px'

let c2 = document.createElement('input')
c2.className = 'password-input'
c2.type = 'password'
// c2.style.marginLeft = '20px'
// c2.style.marginBottom = '20px'

let d1 = document.createElement('button')
d1.className = 'login-btn'
// d1.style.marginBottom = '20px'
// d1.style.marginLeft = '20px'
d1.textContent = 'LOG IN'
// d1.style.marginRight = '20px'
d1.onclick = async function() {
    let u = c1.value
    let p = c2.value
    let q = await login(u,p)
    if (q.name){
        sessionStorage.setItem('currentUser', q.name)
        c1.value = ""
        c2.value = ""
        redirect('/menu')
    }
    else {
        errorMessage(q)
    }
    
    
}


let d2 = document.createElement('button')
d2.className = 'create-acct-btn'
d2.textContent = 'No account? Register Instead'
d2.onclick = () => redirect('/register', 'public')



// create sub-div for btns d1 and d2 //


let e1 = document.createElement('div')
e1.className = 'sub-div'
e1.append(d1, d2)



a.append(b1, c1, b2, c2, e1)
document.body.appendChild(a)


