/* ----------------  
... GLOBAL VARIABLES 
------------------*/
const BODY = document.querySelector('body')
const feedbackDisplay = document.querySelector('#feedbackDisplay')
const inputDisplay = document.querySelector('#inputDisplay')
const letters = document.querySelectorAll('.letter')
const deleteBtn = document.querySelector('#deleteBtn')
const shuffleBtn = document.querySelector('#shuffleBtn')
const puzMe = document.querySelector('#puzMe')
const centerLetter = document.querySelector('#centerLetter')
/* ----------------  
... PUZ STATE 
------------------*/
// ok to have default puz coded in
const puz = {
  init: {
    set: ['a', 'b', 'c', 'd', 'e', 'f', 'k'],
    center: 'a'
  },
  order: ['b', 'c', 'd', 'e', 'f', 'k'],
  input: '',
  enter: false,
  pangrams: [], // idx of each pangram in the mainWordList
  bleeps: [] // idx of each bleep word in the mainWordList
}

/* ----------------  
... FUNCTIONS 
------------------*/

const validatePuz = () => {} // verify puz.init state meets conditions for gameplay; must return true before puz loads. Else invoke newPuz()

// const calcWords = () => {

//   calcPangrams()
//   calcBleeps()
// } // calculate all possible words; then invoke

const calcPangrams = () => {} // calculate all possible pangrams; update puz state

const calcBleeps = () => {} // calculate all possible bleep words; update puz state

const calcCenter = () => {
  let index = Math.floor(Math.random() * puz.init.set.length)
  let center = puz.init.set[index]

  // calcWords()
  updateCenter(center)
  snipCenter(index)
} // calculate center letter of the puz; update puz state

const newPuzzle = () => {
  let newPuz = combos[Math.round(Math.random() * combos.length)]
  puz.init.set = [...newPuz]
  calcCenter()
} // fetch a random element from helpers `combo` variable. assign each character to a letter.value

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

const snipCenter = (centerIdx) => {
  let arr = [...puz.init.set]
  arr.splice(centerIdx, 1)
  puz.order = arr

  shuffleOrder()
} // remove the center item from the puz.init.set array and return a new array

const shuffleOrder = () => {
  let array = puz.order
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))

    ;[array[i], array[j]] = [array[j], array[i]]
  }
  puz.order = array
  updateLetters()
} // get the puz.init.set array and return a new randomized order array using Fisher-Yates shuffle; update puz state

const updateCenter = (c) => {
  puz.init.center = `${c}`
  displayCenter()
}

const updateLetters = () => {
  for (let i = 0; i < puz.order.length; i++) {
    letters.forEach((letter) => {
      if (letter.dataset.idx === `${i}`) {
        letter.dataset.value = puz.order[i]
      }
    })
  }
  displayLetters()
} // whenever puz.order is updated, set letter.value equal to its respective idx value in

/* ----------------  
... UI 
------------------*/
const displayCenter = () => {
  centerLetter.dataset.value = puz.init.center
  centerLetter.innerText = centerLetter.dataset.value
}

const displayLetters = () => {
  letters.forEach((letter) => {
    letter.innerText = letter.dataset.value
  })
} // whenever letter.value is updated, set letter.innerText to equal letter.value

const displayInput = () => {
  inputDisplay.dataset.value = puz.input
  inputDisplay.innerText = inputDisplay.dataset.value.toUpperCase()
} // whenever its displayInput.value is changed update the innerText of displayInput to equal displayInput.value

/* ----------------  
... EVENT LISTENERS 
------------------*/

letters.forEach((letter) => letter.addEventListener('click', updateInput))
deleteBtn.addEventListener('click', deleteLetter)
puzMe.addEventListener('click', newPuzzle)
shuffleBtn.addEventListener('click', shuffleOrder)
