'use strict'

let grid = document.getElementById('grid')
let keyboard = document.getElementById('keyboard')

let GREY = '#212121'
let LIGHTGREY = '#888'
let GREEN = '#538d4e'
let YELLOW = '#b59f3b'
let BLACK = '#111'
function buildGrid() {
    for( let i = 0; i < 6 ; i++) {
        let row = document.createElement('div')
        for(let j = 0 ;j < 5; j++ ) {
            let cell = document.createElement('div')
            cell.className = 'cell'
            cell.textContent = ''
            row.appendChild(cell)
        }
    grid.appendChild(row)

    }
}

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
let secret = wordList[randomIndex]
let keyboardButtons = new Map()
let attempts = []
let currentAttempt = ''

buildGrid()
buildKeyBoard()
updateGrid()
window.addEventListener('keydown', handleKeyDown)

function updateGrid() {
    let row = grid.firstChild
    for ( let attempt of attempts) {
        drawAttempt(row, attempt, false)
        row = row.nextSibling

    }
    drawAttempt(row, currentAttempt, true)
}

function drawAttempt(row, attempt, isCurrent) {
    for( let i =0 ; i < 5 ; i++) {
        let cell = row.children[i]
        if(attempt[i] !== undefined) {
            cell.textContent = attempt[i]
        } else {
            //lol-hack
            cell.innerHTML = '<div style="opacity:0">X</div>'
        }
        if(isCurrent) {
            
            cell.style.backgroundColor = BLACK

        } else {
            cell.style.backgroundColor = getBgColor(attempt, i)
        }

        
    }

}

function getBgColor ( attempt , i) {

    let correctLetter = secret[i]
    let attemptLetter = attempt[i]


    if( attemptLetter ===undefined || secret.indexOf(attemptLetter) === -1 ) {
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

function handleKey(key) {
    let letter = key.toLowerCase()
    if(letter === 'enter') {
        if(currentAttempt.length < 5) {
            return
        }

        if(!wordList.includes(currentAttempt)) {
            alert('Not in my dict')
            return
        }

        attempts.push(currentAttempt)
        currentAttempt = ''
    } else if ( letter === 'backspace' ){
        currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1)
    } else if(/^[a-z]$/.test(letter)) {
        if(currentAttempt.length < 5) {
            currentAttempt += letter
        }
    }
    updateGrid()
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

function updateKeyBoard () {

}

document.addEventListener('click' , updateGrid)