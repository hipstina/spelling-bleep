/* ----------------  
... GLOBAL VARIABLES 
------------------*/
const BODY = document.querySelector('body')
const feedbackDisplay = document.querySelector('#feedbackDisplay')
const inputDisplay = document.querySelector('#inputDisplay')
const letters = document.querySelectorAll('.letter')
const deleteBtn = document.querySelector('#deleteBtn')
const shuffleBtn = document.querySelector('#shuffleBtn')
const enterBtn = document.querySelector('#enterBtn')
const puzMe = document.querySelector('#puzMe')
const centerLetter = document.querySelector('#centerLetter')
const wordList = document.querySelector('#wordList')
const wordlistTally = document.querySelector('#wordlistTally')
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
  score: 0,
  rank: 'Beginner',
  wordlist: [], // all words including pangrams & bleeps
  pangrams: [], // idx of each pangram in the mainWordList
  bleeps: [] // idx of each bleep word in the mainWordList,
}

/* ----------------------------------------------  
... FUNCTIONS 
------------------------------------------------*/

/* ----------------  
... PUZ SETUP 
------------------*/

const validatePuz = () => {} // verify puz.init state meets conditions for gameplay; must return true before puz loads. Else invoke newPuz()

// const calcWords = () => {

//   calcPangrams()
//   calcBleeps()
// } // calculate all possible words; then invoke

// const countChars = () => {
//   let set = {}
//   puz.init.set.map((letter) => {
//     return set[letter] ? null : (set[letter] = 0)
//   })
//   ;[...puz.input].map((l) => {
//     return set[l] ? set[l]++ : (set[l] = 1)
//   })
//   console.log('1', set)

//   return set
// }

const isPangram = () => {
  let set = {}
  puz.init.set.map((letter) => {
    return set[letter] ? null : (set[letter] = 0)
  })
  ;[...puz.input].map((l) => {
    return set[l] ? set[l]++ : (set[l] = 1)
  })

  let pangram = Object.values(set).every((char) => {
    return char > 0
  })
  if (pangram === true) {
    updatePangram()

    return pangram
  }
}
// calculate all possible pangrams; update puz state
// each char of puz.init.set must exist in the word at least once
const updatePangram = () => {
  return puz.pangrams.push(puz.input)
}

const isBleep = () => {
  if (bleeps.indexOf(puz.input) !== -1) {
    updateBleeps()
    return true
  }
}

const updateBleeps = () => {
  return puz.bleeps.push(puz.input)
}

const calcBleeps = () => {} // calculate all possible bleep words; update puz state

const calcCenter = () => {
  let index = Math.floor(Math.random() * puz.init.set.length)
  let center = puz.init.set[index]
  if (
    center === 'f' ||
    center === 'g' ||
    center === 'j' ||
    center === 'k' ||
    center === 'q' ||
    center === 's' ||
    center === 'v' ||
    center === 'w' ||
    center === 'x' ||
    center === 'z'
  ) {
    // avoid setting f,g,j,k,q,s,v,w,x, or z as center letter (per nytbee.com stats)
    calcCenter()
  }
  // calcWords()
  else {
    updateCenter(center)
    snipCenter(index)
  }
} // calculate center letter of the puz; update puz state

const newPuzzle = (e) => {
  let newPuz = combos[Math.round(Math.random() * combos.length)]
  puz.init.set = [...newPuz]
  calcCenter()
  clearWordlist(e)
} // fetch a random element from helpers `combo` variable. assign each character to a letter.value

const snipCenter = (centerIdx) => {
  let arr = [...puz.init.set]
  arr.splice(centerIdx, 1)
  puz.order = arr
  shuffleOrder()
} // remove the center item from the puz.init.set array and return a new array

const updateInput = (e) => {
  if (e.target.dataset.value !== '') {
    puz.input += e.target.dataset.value.toLowerCase()
    displayInput()
  } else {
    puz.input = ''
    displayInput()
  }
} // when a letter button is clicked, append the letter.value to puz.input; then set displayInput.value equal to puz.input

const updateCenter = (c) => {
  puz.init.center = `${c.toLowerCase()}`
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
... CONTROL PANEL 
------------------*/
const deleteLetter = () => {
  let temp = [...puz.input]
  temp.pop()
  if (puz.input) {
    puz.input = temp.join('')
    displayInput()
  }
} // remove the last character on the displayInput.value. Use splice()

const shuffleOrder = () => {
  let array = puz.order
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))

    ;[array[i], array[j]] = [array[j], array[i]]
  }
  puz.order = array
  updateLetters()
} // get the puz.init.set array and return a new randomized order array using Fisher-Yates shuffle; update puz state

const validateInput = (e) => {
  if (puz.input.includes(puz.init.center)) {
    console.log('includes center letter')
    if (puz.input.length > 3) {
      console.log('4 or more letters')
      if (puz.wordlist.includes(puz.input) === false) {
        console.log('not already found')
        validateWord(e)
      } else {
        console.log('already found')
        updateInput(e)
      }
    } else {
      console.log('too short')
      updateInput(e)
    }
  } else {
    console.log('no center letter')
    updateInput(e)
  }
}

const validateWord = (e) => {
  if (words.indexOf(puz.input) !== -1) {
    console.log('verified word.')
  } else {
    console.log('not a word in our wordlist ')
  }

  if (isPangram() === true) {
    console.log("it's a pangram!")
  } else {
    console.log('not a pangram ')
    // calcScore()
    // giveFeedback()
  }

  if (isBleep() === true) {
    console.log("that's a bleep!")
    // giveFeedback()
    // calcScore()
  } else {
    console.log('not a bleep ')
    // calcScore()
    // giveFeedback()
  }
  updateWordlist(e)
}

const giveFeedback = () => {}

/* ----------------  
... WORDLIST 
------------------*/

const clearWordlist = (e) => {
  puz.bleeps = []
  puz.pangrams = []
  puz.wordlist = []
  try {
    while (wordList.firstChild) {
      wordList.removeChild(wordList.firstChild)
    }
  } catch (error) {
    console.log(error)
  }
  updateWordTally()
}

const updateWordTally = () => {
  wordlistTally.dataset.value = puz.wordlist.length
  displayTally()
}

const updateWordlist = (e) => {
  // sort in alpha order; iterate through to find idx to splice into
  puz.wordlist.push(puz.input)
  displayWordlist(e)
  updateWordTally()
}

/* ----------------  
... SCORING + RANKINGS
------------------*/

const calcMaxScore = () => {}

const calcRankings = () => {}

const calcScore = () => {
  displayScore()
  updateRank()
} // switch statement

const updateRank = () => {
  displayRank()
}

/* ----------------  
... UI 
------------------*/
const displayCenter = () => {
  centerLetter.dataset.value = puz.init.center
  centerLetter.innerText = centerLetter.dataset.value
}

const displayLetters = () => {
  letters.forEach((letter) => {
    letter.innerText = letter.dataset.value.toUpperCase()
  })
} // whenever letter.value is updated, set letter.innerText to equal letter.value

const displayInput = () => {
  inputDisplay.dataset.value = puz.input
  inputDisplay.innerText = inputDisplay.dataset.value.toUpperCase()
} // whenever its displayInput.value is changed update the innerText of displayInput to equal displayInput.value

const displayTally = () => {
  if (wordlistTally.dataset.value == 1) {
    wordlistTally.innerText = `${wordlistTally.dataset.value} word`
  } else wordlistTally.innerText = `${wordlistTally.dataset.value} words`
}

const displayWordlist = (e) => {
  let li = document.createElement('li')
  li.setAttribute = ('class', 'wordlist-item')
  li.innerText = puz.input
  wordList.appendChild(li)
  updateInput(e)
}

const displayRank = () => {}

const displayScore = () => {}

/* ----------------  
... EVENT LISTENERS 
------------------*/
letters.forEach((letter) => letter.addEventListener('click', updateInput))
deleteBtn.addEventListener('click', deleteLetter)
shuffleBtn.addEventListener('click', shuffleOrder)
enterBtn.addEventListener('click', validateInput)

puzMe.addEventListener('click', newPuzzle)
