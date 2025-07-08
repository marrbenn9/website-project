let x = sessionStorage.getItem('testKey') || "session object not found"

let y = document.createElement('h1')
y.textContent = x

document.body.appendChild(y)

