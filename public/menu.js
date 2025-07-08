attachNav()


// CREATING MAIN DIV //

let a = document.createElement('div');
a.className = 'menu-div';

let b1 = sessionStorage.getItem('currentUser');
let b = document.createElement('h2');
b.textContent = `Welcome back, ${b1}! `;

let b2 = document.createElement('ul');

// Create first list item with anchor
let li1 = document.createElement('li');
let c1 = document.createElement('a');
c1.textContent = "Upload Chords of a Song";
c1.href = '/app';
li1.appendChild(c1);

// Create second list item with anchor
let li2 = document.createElement('li');
let c2 = document.createElement('a');
c2.textContent = "Find a Song";
c2.href = '/song_catalog';
li2.appendChild(c2);

// Append list items to the <ul>
b2.appendChild(li1);
b2.appendChild(li2);

// Add all elements to the main div and then to the body
a.appendChild(b);
a.appendChild(b2);
document.body.appendChild(a);
