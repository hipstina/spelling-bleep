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
const resetMe = document.querySelector('#resetMe')
const colorScheme = document.querySelector('#colorScheme')
const centerLetter = document.querySelector('#centerLetter')
const wordList = document.querySelector('#wordList')
const wordlistTally = document.querySelector('#wordlistTally')
const playerRank = document.querySelector('#playerRank')
const playerScore = document.querySelector('#playerScore')
const demoBtn = document.querySelector('#demoBtn')

/* ----------------  
... PUZ STATE 
------------------*/
// ok to have default puz coded in
const puz = {
  valid: false,
  init: {
    set: ['b', 'c', 'k', 'l', 'o', 'r', 'a'],
    center: 'o'
  },
  order: ['b', 'c', 'k', 'l', 'r', 'a'],
  input: '',
  score: 0,
  maxScore: 0,
  // rank: function () {
  //   ;`Beginner (${this.puz.score} out of ${this.puz.maxScore})`
  // },
  rank: `Beginner`,
  genius: false,
  smartass: false,
  feedback: '',
  wordlist: [] // player's valid words including pangrams & bleeps
}

/* ----------------------------------------------  
... FUNCTIONS 
------------------------------------------------*/

/* ----------------  
... PUZ SETUP 
------------------*/

const optimizePuz = () => {
  let puzzle = calcWordlist(puz.init.set)
  let maxScore = calcMaxScore(puzzle)
  let pangrams = calcAllPangrams(puzzle)
  let bleeps = calcAllBleeps(puzzle)
  if (puzzle.length > 20) {
    if (pangrams >= 1) {
      if (bleeps >= 1) {
        puz.valid = true
        // console.log('✓ max words', puzzle.length)
        // console.log('✓ max score', maxScore)
        // console.log('✓ pangrams', pangrams)
        // console.log('✓ bleeps', bleeps)
        return
      } else {
        puz.valid = false
        newPuzzle()
      }
    } else {
      puz.valid = false
      newPuzzle()
    }
  } else {
    puz.valid = false
    newPuzzle()
  }
} // optimize each puz. There should be at least 1 pangram and 1 bleep per letter set.

const calcAllPangrams = (wordlist) => {
  let allPangrams = []
  wordlist.forEach((word) => {
    if (isPangram(puz.init.set, word) === true) {
      allPangrams.push(word)
    }
  })
  // console.log('pangrams', allPangrams)
  return allPangrams.length
}

const calcAllBleeps = (wordlist) => {
  let allBleeps = []
  wordlist.forEach((word) => {
    if (word.indexOf(puz.init.center) === -1) {
      return allBleeps.length
    }

    if (isBleep(bleeps, word) === true) {
      // console.log(puz.init.center)

      if (allBleeps.indexOf(word) === -1) {
        allBleeps.push(word)
      }
    }
  })
  // console.log('bleeps', allBleeps)
  return allBleeps.length
}

const calcWordlist = (charSet) => {
  let allWords = [...words, ...bleeps]
  let wordlistSet = []

  allWords.map((word) => {
    let isIncluded = [...word].every((letter) => {
      if (charSet.indexOf(letter) !== -1) return true
    })

    if (isIncluded) {
      wordlistSet.push(word)
    }
  })

  let everyWord = wordlistSet.filter((word) => {
    return word.includes(puz.init.center) && word.length > 3 ? true : false
  })

  return everyWord
}

const isPangram = (charSet, word) => {
  let set = {}
  charSet.map((letter) => {
    return set[letter] ? null : (set[letter] = 0)
  })
  ;[...word].map((l) => {
    return set[l] ? set[l]++ : (set[l] = 1)
  })

  let pangram = Object.values(set).every((char) => {
    return char > 0
  })
  if (pangram === true) {
    return pangram
  }
}

const updatePangram = () => {
  return puz.pangrams.push(puz.input)
}

const isBleep = (charSet, word) => {
  if (charSet.indexOf(word) !== -1) {
    return true
  }
}

const updateBleeps = () => {
  return puz.bleeps.push(puz.input)
}

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
  } else {
    updateCenter(center)
    snipCenter(index)
  }
}

const newPuzzle = (e) => {
  let newPuz = combos[Math.round(Math.random() * combos.length)]
  // console.log(`newPuz: ${newPuz}`)
  if (newPuz.includes('s')) {
    // console.log(`✕ includes 's'`)
    return newPuzzle()
  } else if (newPuz.includes('j')) {
    // console.log(`✕ includes 'j'`)
    return newPuzzle()
  } else if (newPuz.includes('q')) {
    // console.log(`✕ includes 'q'`)
    return newPuzzle()
  } else if (newPuz.includes('v')) {
    // console.log(`✕ includes 'v'`)
    return newPuzzle()
  } else if (newPuz.includes('x')) {
    // console.log(`✕ includes 'x'`)
    return newPuzzle()
  } else if (newPuz.includes('z')) {
    // console.log(`✕ includes 'z'`)
    return newPuzzle()
  } else {
    // console.log(`✓ does not include 'j,q,s,v,x,z'`)
    puz.init.set = [...newPuz]
    calcCenter()
    optimizePuz()
    clearWordlist(e)
    resetScore()
  }
}

const resetPuz = () => {
  puz.feedback = ''
  clearWordlist()
  resetScore()
}

const snipCenter = (centerIdx) => {
  let arr = [...puz.init.set]
  arr.splice(centerIdx, 1)
  puz.order = arr
  shuffleOrder()
}

const updateInput = (e) => {
  if (e.target.dataset.value !== '') {
    puz.input += e.target.dataset.value.toLowerCase()
    displayInput()
  } else {
    // puz.input = ''
    clearInput()
    displayInput()
  }
} // when a letter button is clicked, append the letter.value to puz.input; then set displayInput.value equal to puz.input

const clearInput = () => {
  inputDisplay.classList.add('fadeout-input')
  setTimeout(function () {
    puz.input = ''
    displayInput()
    inputDisplay.classList.remove('fadeout-input')
  }, 1000)
}

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
  if (puz.input.length > 19) {
    updateFeedback('too long')
    clearInput()
    return
  }

  if (puz.input.includes(puz.init.center)) {
    // console.log('✓ includes center letter')
    if (puz.input.length > 3) {
      // console.log('✓ 4 or more letters')
      if (puz.wordlist.indexOf(puz.input) === -1) {
        // console.log('✓ not already found')
        validateWord(e)
      } else {
        // console.log('✕ already found')
        updateFeedback('already found')
        clearInput()
        return
      }
    } else {
      // console.log('✕ too short')
      updateFeedback('too short')
      clearInput()
      return
    }
  } else {
    // console.log('✕ missing center letter')
    updateFeedback('missing center letter')
    clearInput()
    return
  }
}

const validateWord = (e) => {
  let allWords = [...words, ...bleeps]
  if (allWords.indexOf(puz.input) !== -1) {
    // console.log('✓ in our wordlist')
  } else {
    // console.log('✕ not in our wordlist')
    updateFeedback('not in our wordlist')
    clearInput()
    return
  }

  if (isPangram(puz.init.set, puz.input) === true) {
    // console.log('✓ pangram!')

    calcWordScore(puz.input.length, 7)
    updateFeedback(`pangram! +${puz.input.length + 7} pts`)
    displayFeedback()
    updateWordlist(e)
    return
  } else {
    // console.log('✕ not a pangram ')
  }

  if (isBleep(bleeps, puz.input) === true) {
    // console.log("✓ that's a bleep!")

    calcWordScore(puz.input.length, 10)

    puz.input.length === 4
      ? updateFeedback(`bleep word! +${11} pts`)
      : updateFeedback(`bleep word! +${puz.input.length + 10} pts`)

    displayFeedback()
    updateWordlist(e)
    return
  } else {
    // console.log('✕ not a bleep ')
  }

  calcWordScore(puz.input.length)
  updateWordlist(e)
  return
}

const updateFeedback = (str) => {
  //switch statement
  puz.feedback = str
  displayFeedback()
}

/* ----------------  
... WORDLIST 
------------------*/

const clearBonusWords = () => {
  puz.bleeps = []
  puz.pangrams = []
}

const clearWordlist = () => {
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
  if (puz.input !== '') {
    puz.wordlist.push(puz.input)

    let temp = [...puz.wordlist].sort((a, b) => {
      return a.localeCompare(b)
    })

    puz.wordlist = [...temp]
    displayWordlist(e)
    updateWordTally()
  }
}

/* ----------------  
... SCORING + RANKINGS
------------------*/
const resetScore = () => {
  puz.score = 0
  puz.rank = `Beginner `
  displayScore()
  updateRank()
}

const calcMaxScore = (wordcount) => {
  let maxScore = wordcount.reduce((score, word) => {
    if (word.length < 3) {
      score += 0
    } else if (word.length === 4) {
      score += 1
    } else if (word.length > 4) {
      score += word.length
    }

    return score
  }, 0)
  puz.maxScore = maxScore
  setRankings(maxScore)
  return maxScore
}

const setRankings = () => {
  if (puz.maxScore < 366) {
    puz
  } else if (puz.maxScore > 366 && puz.maxScore < 900) {
  }
} // ice-box

const calcWordScore = (charLength, bonus) => {
  if (charLength < 3) {
    puz.score += 0
  } else if (charLength === 4) {
    puz.score += 1
    updateFeedback(`nice! +1 pts`)
  } else if (charLength > 4) {
    puz.score += charLength * 1
    updateFeedback(`great! +${charLength} pts`)
  }

  if (bonus === 10) {
    puz.score += bonus
  } else if (bonus === 7) {
    puz.score += bonus
  }

  {
    displayScore()
    updateRank()
  }
}

const updateRank = () => {
  let num = puz.maxScore < 360 ? Math.floor(puz.maxScore * 0.3) : 170

  if (puz.score === 0) {
    puz.rank = `Beginner ${puz.score}`
  } else if (puz.score < Math.floor(num * 0.02)) {
    puz.rank = `Good start ${puz.score} `
  } else if (puz.score < Math.floor(num * 0.05)) {
    puz.rank = `Moving up ${puz.score} `
  } else if (puz.score < Math.floor(num * 0.08)) {
    puz.rank = `Good ${puz.score} `
  } else if (puz.score < Math.floor(num * 0.15)) {
    puz.rank = `Solid ${puz.score} `
  } else if (puz.score < Math.floor(num * 0.33)) {
    puz.rank = `Nice ${puz.score} `
  } else if (puz.score < Math.floor(num * 0.4)) {
    puz.rank = `Great ${puz.score} `
  } else if (puz.score < Math.floor(num * 0.5)) {
    puz.rank = `Amazing ${puz.score} `
  } else if (puz.score < Math.floor(num * 0.69)) {
    puz.rank = `Genius ${puz.score} `
    alertGenius()
  } else {
    puz.rank = `Smart Ass ${puz.score} `
    alertSmartass()
  }

  return displayRank()
}

/* ----------------  
... UI 
------------------*/
const alertGenius = () => {
  if (puz.genius === false) {
    alert('Congratulations! You reached Genius rank!')
    puz.genius = true
  } else return
}

const alertSmartass = () => {
  if (puz.smartass === false) {
    alert('Hell yeah. You are a Smart Ass.')
    puz.smartass = true
  } else return
}

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
  try {
    while (wordList.firstChild) {
      wordList.removeChild(wordList.firstChild)
    }
  } catch (error) {
    console.log(error)
  }

  puz.wordlist.forEach((word) => {
    let li = document.createElement('li')
    li.setAttribute('class', 'wordlist-item')
    li.innerText = word
    wordList.appendChild(li)
    updateInput(e)
  })
}

const displayRank = () => {
  playerRank.innerText = `${puz.rank}`
}

const displayScore = () => {
  playerScore.value = puz.score
  playerScore.innerText = `${playerScore.value}`
}

const displayFeedback = () => {
  feedbackDisplay.innerText = `${puz.feedback}`

  // feedbackDisplay.className = 'fadeout'
  feedbackDisplay.classList.add('fadeout-fb')
  setTimeout(function () {
    feedbackDisplay.innerText = ''
    feedbackDisplay.classList.remove('fadeout-fb')
  }, 2300)
}

const setColScheme = () => {
  if (colorScheme.innerText === '☀') {
    colorScheme.innerText = '☾'
    BODY.style.backgroundColor = '#5555ea'
    BODY.style.color = '#dedef7'
  } else {
    colorScheme.innerText = '☀'
    BODY.style.backgroundColor = '#edf094'
    BODY.style.color = '#232130'
  }
}

/* ----------------  
... DEMO 
------------------*/
const fillPuzState = (e) => {
  puz.wordlist = [
    'Blob',
    'Block',
    'Book',
    'Cobra',
    'Cock',
    'Cocoa',
    'Collar',
    'Cool',
    'Cork',
    'Corral',
    'Croak',
    'Koala',
    'Labor',
    'Local',
    'Look',
    'Roar'
  ]
  puz.score = 59
  puz.rank = `Nice ${puz.score}`
  playerRank.innerText = `${puz.rank}`
  displayWordlist(e)
  updateWordTally()
  displayScore()
}
/* ----------------  
... EVENT LISTENERS 
------------------*/

letters.forEach((letter) => letter.addEventListener('click', updateInput))
deleteBtn.addEventListener('click', deleteLetter)
shuffleBtn.addEventListener('click', shuffleOrder)
enterBtn.addEventListener('click', validateInput)

puzMe.addEventListener('click', newPuzzle)
resetMe.addEventListener('click', resetPuz)
colorScheme.addEventListener('click', setColScheme)
// demoBtn.addEventListener('click', fillPuzState)
window.addEventListener('load', optimizePuz)
