const playerAction = process.argv[process.argv.length - 1]

const random = Math.random() * 3
let computerAction;

if (random < 1) {
  computerAction = 'rock'
} else if (random > 2) {
  computerAction = 'scissors'
} else {
  computerAction = 'paper'
}

if (computerAction == playerAction) {
  console.log(computerAction, 'draw!')
} else if (
  (computerAction === 'rock' && playerAction === 'paper') ||
  (computerAction === 'scissors' && playerAction === 'rock') ||
  (computerAction === 'paper' && playerAction === 'scissors')
){
  console.log(computerAction, 'You win!')
} else {
  console.log(computerAction, 'You lose!')
}