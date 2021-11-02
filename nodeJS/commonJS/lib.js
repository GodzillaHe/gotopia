module.exports = function (playerAction) {
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
    return 0
  } else if (
    (computerAction === 'rock' && playerAction === 'paper') ||
    (computerAction === 'scissors' && playerAction === 'rock') ||
    (computerAction === 'paper' && playerAction === 'scissors')
  ){
    console.log(computerAction, 'You win!')
    return -1
  } else {
    console.log(computerAction, 'You lose!')
    return 1
  }
}
