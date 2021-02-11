const rulesBtn = document.querySelector('#rulesBtn')
const rulesLanding = document.querySelector('#modalRulesLand')
const rulesBtnClose = document.querySelector('#closeRules')

const toggleRules = () => {
  rulesLanding.classList.remove('hidden')
  rulesLanding.classList.add('slide-in')
}

const closeRules = () => {
  rulesLanding.classList.remove('slide-in')
  rulesLanding.classList.add('hidden')
  rulesLanding.classList.add('slide-out')
}

rulesBtn.addEventListener('click', toggleRules)
rulesBtnClose.addEventListener('click', closeRules)
