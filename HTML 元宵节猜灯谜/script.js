document.addEventListener('DOMContentLoaded', () => {
  const puzzles = {
    1: [
      { question: '有头无颈，有眼无眉，没脚能走，有翅难飞（打一动物）', answer: '鱼' },
      { question: '小时四只脚，大时两只脚，老时三只脚（打一动物）', answer: '人' },
      { question: '白嫩小宝宝，洗澡吹泡泡，洗洗身体小，再洗不见了（打一物）', answer: '香皂' },
    ],
    2: [
      { question: '哑巴吵架（打一成语）', answer: '有口难言' },
      { question: '超级好牙刷（打一成语）', answer: '一毛不拔' },
      { question: '快递公司合并（打一成语）', answer: '信手拈来' },
    ],
    3: [
      { question: '春色满园关不住（打《红楼梦》人名）', answer: '红杏' },
      { question: '轻舟已过万重山（打一字）', answer: '惺' },
      { question: '爆竹声中一岁除（打《诗经》一句）', answer: '新年伊始' },
    ],
  }

  let currentLevel = 1
  let currentPuzzleIndex = 0
  let score = 0
  let timeLeft = 60
  let timerId

  // 初始化粒子特效
  particlesJS('particles-js', {
    particles: {
      number: { value: 80 },
      color: { value: '#ffd700' },
      shape: { type: 'circle' },
      opacity: { random: true },
      size: { value: 3 },
      move: {
        enable: true,
        speed: 3,
        direction: 'none',
        random: true,
      },
    },
  })

  // 难度切换
  document.querySelectorAll('.difficulty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelector('.difficulty-btn.active').classList.remove('active')
      btn.classList.add('active')
      currentLevel = parseInt(btn.dataset.level)
      currentPuzzleIndex = 0
      loadPuzzle()
      resetTimer()
    })
  })

  // 提交答案
  document.querySelector('.submit-btn').addEventListener('click', checkAnswer)
  document.querySelector('.answer-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer()
  })

  function loadPuzzle() {
    const puzzle = puzzles[currentLevel][currentPuzzleIndex]
    document.querySelector('.puzzle-text').textContent = puzzle.question
    document.querySelector('.answer-input').value = ''
  }

  function checkAnswer() {
    const userAnswer = document.querySelector('.answer-input').value.trim()
    const correctAnswer = puzzles[currentLevel][currentPuzzleIndex].answer

    if (userAnswer === correctAnswer) {
      score += currentLevel * 10
      document.getElementById('score').textContent = score
      animateLantern()
      currentPuzzleIndex = (currentPuzzleIndex + 1) % puzzles[currentLevel].length
      loadPuzzle()
    } else {
      alert('答案不对哦，再想想～')
    }
  }

  function animateLantern() {
    const lantern = document.querySelector('.lantern')
    lantern.style.transform = 'scale(1.2)'
    setTimeout(() => {
      lantern.style.transform = 'scale(1)'
    }, 300)
  }

  function updateTimer() {
    timeLeft--
    document.getElementById('timer').textContent = timeLeft
    if (timeLeft <= 0) {
      clearInterval(timerId)
      alert(`时间到！最终得分：${score}`)
      resetGame()
    }
  }

  function resetTimer() {
    clearInterval(timerId)
    timeLeft = 60 - (currentLevel - 1) * 15
    document.getElementById('timer').textContent = timeLeft
    timerId = setInterval(updateTimer, 1000)
  }

  function resetGame() {
    score = 0
    currentPuzzleIndex = 0
    document.getElementById('score').textContent = '0'
    loadPuzzle()
    resetTimer()
  }

  // 初始化游戏
  loadPuzzle()
  resetTimer()
})
