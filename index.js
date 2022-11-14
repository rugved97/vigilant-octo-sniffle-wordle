'use strict'

let grid = document.getElementById('grid')
let keyboard = document.getElementById('keyboard')

let GREY = '#212121'
let LIGHTGREY = '#888'
let MIDDLEGREY = '#666'
let GREEN = '#538d4e'
let YELLOW = '#b59f3b'
let BLACK = '#111'

let wordList = [
    'patio',
    'darts',
    'piano',
    'horse',
    'hello', 
    'water',
    'pizza',
    'sushi',
    'crabs'
]

let randomIndex = Math.floor(Math.random() * wordList.length)
let secret = wordList[2]
let keyboardButtons = new Map()
let attempts = []
let currentAttempt = ''

function buildGrid() {
    for( let i = 0; i < 6 ; i++) {
        let row = document.createElement('div')
        for(let j = 0 ;j < 5; j++ ) {
            let cell = document.createElement('div')
            cell.className = 'cell'
            let front = document.createElement('div')
            front.className = 'front'
            let back = document.createElement('div')
            back.className = 'back'
            let surface = document.createElement('div')
            surface.className = 'surface'
            surface.style.transitionDelay = (j*300) + 'ms'
            surface.appendChild(front)
            surface.appendChild(back)
            cell.appendChild(surface)

            row.appendChild(cell)
        }
    grid.appendChild(row)
    }
}

function loadGame () {
    let data
    try {
        data = JSON.parse(localStorage.getItem('data'))
    } catch (error) {
    }
    if(data != null) {
        if(data.secret === secret) {
            attempts = data.attempts
        }
    }
}

function saveGame () {
    let data = JSON.stringify({
        secret,
        attempts
    })
    try {
        localStorage.setItem('data', data )
        
    } catch (error) {}
}

function updateGrid() {
    for(let i = 0; i < 6 ;i++) {
        let row = grid.children[i]
        if(i < attempts.length) {
            drawAttempt(row, attempts[i], true)
        } else if ( i === attempts.length) {
            drawAttempt(row, currentAttempt, false)
        } else {
            drawAttempt(row, '' , false)
        }
    }
}

function drawAttempt(row, attempt, solved) {
    for( let i =0 ; i < 5 ; i++) {
        let cell = row.children[i]
        let surface = cell.firstChild
        let front = surface.children[0]
        let back = surface.children[1]
        if(attempt[i] !== undefined) {
            front.textContent = attempt[i]
            back.textContent = attempt[i]
        } else {
            //lol-hack
            front.innerHTML = '<div style="opacity:0">X</div>'
            back.innerHTML = '<div style="opacity:0">X</div>'

            //hack
            clearAnimation(cell)
        }
        front.style.backgroundColor = BLACK
        front.style.borderColor = ''
        if(attempt[i] !== undefined) {
            front.style.borderColor = MIDDLEGREY
        }
        back.style.backgroundColor = getBgColor(attempt, i)
        back.style.borderColor = getBgColor(attempt, i)    
        if(solved) {
            cell.classList.add('solved')
        } else {
            cell.classList.remove('solved')
        }
    }

}

function getBgColor ( attempt , i) {
    let correctLetter = secret[i]
    let attemptLetter = attempt[i]
    if ( 
        attemptLetter ===undefined || 
        secret.indexOf(attemptLetter) === -1 ) {
        return GREY
    } 
    if(correctLetter === attemptLetter) {
        return GREEN
    }

    return YELLOW
}
function handleKeyDown (e) {
    if( e.ctrlKey || e.metaKey || e.altKey) {
        return
    }
    handleKey(e.key)
}

function animatePress (index) {
    let reowIndex = attempts.length
    let row = grid.children[reowIndex]
    let cell = row.children[index]
    cell.style.animationName = 'press'
    cell.style.animationDuration = '100ms'
    cell.style.animationTimingFunction = 'ease-out'
}

function clearAnimation (cell) {
    cell.style.animationName = ''
    cell.style.animationDuration = ''
    cell.style.animationTimingFunction = ''
}

function handleKey(key) {
    if(attempts.length === 6) {
        return
    }
    if(isAnimating) { 
        return
    }
    let letter = key.toLowerCase()
    if(letter === 'enter') {
        if(currentAttempt.length < 5) {
            return
        }

        if(!wordList.includes(currentAttempt)) {
            alert('Not in my dict')
            return
        }
        if(attempts.length === 5  && currentAttempt !== secret) {
            alert(secret)
        }
        attempts.push(currentAttempt)
        currentAttempt = ''
        updateKeyBoard()
        saveGame()
        pauseInput()
    } else if ( letter === 'backspace' ){
        currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1)
    } else if(/^[a-z]$/.test(letter)) {
        if(currentAttempt.length < 5) {
            currentAttempt += letter
            animatePress(currentAttempt.length -1)
        }
    }
    updateGrid()
}
let isAnimating = false
function pauseInput() {
    if(isAnimating) {
        throw Error('should not happen')
    }
    isAnimating = true
    setTimeout(() => {
        isAnimating = false

    }, 2000)
}
function buildKeyBoard() {
    buildKeyBoardRow('qwertyuiop', false)
    buildKeyBoardRow('asdfghjkl', false)
    buildKeyBoardRow('zxcvbnm', true)

}

function buildKeyBoardRow(letters, isLastRow) {
    let row = document.createElement('div')
    if(isLastRow) {
        let button = document.createElement('button')
        button.className = 'button'
        button.textContent = 'Enter'
        button.style.backgroundColor = LIGHTGREY
        button.onclick = () => {
           handleKey('enter')
        }
        row.appendChild(button)
    }
    for(let letter of letters) {
        let button = document.createElement('button')
        button.className = 'button'
        button.textContent = letter
        button.style.backgroundColor = LIGHTGREY
        keyboardButtons.set(letter, button)
        button.onclick = () => {
            handleKey(letter)
        }
        row.appendChild(button)
    }
    if(isLastRow) {
        let button = document.createElement('button')
        button.className = 'button'
        button.textContent = 'BackSpace'
        button.style.backgroundColor = LIGHTGREY
        button.onclick = () => {
            handleKey('backspace')
        }
        row.appendChild(button)
    }
    keyboard.appendChild(row)
}
function getBetterColor(a, b) {
    if ( a === GREEN || b === GREEN) {
        return GREEN
    }
    if ( a === YELLOW || b === YELLOW) {
        return YELLOW
    }

    return GREY
}
function updateKeyBoard () {
    let bestColors = new Map()
    for (let attempt of attempts) {
        for(let i=0; i< attempt.length ; i++) {
            let color = getBgColor(attempt, i)
            let key = attempt[i]
            let bestColor = bestColors.get(key)
            bestColors.set(attempt[i], getBetterColor(color, bestColor))
        }

    }
    for(let [key, button] of keyboardButtons) {
        button.style.backgroundColor = bestColors.get(key)
        button.style.borderColor = bestColors.get(key)
    }
}

loadGame()
buildGrid()
buildKeyBoard()
updateGrid()
window.addEventListener('keydown', handleKeyDown)
document.addEventListener('click' , updateGrid)