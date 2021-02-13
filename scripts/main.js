console.log(`Stuck? 🐝 Invoke 'hint()' in the console.`)
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
  percent: 0,
  rank: `Beginner 0%`,
  genius: false,
  smartass: false,
  feedback: '',
  wordlist: []
}

/* ----------------------------------------------  
... FUNCTIONS 
------------------------------------------------*/

const hint = () => {
  let hints = calcWordlist(puz.init.set)
  let hint = hints[Math.floor(Math.random() * hints.length)]
  return hint
}

/* ----------------  
... PUZ SETUP 
------------------*/

const optimizePuz = () => {
  let puzzle = calcWordlist(puz.init.set)
  let maxScore = calcMaxScore(puzzle)
  let pangrams = calcAllPangrams(puzzle)
  let bleeps = calcAllBleeps(puzzle)
  if (puzzle.length >= 60) {
    if (pangrams >= 1) {
      if (bleeps >= 1) {
        puz.valid = true

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
}

const calcAllPangrams = (wordlist) => {
  let allPangrams = []
  wordlist.forEach((word) => {
    if (isPangram(puz.init.set, word) === true) {
      allPangrams.push(word)
    }
  })
  return allPangrams.length
}

const calcAllBleeps = (wordlist) => {
  let allBleeps = []
  wordlist.forEach((word) => {
    if (word.indexOf(puz.init.center) === -1) {
      return allBleeps.length
    }

    if (isBleep(bleeps, word) === true) {
      if (allBleeps.indexOf(word) === -1) {
        allBleeps.push(word)
      }
    }
  })
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
    calcCenter()
  } else {
    updateCenter(center)
    snipCenter(index)
  }
}

const newPuzzle = (e) => {
  let newPuz = combos[Math.round(Math.random() * combos.length)]
  if (newPuz.includes('s')) {
    return newPuzzle()
  } else if (newPuz.includes('j')) {
    return newPuzzle()
  } else if (newPuz.includes('q')) {
    return newPuzzle()
  } else if (newPuz.includes('v')) {
    return newPuzzle()
  } else if (newPuz.includes('x')) {
    return newPuzzle()
  } else if (newPuz.includes('z')) {
    return newPuzzle()
  } else {
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
  if (puz.input.length > 19) {
    updateFeedback('too long')
    clearInput()
    return
  }

  if (e.target.dataset.value !== '') {
    puz.input += e.target.dataset.value.toLowerCase()
    displayInput()
  } else {
    clearInput()
    displayInput()
  }
}

const clearInput = () => {
  displayInput()
  setTimeout(function () {
    puz.input = ''
    displayInput()
  }, 300)
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
}

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
}

const shuffleOrder = () => {
  let array = puz.order
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))

    ;[array[i], array[j]] = [array[j], array[i]]
  }
  puz.order = array
  updateLetters()
}
const validateInput = (e) => {
  if (puz.input.includes(puz.init.center)) {
    if (puz.input.length > 3) {
      if (puz.wordlist.indexOf(puz.input) === -1) {
        validateWord(e)
      } else {
        updateFeedback('already found')
        clearInput()
        return
      }
    } else {
      updateFeedback('too short')
      clearInput()
      return
    }
  } else {
    updateFeedback('missing center letter')
    clearInput()
    return
  }
}

const validateWord = (e) => {
  let allWords = [...words, ...bleeps]
  if (allWords.indexOf(puz.input) !== -1) {
  } else {
    updateFeedback('not in our wordlist')
    clearInput()
    return
  }

  if (isPangram(puz.init.set, puz.input) === true) {
    calcWordScore(puz.input.length, 7)
    updateFeedback(`pangram! +${puz.input.length + 7} pts`)
    displayFeedback()
    updateWordlist(e)
    return
  } else {
  }

  if (isBleep(bleeps, puz.input) === true) {
    calcWordScore(puz.input.length, 10)

    puz.input.length === 4
      ? updateFeedback(`bleep word! +${11} pts`)
      : updateFeedback(`bleep word! +${puz.input.length + 10} pts`)

    displayFeedback()
    updateWordlist(e)
    return
  } else {
  }

  calcWordScore(puz.input.length)
  updateWordlist(e)
  return
}

const updateFeedback = (str) => {
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
  puz.percent = 0
  puz.rank = `Beginner 0%`
  puz.smartass = false
  puz.genius = false
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
}

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
  let meter = Math.round((puz.score / Math.floor(num * 0.69)) * 100)
  console.log(meter)
  if (puz.score === 0) {
    puz.rank = `Beginner 0%`
    puz.percent = meter
  } else if (puz.score < Math.floor(num * 0.02)) {
    puz.rank = `Good start ${meter}% `
    puz.percent = meter
  } else if (puz.score < Math.floor(num * 0.05)) {
    puz.rank = `Moving up ${meter}%`
    puz.percent = meter
  } else if (puz.score < Math.floor(num * 0.08)) {
    puz.rank = `Good ${meter}%`
    puz.percent = meter
  } else if (puz.score < Math.floor(num * 0.15)) {
    puz.rank = `Solid ${meter}%`
    puz.percent = meter
  } else if (puz.score < Math.floor(num * 0.33)) {
    puz.rank = `Nice ${meter}%`
    puz.percent = meter
  } else if (puz.score < Math.floor(num * 0.4)) {
    puz.rank = `Great ${meter}%`
    puz.percent = meter
  } else if (puz.score < Math.floor(num * 0.5)) {
    puz.rank = `Amazing ${meter}%`
    puz.percent = meter
  } else if (puz.score < Math.floor(num * 0.69)) {
    puz.rank = `Genius ${meter}%`
    puz.percent = meter
    alertGenius()
  } else {
    puz.rank = `Smart Ass ${meter}% `
    puz.percent = meter
    alertSmartass()
  }

  displayScore()
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
}

const displayInput = () => {
  inputDisplay.dataset.value = puz.input
  inputDisplay.innerText = inputDisplay.dataset.value.toUpperCase()
}

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
  playerScore.value = puz.percent
  playerScore.innerText = `${playerScore.value}`
}

const displayFeedback = () => {
  feedbackDisplay.innerText = `${puz.feedback}`

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
... DEMO (TESTING)
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

window.addEventListener('load', optimizePuz)
