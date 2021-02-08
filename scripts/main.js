console.log('buzz')
// GLOBAL VARIABLES
const BODY = document.querySelector('body')
const feedbackDisplay = document.querySelector('#feedbackDisplay')
const inputDisplay = document.querySelector('#inputDisplay')
const letters = document.querySelectorAll('.letter')
const deleteBtn = document.querySelector('#deleteBtn')

/*  puzzle state */
// ok to have default puz coded in
const puz = {
  onload: {
    set: ['a', 'b', 'c', 'd', 'e', 'f', 'k'],
    center: 'a'
  },
  order: ['b', 'c', 'd', 'e', 'f', 'k'],
  input: '',
  enter: false,
  pangrams: ['feedback'],
  bleeps: ['']
}

/*  FUNCTIONS - internal logic */

const validatePuz = () => {} // verify puz.onload state meets conditions for gameplay; must return true before puz loads. Else invoke newPuz()

const calcPangrams = () => {} // calculate all possible pangrams; update puz state

const calcBleeps = () => {} // calculate all possible bleep words; update puz state

const randomIdx = () => {} // generate random integer

const calcCenter = () => {} // calculate a random center letter

const newPuzzle = () => {} // invoke randomIdx and use it to fetch an element from helpers `combo` variable. assign each character to a letter.value

const updateInput = (e) => {
  puz.input += e.target.dataset.value

  displayInput()
} // when a letter button is clicked, append the letter.value to puz.input; then set displayInput.value equal to puz.input

const deleteLetter = () => {
  let temp = [...puz.input]
  temp.pop()
  if (puz.input) {
    puz.input = temp.join('')
    displayInput()
  }
} // remove the last character on the displayInput.value. Use splice()

const shuffleLetters = () => {} // get the puz.onload.set array and return a new randomized order array; save randomized order to puz.order (exclude center letter)

const updateLetter = () => {} // whenever puz.order is updated, set letter.value equal to its respective idx value in

/*  FUNCTIONS - UI */
const displayLetter = () => {} // whenever letter.value is updated, set letter.innerText to equal letter.value

const displayInput = () => {
  inputDisplay.dataset.value = puz.input
  inputDisplay.innerText = inputDisplay.dataset.value
} // whenever its displayInput.value is changed update the innerText of displayInput to equal displayInput.value

// EVENT LISTENERS

letters.forEach((letter) => letter.addEventListener('click', updateInput))
deleteBtn.addEventListener('click', deleteLetter)
