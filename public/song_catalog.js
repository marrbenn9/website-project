attachNav()
// CREATING THE LIST OF SONGS //

let h1 = document.createElement('h1')
h1.textContent = 'CCBCMI Song Catalog'


let a = document.createElement('div')
a.className = 'song-catalog-div'

let ul = document.createElement('ul')

async function generateOptions (){
    let b1 = await dbfunc('/viewSelectedColumns', ['success', 'songs', ['*']])

    // loop through the results //

    for (var i=0 ; i < b1.length; i++){
        let li = document.createElement('li')
        let anc = document.createElement('a')
        anc.className = `a${i}`
        anc.textContent = b1[i].title || 'Untitled'
        anc.href = `/songs/${encodeURIComponent(b1[i].title)}`;

        li.appendChild(anc)
        ul.appendChild(li)

    }
}


generateOptions()

a.append(h1, ul)
document.body.appendChild(a)
